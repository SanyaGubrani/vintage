import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Loader } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file); // Store the File object directly
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;
    try {
      setIsSending(true);
      let dataToSend;
      if (imageFile) {
        dataToSend = new FormData();
        dataToSend.append("message", text.trim());
        dataToSend.append("media", imageFile);
      } else {
        dataToSend = { message: text.trim() };
      }
      await sendMessage(dataToSend);
      setText("");
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const input = inputRef.current;
    if (!input) {
      setText((prev) => prev + emoji);
      return;
    }
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        e.target.getAttribute("aria-label") !== "emoji-btn"
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showEmojiPicker]);

  return (
    <div className="p-2.5 md:p-4 w-full bg-background border-t border-primary/20">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border-2 border-primary/30 shadow"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary/90 text-white flex items-center justify-center shadow hover:bg-primary"
              type="button"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {isSending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
            <span className="animate-spin text-primary/75">
              <Loader className="size-6" />
            </span>
            <span className="ml-2 text-primary/75 font-typewriter">
              Sending...
            </span>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1 flex gap-2 items-end">
            {/* Emoji Button */}
            <div className="relative flex items-center">
              <button
                type="button"
                aria-label="emoji-btn"
                className="p-1.5 md:p-2 rounded-md border border-primary/30 bg-muted/40 hover:bg-muted-foreground/20 transition-colors text-primary"
                onClick={() => setShowEmojiPicker((v) => !v)}
              >
                <Smile size={22} />
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-12 left-0 z-50"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="light"
                    emojiStyle="native"
                    width={320}
                    height={400}
                    skinTonesDisabled
                    searchDisabled
                  />
                </div>
              )}
            </div>
            {/* Image Button */}
            <button
              type="button"
              className={`p-1.5 md:p-2 rounded-md border border-primary/30 bg-muted/40 hover:bg-muted-foreground/20 transition-colors text-primary`}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach image"
            >
              <Image size={22} />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            {/* Message Input */}
            <input
              ref={inputRef}
              type="text"
              className="w-full rounded-lg border-2 border-primary/30 bg-muted/20 px-1.5 md:px-3 py-1.5 md:py-2 font-typewriter text-sm focus:outline-none focus:border-primary/60 shadow-sm"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoComplete="off"
            />
          </div>
          {/* Send Button */}
          <button
            type="submit"
            className="p-1.5 md:p-2 size-7 md:size-9 items-center flex rounded-full bg-primary text-muted hover:bg-primary/90 transition-colors shadow-vintage disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={!text.trim() && !imagePreview}
            aria-label="Send message"
          >
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
