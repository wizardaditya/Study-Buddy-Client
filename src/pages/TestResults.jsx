import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Trophy, CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { testService } from "@/services/test.service";
import { ROUTES } from "@/constants";

export default function TestResults() {
  const { id } = useParams();
  const { data: result, isLoading } = useQuery({
    queryKey: ["test-result", id],
    queryFn: () => testService.getResult(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!result) return null;

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const isPassed = percentage >= 60;

  return (
    <div className="max-w-lg mx-auto space-y-6 text-center">
      <div className="bg-card border border-border rounded-2xl p-8">
        <div className={`h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-4 ${isPassed ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {isPassed ? <Trophy className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
        </div>

        <h1 className="text-3xl font-black mb-1">{percentage}%</h1>
        <p className={`font-semibold mb-6 ${isPassed ? "text-green-400" : "text-red-400"}`}>
          {isPassed ? "Passed! Great work 🎉" : "Keep practicing. You'll get it!"}
        </p>

        <Progress value={percentage} className="mb-6 h-3" />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-muted rounded-xl p-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-1" />
            <p className="text-xl font-black">{result.correctAnswers}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <XCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
            <p className="text-xl font-black">{result.totalQuestions - result.correctAnswers}</p>
            <p className="text-xs text-muted-foreground">Wrong</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-black">{Math.round(result.timeTaken / 60)}m</p>
            <p className="text-xs text-muted-foreground">Time</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link to={ROUTES.MOCK_TESTS}><RotateCcw className="h-4 w-4 mr-1.5" /> Try Another</Link>
          </Button>
          <Button asChild variant="gradient" className="flex-1">
            <Link to={ROUTES.AURA}>Ask Aura for Help</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
