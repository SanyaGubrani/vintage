import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  fetchingUserData: true,
  user: "",

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
}));
