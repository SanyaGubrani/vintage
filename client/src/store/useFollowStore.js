import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFollowStore = create((set, get) => ({
  followers: {
    count: 0,
    list: [],
  },
  following: {
    count: 0,
    list: [],
  },
  isLoadingFollowers: false,
  isLoadingFollowing: false,
  isProcessingFollow: false,
  followingUsers: [],
  viewingUserId: null,

  resetFollowState: () => {
    set({
      followers: { count: 0, list: [] },
      following: { count: 0, list: [] },
      viewingUserId: null,
    });
  },

  followUser: async (userId) => {
    if (!userId) return false;

    try {
      set({ isProcessingFollow: true });
      const res = await axiosInstance.post(`/follow/${userId}`);
      const { isFollowing, currentUser, targetUser } = res.data.data;

      // Update following users list
      set((state) => ({
        followingUsers: isFollowing
          ? [...state.followingUsers, userId]
          : state.followingUsers.filter((id) => id !== userId),
        followers: {
          ...state.followers,
          count:
            state.viewingUserId === targetUser._id
              ? targetUser.followersCount
              : state.followers.count,
        },
      }));

      toast.success(isFollowing ? "Following user" : "Unfollowed user");
      return isFollowing;
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
      return false;
    } finally {
      set({ isProcessingFollow: false });
    }
  },

  setViewingUserId: (userId) => {
    set({ viewingUserId: userId });
  },

  getFollowers: async (userId) => {
    if (!userId) {
      console.log("No user ID provided to getFollowers");
      return;
    }

    try {
      set({ isLoadingFollowers: true });

      set({ viewingUserId: userId });

      const res = await axiosInstance.get(`/follow/${userId}/followers`);

      const followersData = res.data.data || {};

      set({
        followers: {
          count: followersData.followersCount || 0,
          list: followersData.followers || [],
        },
      });

      // console.log("Followers data received:", followersData);
    } catch (error) {
      console.error("Error in fetching followers:", error);
      set({ followers: { count: 0, list: [] } });
    } finally {
      set({ isLoadingFollowers: false });
    }
  },

  getFollowing: async (userId) => {
    if (!userId) {
      console.log("No user ID provided to getFollowing");
      return;
    }

    try {
      set({ isLoadingFollowing: true });

      set({ viewingUserId: userId });

      const res = await axiosInstance.get(`/follow/${userId}/following`);

      const followingData = res.data.data || {};

      set({
        following: {
          count: followingData.followingCount || 0,
          list: followingData.following || [],
        },
      });

      // console.log("Following data received:", followingData);
    } catch (error) {
      console.error("Error in fetching following:", error);
      set({ following: { count: 0, list: [] } });
    } finally {
      set({ isLoadingFollowing: false });
    }
  },

  checkFollowStatus: async (userId) => {
    if (!userId) return;

    try {
      const res = await axiosInstance.get(`/follow/status/${userId}`);
      const { isFollowing } = res.data.data;

      set((state) => ({
        followingUsers: isFollowing
          ? [...new Set([...state.followingUsers, userId])]
          : state.followingUsers.filter((id) => id !== userId),
      }));

      return isFollowing;
    } catch (error) {
      console.error("Error checking follow status:", error);
      return false;
    }
  },
}));
