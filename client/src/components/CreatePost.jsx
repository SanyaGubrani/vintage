import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Paperclip, Image, Send, Loader2 } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { usePostStore } from "../store/usePostStore";
import { useForm } from "react-hook-form";

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

  return (
    <div className="bg-accent/10 rounded-lg border-4 border-secondary-foreground/20 shadow-vintage p-4 my-6">
      <h2 className="font-newspaper text-center text-lg mb-4 text-primary/80 tracking-wide">
        Create New Memory
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start gap-3 mb-4">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/70 shrink-0 mt-1">
            {user.profile_picture ? (
              <img
                src={user?.profile_picture || "/images/default-avatar.png"}
                alt={user?.name || "User"}
                className="w-full h-full object-cover filter"
              />
            ) : (
              <div className="w-full h-full bg-accent/20 drop-shadow-xl flex items-center justify-center text-primary font-newspaper">
                {user.username?.charAt(0).toUpperCase() || "Vintage"}
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="flex-1">
            <textarea
              className="w-full min-h-[130px] resize-none p-3 rounded-md border-2 border-primary/40 bg-muted/20 placeholder:text-muted-foreground/70 font-typewriter text-sm focus:outline-none focus:border-primary/80 transition-colors"
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
        <div className="flex items-center justify-between mt-2 border-t-2 border-primary/20 pt-3">
          <div className="flex items-center gap-2">
            {/* Add Image Button */}
            <label className="flex items-center gap-1.5 py-1.5 px-2.5 font-medium bg-muted/30 rounded-md border border-primary/40 hover:bg-muted-foreground/20 transition-colors cursor-pointer text-sm font-typewriter">
              <Camera size={20} className="text-primary" />
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (!caption?.trim() && !selectedFile)}
            className={`button-vintage !px-2.5 !py-1.5 flex items-center gap-2 text-sm font-typewriter-bold ${
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
