import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useBookmarkStore } from "../store/useBookmarkStore";
import PostCard from "../components/PostCard";
import { Loader2 } from "lucide-react";

const Bookmarks = () => {
  const { fetchingBookmarkPosts, savedPosts, getSavedPosts } = useBookmarkStore();

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      if (mounted) {
        await getSavedPosts();
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, [getSavedPosts]);

  // Filter out null posts
  const validSavedPosts = savedPosts?.filter(savedPost => savedPost.post !== null) || [];

  return (
    <Layout>
      <div className="max-w-4xl w-full mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <div className="bg-accent/40 font-typewriter rounded-xl text-primary inline-block px-2">
            BOOKMARKED POSTS
          </div>
          <div className="flex-1 border-b border-primary ml-2"></div>
        </div>

        {fetchingBookmarkPosts ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin size-8" />
          </div>
        ) : (
          <div className="space-y-6">
            {validSavedPosts.length > 0 ? (
              validSavedPosts.map((savedPost) => (
                <PostCard 
                  key={savedPost._id} 
                  post={savedPost.post}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="font-typewriter text-xl text-muted-foreground">
                  No bookmarked posts yet (⊙ _ ⊙ )
                    <br/>
                    <br/>
                    Go on, tap that bookmark! (˶ᵔ ᵕ ᵔ˶)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookmarks;