import { useState } from "react";
import { Heart, MessageCircle, Share2, Trash2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, timeAgo, getInitials } from "@/lib/utils";
import { postService } from "@/services/post.service";
import { useAuthStore } from "@/store/auth.store";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuthStore();
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      if (wasLiked) await postService.unlikePost(post._id);
      else await postService.likePost(post._id);
    } catch {
      setLiked(wasLiked);
      setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  };

  const isOwner = user?._id === post.author._id;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors">
      {/* Author */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              @{post.author.username} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed mb-3 whitespace-pre-line">{post.content}</p>

      {/* Media */}
      {post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt="Post media"
          className="w-full rounded-lg mb-3 max-h-80 object-cover border border-border"
        />
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-border">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
            liked
              ? "text-red-400 bg-red-500/10"
              : "text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          {likesCount > 0 && <span>{likesCount}</span>}
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <MessageCircle className="h-4 w-4" />
          {post.commentsCount > 0 && <span>{post.commentsCount}</span>}
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ml-auto">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
