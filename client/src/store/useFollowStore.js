import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useFollowStore = create((set) => ({
  followers: {
    count: 0,
    list: []
  },
  following: {
    count: 0,
    list: []
  },
  isLoadingFollowers: false,
  isLoadingFollowing: false,

  getFollowers: async (userId) => {
    if (!userId) {
      console.log("No user ID provided to getFollowers");
      return;
    }
    
    try {
      set({ isLoadingFollowers: true });
      const res = await axiosInstance.get(`/follow/${userId}/followers`);
      
      const followersData = res.data.data || {};
      
      set({ 
        followers: {
          count: followersData.followersCount || 0,
          list: followersData.followers || []
        }
      });
      
      console.log("Followers data received:", followersData);
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
      const res = await axiosInstance.get(`/follow/${userId}/following`);
      
      const followingData = res.data.data || {};
      
      set({ 
        following: {
          count: followingData.followingCount || 0,
          list: followingData.following || []
        }
      });
      
      console.log("Following data received:", followingData);
    } catch (error) {
      console.error("Error in fetching following:", error);
      set({ following: { count: 0, list: [] } });
    } finally {
      set({ isLoadingFollowing: false });
    }
  },
}));