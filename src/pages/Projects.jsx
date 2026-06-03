import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, FolderKanban, ExternalLink, Github, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/axios";

export default function Projects() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", debouncedSearch],
    queryFn: async () => {
      const params = debouncedSearch ? `?search=${debouncedSearch}` : "";
      const { data } = await api.get(`/projects${params}`);
      return data.data;
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Projects</h1>
          <p className="text-sm text-muted-foreground">Showcase your Robotics, IoT & AI builds</p>
        </div>
        <Button asChild variant="gradient" size="sm">
          <Link to={ROUTES.PROJECTS_NEW}>
            <Plus className="h-4 w-4 mr-1.5" /> New Project
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <div className="text-center py-20">
          <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {search ? "No projects match your search." : "No projects yet. Be the first to share!"}
          </p>
          <Button asChild variant="gradient" size="sm">
            <Link to={ROUTES.PROJECTS_NEW}>Share your first project</Link>
          </Button>
        </div>
      )}

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                <FolderKanban className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{p.title}</h3>
                <p className="text-xs text-muted-foreground">by @{p.author?.username}</p>
              </div>
            </div>

            {p.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.topic && <Badge variant="blue" className="text-xs">{p.topic}</Badge>}
              {(p.tags || []).slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">⭐ {p.stars || 0} stars</span>
              <div className="flex gap-2">
                {p.githubUrl && (
                  <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3.5 w-3.5 mr-1" /> Code
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                  <Link to={ROUTES.PROJECT_DETAIL(p._id)}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
