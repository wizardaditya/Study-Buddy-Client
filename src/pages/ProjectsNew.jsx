import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";
import { TOPICS } from "@/constants/topics";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

export default function ProjectsNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    topic: "",
    tags: "",
    githubUrl: "",
    demoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.description || !form.topic) {
      setError("Title, description and topic are required");
      return;
    }
    setLoading(true);
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const { data } = await api.post("/projects", { ...form, tags });
      // Invalidate projects cache so list refreshes
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(ROUTES.PROJECT_DETAIL(data.data._id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to publish project. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-black">New Project</h1>
          <p className="text-sm text-muted-foreground">Share your Robotics, IoT or AI project with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Project Title *</label>
          <Input
            name="title"
            placeholder="e.g. Smart Robot with ROS2 Navigation"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={150}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Topic *</label>
          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            required
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a topic</option>
            <optgroup label="🤖 Robotics">
              {TOPICS.filter((t) => t.category === "robotics").map((t) => (
                <option key={t.id} value={t.slug}>{t.name}</option>
              ))}
            </optgroup>
            <optgroup label="📡 IoT">
              {TOPICS.filter((t) => t.category === "iot").map((t) => (
                <option key={t.id} value={t.slug}>{t.name}</option>
              ))}
            </optgroup>
            <optgroup label="🧠 AI">
              {TOPICS.filter((t) => t.category === "ai").map((t) => (
                <option key={t.id} value={t.slug}>{t.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description *</label>
          <textarea
            name="description"
            placeholder="Describe what you built, how it works, the tech stack, and what you learned..."
            value={form.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">GitHub URL</label>
          <Input
            name="githubUrl"
            placeholder="https://github.com/username/project"
            value={form.githubUrl}
            onChange={handleChange}
            type="url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Demo / Video URL</label>
          <Input
            name="demoUrl"
            placeholder="https://youtube.com/watch?v=..."
            value={form.demoUrl}
            onChange={handleChange}
            type="url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Tags</label>
          <Input
            name="tags"
            placeholder="ROS2, Python, Servo (comma separated)"
            value={form.tags}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
        </div>

        <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Publish Project (+20 XP)
        </Button>
      </form>
    </div>
  );
}
