import { useEffect } from "react";
import { useCommentStore } from "../store/useCommentStore";
import { Loader2, Trash2 } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router-dom";

const getRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  if (seconds < 10) return "just now";

  return Math.floor(seconds) + " seconds ago";
};

const CommentList = ({ postId }) => {
  const {
    comments,
    getComments,
    deleteComment,
    isFetchingComments,
    isDeletingComment,
  } = useCommentStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    getComments(postId);
  }, [postId]);

  if (isFetchingComments) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleUserProfileClick = (userId) => {
    if (!userId) return;

    // If it's the current user, go to regular profile page
    if (userId === user?.id) {
      navigate("/profile");
    } else {
      // Otherwise go to the separate user profile page
      navigate(`/user/${userId}`);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground text-center px-2 md:px-6 font-typewriter text-lg">
          No comments yet. Be the first to comment !
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 md:px-4 py-1 space-y-0">
      {comments.map((comment, index) => (
        <div key={comment._id}>
          <div className="flex gap-3 py-4">
            <div
              className="size-12 md:size-14 cursor-pointer  hover:border-[3px] hover:border-primary transition-all duration-50 ease-initial rounded-full overflow-hidden border border-primary/40"
              onClick={() => handleUserProfileClick(comment.user?._id)}
            >
              {comment.user?.profile_picture ? (
                <img
                  src={comment.user.profile_picture}
                  alt={comment.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full size-14 font-newspaper text-xl bg-accent/20 flex items-center justify-center text-primary">
                  {comment.user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="font-typewriter text-base md:text-lg hover:text-primary font-bold cursor-pointer"
                    onClick={() => handleUserProfileClick(comment.user?._id)}
                  >
                    {comment.user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRelativeTime(comment.createdAt)}
                  </p>
                </div>

                {user?.id === comment.user?._id && (
                  <button
                    onClick={() => deleteComment(comment._id)}
                    disabled={isDeletingComment}
                    className="text-primary/70 cursor-pointer hover:text-primary transition-colors"
                  >
                    <Trash2 size={23} />
                  </button>
                )}
              </div>
              <p className="text-[0.99rem] md:text-lg font-typewriter mt-1.5">
                {comment.comment}
              </p>
            </div>
          </div>
          {/* Add divider if not the last comment */}
          {index !== comments.length - 1 && (
            <div className="border-b border-primary/20"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
