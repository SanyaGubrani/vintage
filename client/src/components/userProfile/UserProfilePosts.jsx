import React, { useEffect, useRef, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import PostCard from "../PostCard";
import { Loader2 } from "lucide-react";

const OtherUserPosts = ({ userId }) => {
  const { userPosts, getUsersPosts, fetchingUserPost } = usePostStore();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const loadingRef = useRef(false);

  const loadPosts = async () => {
    if (loadingRef.current || !hasMore || !userId) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const result = await getUsersPosts(userId, cursor);
      setHasMore(result.hasMore);
      setCursor(result.nextCursor);
    } catch (error) {
      console.error("Error loading user posts:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Initial load
  useEffect(() => {
    if (userId) {
      setCursor(null); // Reset cursor when userId changes
      setHasMore(true);
      loadPosts();
    }
  }, [userId]);

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

    const target = document.getElementById('user-posts-scroll-trigger');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading, cursor, userId]);

  if (fetchingUserPost && !cursor) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-accent/40 font-semibold text-lg md:text-xl font-typewriter rounded-xl text-primary inline-block px-2">
          USER ARCHIVES
        </div>
        <div className="flex-1 border-b border-primary ml-2"></div>
      </div>

      <div className="space-y-4 flex flex-col">
        {userPosts?.length > 0 ? (
          <>
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            
            {/* Scroll trigger */}
            <div 
              id="user-posts-scroll-trigger" 
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
              User Has No Personal Archives
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherUserPosts;