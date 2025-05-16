import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCommentStore = create((set, get) => ({
  comments: [],
  commentCounts: {}, 
  isPostingComment: false,
  isFetchingComments: false,
  isDeletingComment: false,

  initializeCommentCounts: async (posts) => {
    try {
      const promises = posts.map(async (post) => {
        const res = await axiosInstance.get(`/comment/post/${post._id}`);
        return { postId: post._id, count: res.data.data.totalCount };
      });

      const results = await Promise.all(promises);
      const counts = {};
      results.forEach(({ postId, count }) => {
        counts[postId] = count;
      });

      set({ commentCounts: counts });
    } catch (error) {
      console.error("Error initializing comment counts:", error);
    }
  },

  addComment: async (postId, commentText) => {
    try {
      set({ isPostingComment: true });
      const res = await axiosInstance.post(`/comment/post/${postId}`, {
        comment: commentText,
      });

      const { newComment } = res.data.data;
      set((state) => ({
        comments: [newComment, ...state.comments],
        commentCounts: {
          ...state.commentCounts,
          [postId]: (state.commentCounts[postId] || 0) + 1,
        },
      }));

      toast.success("Comment added successfully");
      return { success: true, comment: newComment };
    } catch (error) {
      toast.error("Error adding comment");
      console.error("Error adding comment:", error);
      return { success: false };
    } finally {
      set({ isPostingComment: false });
    }
  },

  getComments: async (postId) => {
    try {
      set({ isFetchingComments: true });
      const res = await axiosInstance.get(`/comment/post/${postId}`);
      const { comments, totalCount } = res.data.data;

      set((state) => ({
        comments,
        commentCounts: {
          ...state.commentCounts,
          [postId]: totalCount,
        },
      }));
      return { success: true, comments, totalCount };
    } catch (error) {
      console.error("Error fetching comments:", error);
      set((state) => ({
        comments: [],
        commentCounts: {
          ...state.commentCounts,
          [postId]: 0,
        },
      }));
      return { success: false, comments: [], totalCount: 0 };
    } finally {
      set({ isFetchingComments: false });
    }
  },

  deleteComment: async (commentId, postId) => {
    try {
      set({ isDeletingComment: true });
      await axiosInstance.delete(`/comment/${commentId}`);

      set((state) => ({
        comments: state.comments.filter((comment) => comment._id !== commentId),
        commentCounts: {
          ...state.commentCounts,
          [postId]: Math.max(0, (state.commentCounts[postId] || 0) - 1),
        },
      }));

      toast.success("Comment deleted successfully");
      return { success: true };
    } catch (error) {
      toast.error("Error deleting comment");
      console.error("Error deleting comment:", error);
      return { success: false };
    } finally {
      set({ isDeletingComment: false });
    }
  },

  getCommentCount: (postId) => get().commentCounts[postId] || 0,
}));
