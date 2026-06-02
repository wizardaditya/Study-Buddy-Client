import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback, hasMore, loading) {
  const observerRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) callback(); },
      { threshold: 0.1 }
    );

    if (targetRef.current) observerRef.current.observe(targetRef.current);
    return () => observerRef.current?.disconnect();
  }, [callback, hasMore, loading]);

  return { targetRef };
}
