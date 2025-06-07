import React, { useEffect, useRef, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useUserStore } from "../../store/useUserStore";
import PostCard from "../PostCard";
import { Loader2 } from "lucide-react";

const OurProfilePosts = () => {
  const { myPosts, getMyPosts } = usePostStore();
  const { getUserProfile } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const loadingRef = useRef(false);

  const loadPosts = async () => {
    if (loadingRef.current || !hasMore) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const result = await getMyPosts(cursor);
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
    getUserProfile();
  }, [getUserProfile]);

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

    const target = document.getElementById("my-posts-scroll-trigger");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading, cursor]);

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-accent/20 font-semibold tracking-wide text-lg md:text-xl font-typewriter rounded-xl text-primary inline-block px-2">
          PERSONAL ARCHIVES
        </div>
        <div className="flex-1 border-b border-primary ml-2"></div>
      </div>

      <div className="space-y-4 flex flex-col">
        {myPosts.length > 0 ? (
          <>
            {myPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* Scroll trigger */}
            <div
              id="my-posts-scroll-trigger"
              className="h-10 flex items-center justify-center"
            >
              {loading && <Loader2 className="animate-spin size-8" />}
            </div>

            {!hasMore && (
              <div className="text-center py-4 text-muted-foreground font-typewriter">
                End of Archives
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center mb-4">
            <div className="bg-accent/40 font-typewriter-bold rounded-xl text-primary inline-block px-2">
              No Personal Archives Yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurProfilePosts;
