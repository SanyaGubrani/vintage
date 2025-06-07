import React, { useEffect, useRef, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";
import { useLikeStore } from "../store/useLikeStore";

const Feed = () => {
  const { allPosts, getAllPosts } = usePostStore();
  const { setLikesFromPosts } = useLikeStore();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const loadingRef = useRef(false);

  const loadPosts = async () => {
    if (loadingRef.current || !hasMore) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const result = await getAllPosts(cursor);
      setLikesFromPosts(allPosts);

      setHasMore(result.hasMore);
      setCursor(result.nextCursor);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPosts();
        }
      },
      { threshold: 0.5 }
    );

    const target = document.getElementById("scroll-trigger");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading, cursor]);

  return (
    <div className="">
      <div className="flex items-center mb-5">
        <div className="bg-accent/15 font-typewriter text-xl md:text-2xl text-primary font-semibold tracking-wide inline-block px-2">
          VINTAGE FEED
        </div>
        <div className="flex-1 border-b-1 border-primary ml-2"></div>
      </div>

      <div className="space-y-6 flex flex-col">
        {allPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

        {/* Scroll trigger element */}
        <div
          id="scroll-trigger"
          className="h-10 flex items-center justify-center"
        >
          {loading && <Loader2 className="animate-spin size-10 text-primary" />}
        </div>

        {!hasMore && allPosts.length > 0 && (
          <div className="bg-accent/10 p-6 text-center font-typewriter italic text-muted-foreground">
            You've reached the end of Feed
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
