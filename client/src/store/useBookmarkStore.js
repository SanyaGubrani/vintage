import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useBookmarkStore = create((set) => ({
  savedPosts: [],
  fetchingBookmarkPosts: false,

  getSavedPosts: async () => {
    try {
      set({ fetchingBookmarkPosts: true });
      const res = await axiosInstance.get("/save");
      const validPosts = res.data.data.savedPosts.filter(
        (savedPost) => savedPost.post !== null
      );
      set({
        savedPosts: validPosts,
        fetchingBookmarkPosts: false,
      });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      set({ savedPosts: [], fetchingBookmarkPosts: false });
    }
  },

  addToSavedPosts: async (postId) => {
    try {
      const res = await axiosInstance.post(`/save/${postId}`);
      const { saved, savedPost } = res.data.data;
      set((state) => ({
        savedPosts: saved
          ? [savedPost, ...state.savedPosts]
          : state.savedPosts.filter((sp) => sp.post?._id !== postId),
      }));

      toast.success(saved ? "Post saved" : "Post unsaved");
      return { success: true, saved };
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast.error("Could not update saved status");
      return { success: false };
    }
  },
}));
