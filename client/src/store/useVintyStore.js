import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVintyStore = create(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "vinty-messages",
    }
  )
);

export const createVintyStore = (userId) =>
  create(
    persist(
      (set) => ({
        messages: [],
        setMessages: (messages) => set({ messages }),
        addMessage: (msg) =>
          set((state) => ({ messages: [...state.messages, msg] })),
        clearMessages: () => set({ messages: [] }),
      }),
      {
        name: `vinty-messages-${userId}`, // unique key per user
      }
    )
  );
