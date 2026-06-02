import api from "@/lib/axios";

export const auraService = {
  async chat(message, sessionId) {
    const { data } = await api.post("/aura/chat", { message, sessionId });
    return data.data;
  },
  async getHistory(sessionId) {
    const { data } = await api.get(`/aura/history/${sessionId}`);
    return data.data;
  },
  async clearMemory() {
    await api.delete("/aura/memory");
  },
  async getSessions() {
    const { data } = await api.get("/aura/sessions");
    return data.data;
  },
};
