import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null, //initially we do not know if the user is authenticated or not
  isRegistering: false,
  isLoggingIn: false,
  isCheckingAuth: true, // a loading state to check auth

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data });
      console.log("Auth check response:", res.data);
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  googleOAuth: async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },

  registerUser: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      console.log("Registration response:", res.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error while registering the user", error.response.data);
    } finally {
      set({ isRegistering: false });
    }
  },

  loginUser: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      console.log("Login response:", res.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error while logging in the user", error.response.data);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logoutUser: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      window.location.href = "/auth";
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error while logging out:", error.response.data);
    }
  },
}));
