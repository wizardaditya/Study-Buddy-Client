import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Github, Linkedin, MapPin, GraduationCap, Zap, Flame, Trophy, Pencil, Loader2, X, UserCheck, UserPlus, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { userService } from "@/services/user.service";
import { connectionService } from "@/services/connection.service";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/lib/utils";

function EditProfileModal({ profile, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: profile.name || "",
    bio: profile.bio || "",
    college: profile.college || "",
    city: profile.city || "",
    state: profile.state || "",
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    skills: profile.skills?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const updated = await userService.updateMe({ ...form, skills });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black">Edit Profile</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} maxLength={300}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground"
              placeholder="Tell people about yourself..." />
            <p className="text-xs text-muted-foreground mt-1">{form.bio.length}/300</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <Input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">State</label>
              <Input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">College / Institute</label>
            <Input name="college" value={form.college} onChange={handleChange} placeholder="IIT Bombay" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Skills <span className="text-muted-foreground font-normal">(comma separated)</span></label>
            <Input name="skills" value={form.skills} onChange={handleChange} placeholder="Arduino, Python, ROS" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">GitHub URL</label>
            <Input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">LinkedIn URL</label>
            <Input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Profile() {
  const { username } = useParams();
  const { user: me, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => userService.getProfile(username),
    enabled: !!username,
  });

  const isOwnProfile = me?._id === profile?._id || me?.username === profile?.username;

  // Connection status
  const { data: connStatus, refetch: refetchConn } = useQuery({
    queryKey: ["connection-status", profile?._id],
    queryFn: () => connectionService.getStatus(profile._id),
    enabled: !!profile?._id && !isOwnProfile,
  });

  const followMutation = useMutation({
    mutationFn: () =>
      profile.isFollowing
        ? userService.unfollow(profile._id)
        : userService.follow(profile._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
  });

  const connectMutation = useMutation({
    mutationFn: () => {
      if (!connStatus) return connectionService.sendRequest(profile._id);
      if (connStatus.status === "accepted") return connectionService.removeConnection(connStatus.connectionId);
      if (connStatus.status === "pending" && connStatus.isSentByMe) return connectionService.removeConnection(connStatus.connectionId);
      if (connStatus.status === "pending" && !connStatus.isSentByMe) return connectionService.acceptRequest(connStatus.connectionId);
      return connectionService.sendRequest(profile._id);
    },
    onSuccess: () => {
      refetchConn();
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20 text-muted-foreground">User not found.</div>;

  const handleProfileSaved = (updated) => {
    updateUser(updated);
    queryClient.invalidateQueries({ queryKey: ["profile", username] });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={handleProfileSaved}
        />
      )}

      {/* Profile header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar className="h-20 w-20 ring-2 ring-border">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-black">{profile.name}</h1>
              {profile.role === "mentor" && (
                <Badge variant="purple" className="text-xs">Mentor</Badge>
              )}
              {profile.plan !== "free" && (
                <Badge variant="secondary" className="text-xs">
                  <Trophy className="h-3 w-3 mr-1" />{profile.plan.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
            {profile.bio && <p className="text-sm mb-3">{profile.bio}</p>}

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              {profile.college && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />{profile.college}
                </span>
              )}
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />{profile.city}{profile.state ? `, ${profile.state}` : ""}
                </span>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                  <Github className="h-3.5 w-3.5" />GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                  <Linkedin className="h-3.5 w-3.5" />LinkedIn
                </a>
              )}
            </div>

            {profile.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {isOwnProfile ? (
              <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
              </Button>
            ) : (
              <>
                {/* Follow button */}
                <Button
                  variant={profile.isFollowing ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                >
                  {followMutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  {profile.isFollowing ? "Unfollow" : "Follow"}
                </Button>

                {/* Connect button */}
                <Button
                  variant={connStatus?.status === "accepted" ? "outline" : "gradient"}
                  size="sm"
                  onClick={() => connectMutation.mutate()}
                  disabled={connectMutation.isPending}
                >
                  {connectMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : connStatus?.status === "accepted" ? (
                    <><UserCheck className="h-3.5 w-3.5 mr-1.5" />Connected</>
                  ) : connStatus?.status === "pending" && connStatus?.isSentByMe ? (
                    <><Clock className="h-3.5 w-3.5 mr-1.5" />Pending</>
                  ) : connStatus?.status === "pending" && !connStatus?.isSentByMe ? (
                    <><UserCheck className="h-3.5 w-3.5 mr-1.5" />Accept</>
                  ) : (
                    <><UserPlus className="h-3.5 w-3.5 mr-1.5" />Connect</>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-border text-center">
          {[
            { label: "Followers", value: profile.followersCount ?? 0 },
            { label: "Following", value: profile.followingCount ?? 0 },
            { label: "XP", value: profile.xp ?? 0, icon: Zap },
            { label: "Streak", value: profile.currentStreak ?? 0, icon: Flame },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <p className="text-xl font-black">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="doubts">Doubts</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <p className="text-center py-8 text-muted-foreground text-sm">Posts will appear here.</p>
        </TabsContent>
        <TabsContent value="doubts">
          <p className="text-center py-8 text-muted-foreground text-sm">Doubts will appear here.</p>
        </TabsContent>
        <TabsContent value="achievements">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
            {[
              { icon: "🔥", label: "Streak Master", desc: `${profile.currentStreak ?? 0} day streak`, earned: (profile.currentStreak ?? 0) >= 3 },
              { icon: "⚡", label: "XP Hunter", desc: `${profile.xp ?? 0} XP earned`, earned: (profile.xp ?? 0) >= 100 },
              { icon: "🏆", label: "Pro Member", desc: "Pro plan active", earned: profile.plan !== "free" },
            ].map((a) => (
              <div key={a.label} className={`p-4 rounded-xl border text-center ${a.earned ? "border-yellow-500/30 bg-yellow-500/5" : "border-border opacity-40"}`}>
                <p className="text-2xl mb-1">{a.icon}</p>
                <p className="text-xs font-semibold">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
