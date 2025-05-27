import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4080";

export const useAuthStore = create((set, get) => ({
  authUser: null, //initially we do not know if the user is authenticated or not
  isRegistering: false,
  isLoggingIn: false,
  isCheckingAuth: true, // a loading state to check auth
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data });
      get().connectSocket();
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
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
      window.location.href = "/auth";
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error while logging out:", error.response.data);
    }
  },

  connectSocket: async () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser.id },
    });

    socket.connect();

    set({ socket: socket });
  },

  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
