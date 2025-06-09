import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePostStore = create((set) => ({
  fetchingUserPost: true,
  myPosts: [],
  allPosts: [],
  userPosts: [],
  newPost: null,
  isPosting: false,
  isDeleting: false,
  newCaption: "",
  isEditing: false,
  editingPostId: null,
  fetchingUserPost: false,

  getMyPosts: async (cursor = null) => {
    try {
      const res = await axiosInstance.get(
        `/post/me/posts${cursor ? `?cursor=${cursor}` : ""}`
      );
      const { posts, pagination } = res.data.data;

      set((state) => ({
        myPosts: cursor ? [...state.myPosts, ...posts] : posts,
      }));

      return {
        posts,
        hasMore: pagination.hasNextPage,
        nextCursor: pagination.nextCursor,
      };
    } catch (error) {
      console.log("Error in fetching my posts: ", error);
      return {
        posts: [],
        hasMore: false,
        nextCursor: null,
      };
    }
  },

  getAllPosts: async (cursor = null) => {
    try {
      const res = await axiosInstance.get(
        `/post${cursor ? `?cursor=${cursor}` : ""}`
      );
      const { posts, pagination } = res.data.data;

      set((state) => ({
        allPosts: cursor ? [...state.allPosts, ...posts] : posts,
      }));

      return {
        posts,
        hasMore: pagination.hasNextPage,
        nextCursor: pagination.nextCursor,
      };
    } catch (error) {
      console.log("Error fetching feed posts: ", error);
      return {
        posts: [],
        hasMore: false,
        nextCursor: null,
      };
    }
  },

  createPost: async (data) => {
    try {
      set({ isPosting: true });
      const res = await axiosInstance.post("/post", data);
      const newPost = res.data.data;

      set((state) => ({
        newPost,
        allPosts: [newPost, ...state.allPosts],
        myPosts: [newPost, ...state.myPosts],
      }));

      toast.success("Post created successfully");
      // console.log("post created: ", res.data);
    } catch (error) {
      toast.error("Error while creating a new post");
      console.log("Error while creating a post: ", error);
    } finally {
      set({ isPosting: false });
    }
  },

  deletePost: async (postId) => {
    try {
      set({ isDeleting: true });
      await axiosInstance.delete(`/post/${postId}`);

      set((state) => ({
        allPosts: state.allPosts.filter((post) => post._id !== postId),
        myPosts: state.myPosts.filter((post) => post._id !== postId),
      }));

      toast.success("Post deleted successfully");
      return true;
    } catch (error) {
      toast.error("Error while deleting the post");
      console.log("Error while deleting the post: ", error);
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  editCaption: async (postId, newCaption) => {
    try {
      set({ isEditing: true });
      const res = await axiosInstance.post(`/post/${postId}/caption`, {
        caption: newCaption,
      });

      // console.log("Edited Post: ", res);
      const updatedPost = res.data.data;
      // console.log("edited post", updatedPost);

      set((state) => ({
        allPosts: state.allPosts.map((post) =>
          post._id === postId ? updatedPost : post
        ),
        myPosts: state.myPosts.map((post) =>
          post._id === postId ? updatedPost : post
        ),
      }));

      toast.success("Caption updated successfully");
      return true;
    } catch (error) {
      console.log("Error while updating the caption", error);
      toast.error("Error while updating the caption");
      return false;
    } finally {
      set({ isEditing: false });
    }
  },

  // Toggle edit mode for a post
  setEditingPostId: (postId) => {
    set({ editingPostId: postId });
  },

  // Set the new caption text
  setNewCaption: (caption) => {
    set({ newCaption: caption });
  },

  // Reset editing state
  resetEditing: () => {
    set({
      editingPostId: null,
      newCaption: "",
      isEditing: false,
    });
  },

  getUsersPosts: async (userId, cursor = null) => {
    try {
      if (!userId) {
        console.error("No user ID provided");
        return {
          posts: [],
          hasMore: false,
          nextCursor: null,
        };
      }

      set({ fetchingUserPost: true });
      const res = await axiosInstance.get(
        `/post/${userId}${cursor ? `?cursor=${cursor}` : ""}`
      );
      const { posts, pagination } = res.data.data;

      set((state) => ({
        userPosts: cursor ? [...state.userPosts, ...posts] : posts,
        fetchingUserPost: false,
      }));

      return {
        posts,
        hasMore: pagination.hasNextPage,
        nextCursor: pagination.nextCursor,
      };
    } catch (error) {
      console.log("Error in fetching user posts: ", error);
      set({
        userPosts: [],
        fetchingUserPost: false,
      });
      return {
        posts: [],
        hasMore: false,
        nextCursor: null,
      };
    }
  },
}));
