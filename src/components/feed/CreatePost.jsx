import { useState, useRef } from "react";
import { Image, Loader2, X, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { postService } from "@/services/post.service";
import { getInitials } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const TOPIC_SUGGESTIONS = ["Arduino", "RaspberryPi", "ML", "IoT", "OpenCV", "ROS", "ESP32"];

export default function CreatePost({ onCreated }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  const toggleTag = (tag) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const post = await postService.createPost({ content, type: "text", tags });
      // Refresh the whole feed to get fully populated post
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      if (onCreated) onCreated(post);
      setContent("");
      setTags([]);
      setExpanded(false);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setExpanded(false);
    setContent("");
    setTags([]);
    setError("");
  };

  return (
    <div ref={containerRef} className="bg-card border border-border rounded-xl p-4">
      {error && (
        <div className="flex items-center gap-2 text-destructive text-xs mb-3 bg-destructive/10 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Share a project, insight, or question with the community..."
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground resize-none focus:outline-none min-h-[48px]"
            rows={expanded ? 4 : 2}
          />

          {expanded && (
            <>
              <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                {TOPIC_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()} // prevent textarea blur
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      tags.includes(tag)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-accent"
                >
                  <Image className="h-4 w-4" /> Add Image
                </button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    size="sm"
                    disabled={!content.trim() || loading}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleSubmit}
                  >
                    {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    Post
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
