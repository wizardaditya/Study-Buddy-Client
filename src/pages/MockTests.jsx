import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ClipboardList, Clock, BarChart2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { testService } from "@/services/test.service";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const difficultyColor = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
} as const;

export default function MockTests() {
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: () => testService.getTests(),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black">Mock Tests</h1>
        <p className="text-sm text-muted-foreground">Topic-wise tests with detailed analytics</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => (
          <div key={test._id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-white" />
              </div>
              <Badge variant={difficultyColor[test.difficulty]}>{test.difficulty}</Badge>
            </div>
            <h3 className="font-bold mb-1">{test.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{test.topic}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><ClipboardList className="h-3.5 w-3.5" />{test.questionsCount} questions</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{test.duration} min</span>
              <span className="flex items-center gap-1"><BarChart2 className="h-3.5 w-3.5" />Avg: {test.avgScore}%</span>
            </div>
            <Button asChild variant="gradient" size="sm" className="w-full">
              <Link to={ROUTES.MOCK_TEST(test._id)}>
                <Zap className="h-3.5 w-3.5 mr-1.5" /> Start Test
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
