import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Github, ExternalLink, Star, Eye, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants";
import api from "@/lib/axios";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const starMutation = useMutation({
    mutationFn: () => api.post(`/projects/${id}/star`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project", id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(ROUTES.PROJECTS);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Project not found.</p>
        <Button asChild variant="gradient" size="sm" className="mt-4">
          <Link to={ROUTES.PROJECTS}>Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const isOwner = user?._id === project.author?._id;
  const isStarred = project.starredBy?.includes(user?._id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </button>

      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-black mb-2">{project.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.topic && <Badge variant="blue">{project.topic}</Badge>}
              {(project.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => starMutation.mutate()}
              disabled={starMutation.isPending}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                isStarred
                  ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                  : "border-border hover:border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-400 text-muted-foreground"
              }`}
            >
              <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
              <span>{project.stars || 0}</span>
            </button>

            {isOwner && (
              <button
                onClick={() => {
                  if (window.confirm("Delete this project?")) deleteMutation.mutate();
                }}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
              >
                {deleteMutation.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Trash2 className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Author + meta */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-3 border-y border-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.author?.avatar} />
              <AvatarFallback className="text-xs">{getInitials(project.author?.name || "")}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                to={ROUTES.PROFILE(project.author?.username)}
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                {project.author?.name}
              </Link>
              <p className="text-xs text-muted-foreground">{timeAgo(project.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {project.views || 0} views
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" /> {project.stars || 0} stars
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-sm leading-relaxed whitespace-pre-line">{project.description}</p>
        </div>

        {/* Links */}
        {(project.githubUrl || project.demoUrl) && (
          <div className="flex gap-3 mt-5 pt-4 border-t border-border">
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-1.5" /> View Code
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button asChild variant="gradient" size="sm">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1.5" /> Live Demo
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
