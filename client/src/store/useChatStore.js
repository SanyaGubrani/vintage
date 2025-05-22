import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data.data });
    } catch (error) {
      console.log("Error while fetching users: ", error.response.data.message);
      toast.error("Error while fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await  axiosInstance.get(`message/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      console.log(
        "Error while fetching messages: ",
        error.response.data.message
      );
      toast.error("Error while fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //optimize this
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
