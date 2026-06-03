import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Github, Linkedin, MapPin, GraduationCap, Zap, Flame, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/lib/utils";

export default function Profile() {
  const { username } = useParams();
  const { user: me } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => userService.getProfile(username),
    enabled: !!username,
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

  const isOwnProfile = me?._id === profile._id;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar className="h-20 w-20 ring-2 ring-border">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-black">{profile.name}</h1>
              {profile.plan !== "free" && (
                <Badge variant="purple" className="text-xs">
                  <Trophy className="h-3 w-3 mr-1" />{profile.plan.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
            {profile.bio && <p className="text-sm mb-3">{profile.bio}</p>}

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              {profile.college && <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{profile.college}</span>}
              {profile.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.city}, {profile.state}</span>}
              {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground"><Github className="h-3.5 w-3.5" />GitHub</a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground"><Linkedin className="h-3.5 w-3.5" />LinkedIn</a>}
            </div>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              </div>
            )}
          </div>

          {!isOwnProfile && (
            <Button
              variant={profile.isFollowing ? "outline" : "gradient"}
              size="sm"
              onClick={() => profile.isFollowing ? userService.unfollow(profile._id) : userService.follow(profile._id)}
            >
              {profile.isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-border text-center">
          {[
            { label: "Followers", value: profile.followersCount },
            { label: "Following", value: profile.followingCount },
            { label: "XP", value: profile.xp, icon: Zap },
            { label: "Streak", value: profile.currentStreak, icon: Flame },
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
          <p className="text-center py-8 text-muted-foreground text-sm">Achievements will appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
