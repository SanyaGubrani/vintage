import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePostStore } from "../store/usePostStore";
import PostCard from "./PostCard";
import { useUserStore } from "../store/useUserStore";

const UserPosts = () => {
  const { myPosts, getMyPosts } = usePostStore();

  useEffect(() => {
    getMyPosts();
  }, [getMyPosts]);

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className=" bg-accent/10 text-primary inline-block px-2">
          PERSONAL ARCHIVES
        </div>
        <div className="flex-1 border-b border-primary ml-2"></div>
      </div>

      <div className="space-y-4">
        {myPosts.length > 0 ? (
          myPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="bg-accent/10 p-6 text-center italic text-muted-foreground">
            No memories found in archive.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPosts;
