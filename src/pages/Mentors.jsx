import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MentorCard from "@/components/shared/MentorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { mentorService } from "@/services/mentor.service";
import { TOPICS } from "@/constants/topics";
import { useDebounce } from "@/hooks/useDebounce";

export default function Mentors() {
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["mentors", expertise],
    queryFn: () => mentorService.getMentors({ expertise: expertise || undefined }),
  });

  const filtered = debouncedSearch
    ? mentors.filter((m) =>
        m.user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.expertise.some((e) => e.toLowerCase().includes(debouncedSearch.toLowerCase()))
      )
    : mentors;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black">Find a Mentor</h1>
        <p className="text-sm text-muted-foreground">Book 1-on-1 sessions with verified industry experts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search mentors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Expertise</option>
          {TOPICS.map((t) => <option key={t.id} value={t.slug}>{t.name}</option>)}
        </select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <div className="flex gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No mentors found for this filter.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mentor) => (
          <MentorCard key={mentor._id} mentor={mentor} />
        ))}
      </div>
    </div>
  );
}
