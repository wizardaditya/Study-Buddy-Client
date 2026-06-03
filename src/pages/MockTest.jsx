import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { testService } from "@/services/test.service";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export default function MockTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { data: test, isLoading } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => testService.getTest(testId),
    enabled: !!testId,
  });

  useEffect(() => {
    if (test) setTimeLeft(test.duration * 60);
  }, [test]);

  useEffect(() => {
    if (!timeLeft) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (!testId) return;
    setSubmitting(true);
    try {
      const result = await testService.submitAttempt(testId, answers);
      navigate(ROUTES.TEST_RESULTS(result._id));
    } catch {
      setSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
  if (!test) return <div className="text-center py-20 text-muted-foreground">Test not found.</div>;

  const question = test.questions[current];
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = ((current + 1) / test.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="font-bold">{test.title}</p>
          <p className="text-xs text-muted-foreground">{current + 1} / {test.questions.length} questions</p>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 font-mono font-bold px-3 py-1.5 rounded-lg",
          timeLeft < 60 ? "bg-red-500/10 text-red-400" : "bg-muted text-foreground"
        )}>
          <Clock className="h-4 w-4" />
          {minutes}:{seconds}
        </div>
      </div>

      <Progress value={progress} />

      <div className="bg-card border border-border rounded-xl p-6">
        <p className="font-semibold text-base mb-6">Q{current + 1}. {question.question}</p>
        <div className="space-y-2.5">
          {question.options.map((option, i) => {
            const isSelected = answers[question._id] === option;
            return (
              <button
                key={i}
                onClick={() => setAnswers((prev) => ({ ...prev, [question._id]: option }))}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent"
                )}
              >
                <span className="font-mono mr-3 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrent((c) => c - 1)} disabled={current === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        {current < test.questions.length - 1 ? (
          <Button variant="gradient" onClick={() => setCurrent((c) => c + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button variant="gradient" onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="h-4 w-4 mr-1.5" /> Submit Test
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {test.questions.map((q, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-7 w-7 rounded-lg text-xs font-medium transition-colors",
              i === current ? "bg-primary text-white" :
              answers[q._id] ? "bg-green-500/20 text-green-400 border border-green-500/30" :
              "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
