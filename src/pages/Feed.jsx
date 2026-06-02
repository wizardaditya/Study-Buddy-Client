import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import PostCard from "@/components/shared/PostCard";
import CreatePost from "@/components/feed/CreatePost";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { postService } from "@/services/post.service";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Post } from "@/types";

export default function Feed() {
  const queryClient = useQueryClient();
  const [posts, setPosts] = useState<Post[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam = 1 }) => postService.getFeed(pageParam as number),
      getNextPageParam: (last, all) => (last.hasMore ? all.length + 1 : undefined),
      initialPageParam: 1,
    });

  const allPosts = data?.pages.flatMap((p) => p.posts) ?? [];

  const { targetRef } = useInfiniteScroll(
    () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); },
    !!hasNextPage,
    isFetchingNextPage
  );

  const handlePostCreated = (post: Post) => {
    queryClient.setQueryData(["feed"], (old: typeof data) => {
      if (!old) return old;
      return {
        ...old,
        pages: [
          { posts: [post, ...(old.pages[0]?.posts ?? [])], hasMore: old.pages[0]?.hasMore },
          ...old.pages.slice(1),
        ],
      };
    });
  };

  const handleDelete = async (id: string) => {
    await postService.deletePost(id);
    queryClient.invalidateQueries({ queryKey: ["feed"] });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Create post */}
      <CreatePost onCreated={handlePostCreated} />

      {/* Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm text-muted-foreground">Latest from the community</h2>
        <button
          onClick={() => refetch()}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {!isLoading && allPosts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </div>
      )}

      <div className="space-y-4">
        {allPosts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDelete} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={targetRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
