import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DoubtCard from "@/components/shared/DoubtCard";
import { Skeleton } from "@/components/ui/skeleton";
import { doubtService } from "@/services/doubt.service";
import { ROUTES } from "@/constants";
import { TOPICS } from "@/constants/topics";
import { useDebounce } from "@/hooks/useDebounce";

export default function Doubts() {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["doubts", selectedTopic, status],
    queryFn: () => doubtService.getDoubts({
      topic: selectedTopic || undefined,
      status: status || undefined,
    }),
  });

  const doubts = data?.doubts ?? [];
  const filtered = debouncedSearch
    ? doubts.filter((d) => d.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : doubts;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Doubts Forum</h1>
          <p className="text-sm text-muted-foreground">Ask anything about Robotics, IoT & AI</p>
        </div>
        <Button asChild variant="gradient" size="sm">
          <Link to={ROUTES.DOUBTS_NEW}>
            <Plus className="h-4 w-4 mr-1.5" /> Ask Doubt
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doubts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Topics</option>
          {TOPICS.map((t) => (
            <option key={t.id} value={t.slug}>{t.name}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="answered">Answered</option>
        </select>
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doubts list */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No doubts found.</p>
          <Button asChild variant="gradient" size="sm">
            <Link to={ROUTES.DOUBTS_NEW}>Ask the first one</Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((doubt) => (
          <DoubtCard key={doubt._id} doubt={doubt} />
        ))}
      </div>
    </div>
  );
}
