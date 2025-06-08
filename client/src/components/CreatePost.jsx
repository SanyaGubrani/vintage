import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Smile, Send, Loader2 } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useUserStore } from "../store/useUserStore";
import { usePostStore } from "../store/usePostStore";
import { useForm } from "react-hook-form";
import { BsEmojiSmile } from "react-icons/bs";

const CreatePost = () => {
  const { user, getUserProfile } = useUserStore();
  const { createPost, isPosting } = usePostStore();
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPostForm = useForm({
    defaultValues: {
      caption: "",
    },
  });

  const { register, handleSubmit, reset, watch } = createPostForm;
  const caption = watch("caption");

  useEffect(() => {
    if (!user) {
      getUserProfile();
    }
  }, [user, getUserProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const clearImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (formData) => {
    if (!formData.caption.trim() && !selectedFile) return;

    try {
      setIsSubmitting(true);

      //form-data for file upload
      const postData = new FormData();
      postData.append("caption", formData.caption);

      if (selectedFile) {
        postData.append("media", selectedFile);
      }

      await createPost(postData);

      reset();
      clearImage();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Add emoji to caption
  const onEmojiClick = (emojiObject) => {
    const { setValue, getValues } = createPostForm;
    const currentCaption = getValues("caption") || "";
    setValue("caption", currentCaption + emojiObject.emoji);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full md:max-w-[45rem] backdrop-brightness-[105%] rounded-xl border-3 z-10 border-primary/65 shadow-vintage p-2 md:p-4 my-3 md:my-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full items-center justify-center gap-3 mb-4">
          <div className="flex items-center w-full justify-start mb-1 md:mb-2 gap-2">
            {/* User Avatar */}
            <div className="md:size-13 size-11 rounded-full overflow-hidden border-2 border-primary/70 shrink-0 mt-1">
              {user.profile_picture ? (
                <img
                  src={user?.profile_picture || "/images/default-avatar.png"}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent/20 drop-shadow-xl flex items-center justify-center text-primary font-newspaper">
                  {user.username?.charAt(0).toUpperCase() || "Vintage"}
                </div>
              )}
            </div>
            <h2 className="font-newspaper text-center text-xl md:text-[1.7rem] text-primary tracking-wide">
              Create a memory
            </h2>
          </div>

          {/* Caption Input */}
          <div className="flex-1 w-full px-1">
            <textarea
              className="w-full min-h-[140px] md:min-h-[110px] placeholder:text-base md:placeholder:text-lg resize-none p-3 rounded-xl border bg-primary/10 placeholder:text-muted-foreground/80 font-typewriter text-base md:text-lg focus:outline-none focus:border-primary/80 transition-colors"
              placeholder="Share a memory..."
              {...register("caption")}
            ></textarea>

            {/* Media Preview */}
            {imagePreview && (
              <div className="relative mt-3 rounded-md overflow-hidden border-2 border-primary/30 p-1 bg-muted/10">
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 z-20 bg-destructive hover:bg-destructive/90 text-white rounded-full p-1.5 shadow-md opacity-80 hover:opacity-100 transition-all"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto max-h-60 object-contain rounded filter"
                />
                <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-primary/80"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-primary/80"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-primary/80"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-primary/80"></div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-2 border-t-2 border-primary/25 pt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Add Image Button */}
              <label className="flex items-center gap-1.5 py-1.5 px-2.5 font-medium bg-muted/20 rounded-md border-2 border-primary/60 hover:bg-muted-foreground/20 transition-colors cursor-pointer text-sm font-typewriter">
                <Camera size={23} className="text-primary" />
                {/* <span>Add Film</span> */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  name="media"
                />
              </label>
            </div>

            {/* Emoji Picker Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-1.5 py-1.5 px-2.5 font-medium bg-muted/20 rounded-md border-2 border-primary/60 hover:bg-muted-foreground/20 transition-colors cursor-pointer text-sm font-typewriter"
              >
                <BsEmojiSmile size={22} className="text-primary" />
              </button>

              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute top-10 md:left-0 -left-16 z-50"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    theme="light"
                    emojiStyle="apple"
                    skinTonesDisabled
                    searchDisabled
                    width={300}
                    height={370}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (!caption?.trim() && !selectedFile)}
            className={`button-vintage !px-2.5 !py-1.5 flex items-center gap-2 text-xs md:text-sm font-typewriter-bold ${
              isSubmitting || (!caption?.trim() && !selectedFile)
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isPosting ? (
              <div className="flex gap-1.5 items-center">
                <span>Posting</span>
                <Loader2 size={17} className="animate-spin" />
              </div>
            ) : (
              <div className="flex gap-1.5 items-center">
                {" "}
                <span>Post</span>
                <Send size={17} />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
