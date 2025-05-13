// stores/useLikeStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useLikeStore = create((set, get) => ({
  likes: {},
  isProcessingLike: false,

  // Toggle like status
  toggleLike: async (postId) => {
    try {
      set({ isProcessingLike: true });

      const res = await axiosInstance.post(`/like/${postId}`);
      const { isLiked, likeCount } = res.data.data;

      set((state) => ({
        likes: {
          ...state.likes,
          [postId]: {
            isLiked,
            likeCount,
          },
        },
        isProcessingLike: false,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle like");
      set({ isProcessingLike: false });
    }
  },

  setLikesFromPosts: (posts) => {
    const newLikes = {};
    posts.forEach((post) => {
      newLikes[post._id] = {
        isLiked: post.isLiked || false,
        likeCount: post.likeCount || 0,
      };
    });
    set((state) => ({
      likes: {
        ...state.likes,
        ...newLikes,
      },
    }));
  },

  // Initialize like state for post (optional on feed load)
  setInitialLikeState: (postId, isLiked, likeCount) => {
    set((state) => ({
      likes: {
        ...state.likes,
        [postId]: {
          isLiked,
          likeCount,
        },
      },
    }));
  },
}));
