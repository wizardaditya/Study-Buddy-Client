import { create } from "zustand";

export const useAuraStore = create((set) => ({
  messages: [],
  sessionId: null,
  isTyping: false,
  dailyUsed: 0,
  dailyLimit: 10,

  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setSessionId: (id) => set({ sessionId: id }),
  setTyping: (isTyping) => set({ isTyping }),
  incrementUsage: () => set((state) => ({ dailyUsed: state.dailyUsed + 1 })),
  setDailyLimit: (dailyLimit) => set({ dailyLimit }),
  clearSession: () => set({ messages: [], sessionId: null, isTyping: false }),
}));
