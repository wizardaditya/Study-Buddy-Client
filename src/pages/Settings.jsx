import { useState } from "react";
import { Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import { getInitials } from "@/lib/utils";

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    college: "",
    city: "",
    state: "",
    github: "",
    linkedin: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const updated = await userService.updateMe({ ...form, skills });
      updateUser(updated);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and account</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xl">{getInitials(user?.name ?? "")}</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="h-3 w-3 text-white" />
                </button>
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">@{user?.username}</p>
              </div>
            </div>

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg p-3">
                Profile updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">College / University</label>
                <Input name="college" value={form.college} onChange={handleChange} placeholder="IIT Delhi" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <Input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">State</label>
                <Input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">GitHub URL</label>
                <Input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">LinkedIn URL</label>
                <Input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell the community about yourself..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Skills</label>
              <Input name="skills" value={form.skills} onChange={handleChange} placeholder="Arduino, Python, TensorFlow (comma separated)" />
            </div>

            <Button variant="gradient" onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm text-muted-foreground">Account settings coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
