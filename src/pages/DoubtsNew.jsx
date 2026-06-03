import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doubtService } from "@/services/doubt.service";
import { ROUTES } from "@/constants";
import { TOPICS } from "@/constants/topics";

export default function DoubtsNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", topic: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.topic) { setError("Please select a topic"); return; }
    setLoading(true);
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const doubt = await doubtService.createDoubt({ ...form, tags });
      navigate(ROUTES.DOUBTS_DETAIL(doubt._id));
    } catch {
      setError("Failed to post doubt. Try again.");
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
          <h1 className="text-2xl font-black">Ask a Doubt</h1>
          <p className="text-sm text-muted-foreground">Be specific — good questions get great answers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1.5">Title *</label>
          <Input name="title" placeholder="e.g. How to configure PWM on ESP32 for servo control?" value={form.title} onChange={handleChange} required maxLength={200} />
          <p className="text-xs text-muted-foreground mt-1">{form.title.length}/200</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Explain your doubt *</label>
          <textarea name="content" placeholder="Describe what you tried, what you expected, and what happened..." value={form.content} onChange={handleChange} required rows={8} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Topic *</label>
          <select name="topic" value={form.topic} onChange={handleChange} required className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Select a topic</option>
            <optgroup label="🤖 Robotics">
              {TOPICS.filter((t) => t.category === "robotics").map((t) => <option key={t.id} value={t.slug}>{t.name}</option>)}
            </optgroup>
            <optgroup label="📡 IoT">
              {TOPICS.filter((t) => t.category === "iot").map((t) => <option key={t.id} value={t.slug}>{t.name}</option>)}
            </optgroup>
            <optgroup label="🧠 AI">
              {TOPICS.filter((t) => t.category === "ai").map((t) => <option key={t.id} value={t.slug}>{t.name}</option>)}
            </optgroup>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Tags</label>
          <Input name="tags" placeholder="arduino, servo, pwm (comma separated)" value={form.tags} onChange={handleChange} />
        </div>
        <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post Doubt (+15 XP)
        </Button>
      </form>
    </div>
  );
}
