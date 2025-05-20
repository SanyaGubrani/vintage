import { useState, useRef, useEffect } from "react";
import { useCommentStore } from "../store/useCommentStore";
import { Loader2 } from "lucide-react";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const CommentBox = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { addComment, isPostingComment } = useCommentStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const response = await addComment(postId, comment);
    if (response.success) {
      setComment("");
    }
  };

  // Add emoji to comment
  const onEmojiClick = (emojiObject) => {
    setComment((prev) => prev + emojiObject.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shadow-sm shadow-primary/40 items-center gap-2 py-2 md:py-4 px-1 md:px-2 border border-primary/40 bg-primary/35"
    >
      {/* Emoji Picker Button */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((v) => !v)}
          className="flex items-center justify-center p-1.5 rounded-md border-2 border-primary/60 bg-muted/70 hover:bg-muted transition-colors cursor-pointer"
          tabIndex={-1}
        >
          <BsEmojiSmile size={24} className="text-primary" />
        </button>
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute top-12 -left-3 z-50"
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="light"
              emojiStyle="apple"
              skinTonesDisabled
              searchDisabled
              // width={400}
              // height={400}
              className=""
            />
          </div>
        )}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 resize-none p-2 rounded-xl h-10 border-[3px] border-primary/60 bg-muted placeholder:text-muted-foreground/70 font-typewriter text-sm focus:outline-none focus:border-primary/80 transition-colors"
        disabled={isPostingComment}
      />
      <button
        type="submit"
        disabled={isPostingComment || !comment.trim()}
        className="p-1 rounded-md text-primary hover:bg-primary-foreground/60 transition-colors cursor-pointer"
      >
        {isPostingComment ? (
          <Loader2 size={21} className="animate-spin" />
        ) : (
          <MdSend size={32} />
        )}
      </button>
    </form>
  );
};

export default CommentBox;