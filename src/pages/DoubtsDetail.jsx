import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, ThumbsUp, Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { doubtService } from "@/services/doubt.service";
import { useAuthStore } from "@/store/auth.store";
import { timeAgo, getInitials } from "@/lib/utils";

export default function DoubtsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["doubt", id],
    queryFn: () => doubtService.getDoubt(id!),
    enabled: !!id,
  });

  const handleAnswer = async () => {
    if (!answerContent.trim() || !id) return;
    setSubmitting(true);
    try {
      await doubtService.addAnswer(id, answerContent);
      setAnswerContent("");
      queryClient.invalidateQueries({ queryKey: ["doubt", id] });
    } catch {
      console.error("Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (answerId: string) => {
    if (!id) return;
    await doubtService.acceptAnswer(id, answerId);
    queryClient.invalidateQueries({ queryKey: ["doubt", id] });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!data) return <div className="text-center py-20 text-muted-foreground">Doubt not found.</div>;

  const isAuthor = user?._id === data.author._id;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Doubts
      </button>

      {/* Doubt */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start gap-2 mb-3">
          <Badge variant={data.isAnswered ? "success" : "warning"} className="text-xs">
            {data.isAnswered ? "Answered" : "Open"}
          </Badge>
          <Badge variant="blue" className="text-xs">{data.topic}</Badge>
        </div>
        <h1 className="text-xl font-bold mb-3">{data.title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
          {data.content}
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Avatar className="h-7 w-7">
            <AvatarImage src={data.author.avatar} />
            <AvatarFallback className="text-[10px]">{getInitials(data.author.name)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {data.author.username} · {timeAgo(data.createdAt)}
          </span>
        </div>
      </div>

      {/* Answers */}
      <div>
        <h2 className="font-bold mb-3">{data.answers?.length ?? 0} Answers</h2>
        <div className="space-y-4">
          {(data.answers ?? []).map((answer) => (
            <div
              key={answer._id}
              className={`bg-card border rounded-xl p-5 ${answer.isAccepted ? "border-green-500/40 bg-green-500/5" : "border-border"}`}
            >
              {answer.isAccepted && (
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-3">
                  <CheckCircle2 className="h-4 w-4" /> Accepted Answer
                </div>
              )}
              <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">{answer.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[9px]">{getInitials(answer.author.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {answer.author.username} · {timeAgo(answer.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => doubtService.upvoteAnswer(id!, answer._id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-accent"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> {answer.upvotes}
                  </button>
                  {isAuthor && !data.isAnswered && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 text-green-400 border-green-500/30 hover:bg-green-500/10"
                      onClick={() => handleAccept(answer._id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write answer */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-3 text-sm">Your Answer</h3>
        <textarea
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          placeholder="Write a detailed answer. Include code snippets, references, or diagrams if needed."
          rows={6}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none mb-3"
        />
        <Button
          variant="gradient"
          size="sm"
          disabled={!answerContent.trim() || submitting}
          onClick={handleAnswer}
        >
          {submitting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-2 h-3.5 w-3.5" />}
          Post Answer (+20 XP)
        </Button>
      </div>
    </div>
  );
}
