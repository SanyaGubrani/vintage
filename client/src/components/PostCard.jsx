import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Bookmark,
  EllipsisVertical,
  Edit,
  Trash2,
  X,
  Loader2,
  Check,
  BookmarkCheck,
} from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { usePostStore } from "../store/usePostStore";
import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../store/useBookmarkStore";
import { useLikeStore } from "../store/useLikeStore";
import { useCommentStore } from "../store/useCommentStore";

const PostCard = ({ post }) => {
  const { user, getUserProfile } = useUserStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { deletePost, isDeleting, editCaption, isEditing } = usePostStore();
  const { addToSavedPosts, savedPosts } = useBookmarkStore();
  const [isSaved, setIsSaved] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newCaption, setNewCaption] = useState(post.caption);
  const editFormRef = useRef(null);
  const navigate = useNavigate();
  const { likes, toggleLike, isProcessingLike } = useLikeStore();
  const commentCount = useCommentStore((state) =>
    state.getCommentCount(post._id)
  );

  const likeData = likes[post._id] || {
    isLiked: post.isLiked || false,
    likeCount: post.likeCount || 0,
  };

  const handleCommentClick = () => {
    navigate(`/comments/${post._id}`);
  };

  useEffect(() => {
    const isPostSaved = savedPosts?.some(
      (savedPost) => savedPost.post?._id === post._id
    );
    setIsSaved(isPostSaved);
  }, [post._id, savedPosts]);

  const handleSaveToggle = async () => {
    try {
      await addToSavedPosts(post._id);
    } catch (error) {
      console.error("Error toggling save status:", error);
    }
  };

  const handleUserProfileClick = () => {
    if (!post.user?._id) return;

    // If it's the current user, go to regular profile page
    if (post.user._id === user?.id) {
      navigate("/profile");
    } else {
      // Otherwise go to the separate user profile page
      navigate(`/user/${post.user._id}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEditOpen(false);
      }

      if (
        showEditForm &&
        editFormRef.current &&
        !editFormRef.current.contains(event.target)
      ) {
        setShowEditForm(false);
        setNewCaption(post.caption); // Reset caption to original if canceled
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEditForm, post.caption]);

  //handle delete post click
  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post._id);
        setIsEditOpen(false);
      } catch (error) {
        console.log("error while deleting the post: ", error);
      }
    }
  };

  // Handle edit post click
  const handleEditClick = () => {
    setShowEditForm(true);
    setIsEditOpen(false);
  };

  // Submit caption update
  const handleSaveCaption = async () => {
    try {
      if (newCaption.trim() === "") {
        toast.error("Caption cannot be empty");
        return;
      }

      await editCaption(post._id, newCaption);
      setShowEditForm(false);
    } catch (error) {
      console.log("Error while editing the post:", error);
    }
  };

  // Cancel caption editing
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setNewCaption(post.caption);
  };

  return (
    <div className="relative w-full max-w-2xl my-3 backdrop-brightness-[105%]  border-primary/50 rounded-lg border-3 shadow-md shadow-muted-foreground/40 transition-shadow">
      {/* User info */}
      <div className="flex items-center gap-3 p-4 border-b border-primary/60 justify-between relative">
        <div className="flex gap-2 md:gap-3 sm:flex-row flex-col justify-between w-full sm:items-center items-start">
          <div className="flex gap-2 md:gap-3 items-center">
            <div className="md:size-12 size-10 rounded-full overflow-hidden border-2 border-primary shrink-0">
              {post.user?.profile_picture ? (
                <img
                  src={post.user.profile_picture}
                  alt={post.user?.name || post.user?.username}
                  className="w-full h-full object-cover filter cursor-pointer"
                  onClick={handleUserProfileClick}
                />
              ) : (
                <div
                  className="w-full h-full bg-accent/20 drop-shadow-xl flex items-center justify-center text-primary font-newspaper cursor-pointer"
                  onClick={handleUserProfileClick}
                >
                  {post.user?.username?.charAt(0).toUpperCase() || "V"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p
                className="font-typewriter text-lg font-bold cursor-pointer"
                onClick={handleUserProfileClick}
              >
                {post.user?.name || post.user?.username || "Anonymous"}
              </p>
              <p className="text-muted-foreground">
                @{post.user?.username || "anonymous"}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-typewriter">
            {new Date(post.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </div>
        {/* Edit post option for current user */}
        {post.user?._id === user?.id && (
          <div className="relative" ref={dropdownRef}>
            <button
              className="cursor-pointer hover:text-primary size-8 rounded-full flex items-start md:items-center justify-center hover:bg-muted/30 transition-all"
              onClick={() => setIsEditOpen(!isEditOpen)}
              aria-label="Post options"
              disabled={isDeleting || showEditForm}
            >
              {isEditOpen ? (
                <X size={18} className="text-primary md:size-6 size-5" />
              ) : (
                <EllipsisVertical className="text-primary md:size-6 size-5" />
              )}
            </button>

            {isEditOpen && (
              <div className="absolute z-10 right-0 md:right-2 top-full w-32 rounded-md border-2 border-primary/60 bg-accent/20 backdrop-blur-sm shadow-vintage overflow-hidden">
                <div className="bg-gradient-to-b from-secondary to-muted py-1 px-1">
                  <button
                    className="flex w-full cursor-pointer items-center gap-2 text-lg py-1.5 px-2 font-typewriter hover:bg-primary/10 rounded transition-colors text-left"
                    onClick={handleEditClick}
                    disabled={isEditing}
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDeletePost}
                    disabled={isDeleting}
                    className="flex w-full cursor-pointer items-center gap-2 text-lg py-1.5 px-2 font-typewriter hover:bg-destructive/10 text-destructive font-medium rounded transition-colors text-left"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* caption/media */}
      <div className="p-4 border-b border-primary">
        {showEditForm ? (
          <div
            className="relative rounded-md border-2 border-primary/30 p-3 bg-muted/10 mb-4"
            ref={editFormRef}
          >
            <textarea
              className="w-full min-h-[80px] resize-none p-2 rounded-md border border-primary/40 bg-muted/20 placeholder:text-muted-foreground/70 font-typewriter text-sm focus:outline-none focus:border-primary/80 transition-colors"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              disabled={isEditing}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="py-1 px-3 rounded-md border border-primary/40 bg-muted/30 hover:bg-muted-foreground/20 transition-colors text-sm font-typewriter"
                onClick={handleCancelEdit}
                disabled={isEditing}
              >
                Cancel
              </button>
              <button
                className="py-1 px-3 rounded-md bg-primary/70 text-white hover:bg-primary/90 transition-colors text-sm font-typewriter flex items-center gap-1.5"
                onClick={handleSaveCaption}
                disabled={isEditing || newCaption.trim() === ""}
              >
                {isEditing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="font-typewriter sm:mb-4 whitespace-pre-wrap sm:text-[1.12rem] text-sm">
            {post.caption}
          </p>
        )}

        {post.media && (
          <div className="mt-3 film-frame">
            <img src={post.media} alt="Post" className="w-full h-auto " />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 p-1 bg-muted-foreground/15 rounded justify-center hover:bg-muted-foreground/35 hover:text-black/85 cursor-pointer transition-colors"
            onClick={() => toggleLike(post._id)}
            disabled={isProcessingLike}
          >
            <Heart
              size={21}
              className={`${
                likeData.isLiked
                  ? "fill-primary/90 text-accent-foreground/85"
                  : "fill-none"
              }
              `}
            />
            <span
              className={`text-sm font-medium translate-y-[1.5px] text-center font-typewriter-bold transition-all duration-100
            `}
            >
              {likeData.likeCount}
            </span>
          </button>
          <button
            className="flex items-center gap-1 p-1 bg-muted-foreground/15 rounded justify-center hover:bg-muted-foreground/35 hover:text-black/85 cursor-pointer transition-colors"
            onClick={handleCommentClick}
          >
            <MessageSquare size={21} />
            <span className="text-sm font-medium font-typewriter-bold">
              {commentCount || 0}
            </span>
          </button>
        </div>

        {/* Bookmark button */}
        <button
          className={`cursor-pointer p-1.5 rounded-full transition-all ${
            isSaved
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : "bg-muted-foreground/10 hover:bg-muted-foreground/30"
          }`}
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Unsave post" : "Save post"}
        >
          {isSaved ? (
            <BookmarkCheck size={19} className="fill-primary" />
          ) : (
            <Bookmark size={19} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
