import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  fetchingUserData: true,
  user: "",
  updatingProfile: false,
  updatingProfilePicture: false,
  updatingCoverImage: false,

  getUserProfile: async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      set({ user: res.data.data });
      console.log("User data response: ", res.data.data);
    } catch (error) {
      console.log("Error in fetching user data:", error);
      set({ user: null });
    } finally {
      set({ fetchingUserData: false });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ updatingProfile: true });
      const res = await axiosInstance.post("/user/updateProfile", data);
      set({ user: res.data.data });
      toast.success("Profile Updated successfully");
      console.log("Update user profile: ", res.data.data);
      return true;
    } catch (error) {
      console.error("Error while updating details", error);
      toast.error(error.response?.data?.message || "Error updating profile");
      return false;
    } finally {
      set({ updatingProfile: false });
    }
  },

  setProfilePicture: async (data) => {
    try {
      set({ updatingProfilePicture: true });
      const res = await axiosInstance.post("/user/profilePicture", data);
      set({ user: res.data.data });
      toast.success("Profile Picture updated successfully");
      console.log("profile picture: ", res.data);

    } catch (error) {
      toast.error("Error while uploading profile picture");
      console.log("Error while uploading profile picture: ", error);
    } finally {
      set({ updatingProfilePicture: false });
    }
  },

  setCoverImage: async (data) => {
    try {
      set({ updatingCoverImage: true });
      const res = await axiosInstance.post("/user/coverImage", data);
      set({ user: res.data.data });
      toast.success("Cover Image updated successfully");
      console.log("Cover Image: ", res.data);
    } catch (error) {
      toast.error("Error while uploading Cover Image");
      console.log("Error while uploading Cover Image: ", error);
    } finally {
      set({ updatingCoverImage: false });
    }
  },

  getOtherUserProfile: async (userId) => {
    try {
      if (!userId) return null;

      const res = await axiosInstance.get(`/user/${userId}`);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Could not load user profile");
      return null;
    }
  },
}));
