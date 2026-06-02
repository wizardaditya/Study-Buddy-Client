import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";

export default function ProjectsNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-black">New Project</h1>
          <p className="text-sm text-muted-foreground">Share your Robotics, IoT or AI project</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div><label className="block text-sm font-medium mb-1.5">Project Title *</label><Input placeholder="Smart Robot with ROS2" /></div>
        <div><label className="block text-sm font-medium mb-1.5">Description *</label>
          <textarea rows={5} placeholder="Describe what you built, how it works, and what you learned..." className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        </div>
        <div><label className="block text-sm font-medium mb-1.5">GitHub URL</label><Input placeholder="https://github.com/..." /></div>
        <div><label className="block text-sm font-medium mb-1.5">Demo / Video URL</label><Input placeholder="https://youtube.com/..." /></div>
        <div><label className="block text-sm font-medium mb-1.5">Tags</label><Input placeholder="ROS2, Python, Servo (comma separated)" /></div>
        <Button variant="gradient" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Publish Project
        </Button>
      </div>
    </div>
  );
}
