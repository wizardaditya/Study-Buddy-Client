import { Link } from "react-router-dom";
import { Plus, FolderKanban, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";

const DEMO_PROJECTS = [
  { _id: "1", title: "Line Follower Robot with PID Control", topic: "Robotics", tags: ["Arduino", "PID", "Servo"], author: "arjun_s", stars: 42 },
  { _id: "2", title: "Smart Home Automation with ESP32 + MQTT", topic: "IoT", tags: ["ESP32", "MQTT", "NodeRED"], author: "priya_n", stars: 38 },
  { _id: "3", title: "Real-time Object Detection with YOLOv8", topic: "AI", tags: ["Python", "YOLOv8", "OpenCV"], author: "rahul_v", stars: 67 },
];

export default function Projects() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Projects</h1>
          <p className="text-sm text-muted-foreground">Showcase your Robotics, IoT & AI builds</p>
        </div>
        <Button asChild variant="gradient" size="sm">
          <Link to={ROUTES.PROJECTS_NEW}><Plus className="h-4 w-4 mr-1.5" /> New Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_PROJECTS.map((p) => (
          <div key={p._id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                <FolderKanban className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{p.title}</h3>
                <p className="text-xs text-muted-foreground">by @{p.author}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge variant="blue" className="text-xs">{p.topic}</Badge>
              {p.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">⭐ {p.stars} stars</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs"><Github className="h-3.5 w-3.5 mr-1" /> Code</Button>
                <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                  <Link to={ROUTES.PROJECT_DETAIL(p._id)}><ExternalLink className="h-3.5 w-3.5 mr-1" /> View</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
