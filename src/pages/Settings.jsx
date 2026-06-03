import { useState, useEffect } from "react";
import { Loader2, Camera, Bell, BellOff, Shield, LogOut, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

export default function Settings() {
  const { user, updateUser, logout } = useAuthStore();

  // Profile form
  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    college: user?.college || "",
    city: user?.city || "",
    state: user?.state || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    skills: (user?.skills || []).join(", "),
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    likes: true,
    comments: true,
    follows: true,
    answers: true,
    system: true,
  });

  const handleProfileChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileSuccess(false);
    try {
      const skills = profile.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const updated = await userService.updateMe({ ...profile, skills });
      updateUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess(false);
    if (passwords.newPass !== passwords.confirm) {
      setPwdError("New passwords do not match");
      return;
    }
    if (passwords.newPass.length < 8) {
      setPwdError("Password must be at least 8 characters");
      return;
    }
    setPwdLoading(true);
    try {
      await api.put("/users/me/password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      setPwdSuccess(true);
      setPasswords({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err) {
      setPwdError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
          <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-border">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xl">{getInitials(user?.name || "")}</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors">
                  <Camera className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground mb-1">@{user?.username}</p>
                <Badge variant={user?.plan === "elite" ? "purple" : user?.plan === "pro" ? "blue" : "secondary"} className="text-xs capitalize">
                  {user?.plan} Plan
                </Badge>
              </div>
            </div>

            {profileSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg p-3">
                ✅ Profile updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <Input name="name" value={profile.name} onChange={handleProfileChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">College / University</label>
                <Input name="college" value={profile.college} onChange={handleProfileChange} placeholder="IIT Delhi" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <Input name="city" value={profile.city} onChange={handleProfileChange} placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">State</label>
                <Input name="state" value={profile.state} onChange={handleProfileChange} placeholder="Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">GitHub URL</label>
                <Input name="github" value={profile.github} onChange={handleProfileChange} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">LinkedIn URL</label>
                <Input name="linkedin" value={profile.linkedin} onChange={handleProfileChange} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows={3}
                placeholder="Tell the community about yourself..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Skills</label>
              <Input
                name="skills"
                value={profile.skills}
                onChange={handleProfileChange}
                placeholder="Arduino, Python, TensorFlow (comma separated)"
              />
              <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
            </div>

            <Button variant="gradient" onClick={handleSaveProfile} disabled={profileLoading}>
              {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* ── Account Tab ── */}
        <TabsContent value="account">
          <div className="space-y-4">
            {/* Change password */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" /> Change Password
              </h3>
              <p className="text-xs text-muted-foreground mb-5">
                Use a strong password with letters, numbers & symbols
              </p>

              {pwdError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4">
                  {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg p-3 mb-4">
                  ✅ Password changed successfully!
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPwd ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                      placeholder="Your current password"
                      required
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">New Password</label>
                  <Input
                    type={showPwd ? "text" : "password"}
                    value={passwords.newPass}
                    onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                  <Input
                    type={showPwd ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
                <Button type="submit" variant="outline" disabled={pwdLoading}>
                  {pwdLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </div>

            {/* Plan */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-1">Subscription Plan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You're on the <span className="font-semibold capitalize text-foreground">{user?.plan}</span> plan.
              </p>
              {user?.plan !== "elite" && (
                <Button asChild variant="gradient" size="sm">
                  <Link to={ROUTES.PRICING}>Upgrade Plan</Link>
                </Button>
              )}
            </div>

            {/* Danger zone */}
            <div className="bg-card border border-destructive/20 rounded-2xl p-6">
              <h3 className="font-bold text-destructive mb-1">Danger Zone</h3>
              <p className="text-xs text-muted-foreground mb-4">
                These actions are permanent and cannot be undone.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" /> Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="font-bold mb-1">Notification Preferences</h3>
              <p className="text-xs text-muted-foreground">Choose what notifications you receive</p>
            </div>

            <div className="space-y-4">
              {[
                { key: "likes", label: "Likes on your posts", desc: "When someone likes your post or project" },
                { key: "comments", label: "Comments", desc: "When someone comments on your content" },
                { key: "follows", label: "New followers", desc: "When someone starts following you" },
                { key: "answers", label: "Answers to your doubts", desc: "When your doubt gets an answer or is accepted" },
                { key: "system", label: "System notifications", desc: "Platform updates, streak reminders, XP milestones" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${notifPrefs[key] ? "bg-primary/10" : "bg-muted"}`}>
                      {notifPrefs[key]
                        ? <Bell className="h-4 w-4 text-primary" />
                        : <BellOff className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${notifPrefs[key] ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${notifPrefs[key] ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>

            <Button variant="gradient" size="sm">Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
