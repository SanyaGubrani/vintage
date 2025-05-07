import React, { useEffect } from "react";
import { useFollowStore } from "../store/useFollowStore";
import { Loader2 } from "lucide-react";
import { RiUserFollowLine } from "react-icons/ri";
import { RiUserAddLine } from "react-icons/ri";

const FollowButton = ({ userId, username, onFollowChange, className = "" }) => {
  const { followUser, isProcessingFollow, followingUsers, checkFollowStatus } =
    useFollowStore();
  const isFollowing = followingUsers.includes(userId);

  useEffect(() => {
    checkFollowStatus(userId);
  }, [userId]);

  const handleFollowClick = async () => {
    const result = await followUser(userId);
    onFollowChange?.(result);
  };

  return (
    <button
      onClick={handleFollowClick}
      disabled={isProcessingFollow}
      className={`px-3 py-1.5 rounded-md font-typewriter cursor-pointer text-sm transition-all ${
        isFollowing
          ? "bg-primary text-white hover:bg-primary/80"
          : "bg-accent/60 border border-accent/70 hover:bg-accent/40"
      } ${className}`}
    >
      {isProcessingFollow ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        <div className="flex gap-1.5 items-center">
          {isFollowing ? (
            <RiUserFollowLine className="size-4" />
          ) : (
            <RiUserAddLine className="size-4" />
          )}
          <span>{isFollowing ? "Following" : "Follow"}</span>
        </div>
      )}
    </button>
  );
};

export default FollowButton;
