import { Link } from "react-router-dom";
import { MessageCircle, Eye, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, timeAgo, getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { Doubt } from "@/types";

interface DoubtCardProps {
  doubt: Doubt;
}

export default function DoubtCard({ doubt }: DoubtCardProps) {
  return (
    <Link to={ROUTES.DOUBTS_DETAIL(doubt._id)}>
      <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Status indicator */}
          <div className="mt-1 shrink-0">
            {doubt.isAnswered ? (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {doubt.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {doubt.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant="blue" className="text-[11px]">{doubt.topic}</Badge>
              {doubt.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[11px]">#{tag}</Badge>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={doubt.author.avatar} />
                  <AvatarFallback className="text-[9px]">{getInitials(doubt.author.name)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {doubt.author.username} · {timeAgo(doubt.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {doubt.answersCount}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {doubt.views}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
