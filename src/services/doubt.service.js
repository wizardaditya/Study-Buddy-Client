import api from "@/lib/axios";

export const doubtService = {
  async getDoubts({ topic, status, page = 1 } = {}) {
    const params = new URLSearchParams();
    if (topic) params.append("topic", topic);
    if (status) params.append("status", status);
    params.append("page", page);
    const { data } = await api.get(`/doubts?${params}`);
    return { doubts: data.data, hasMore: data.pagination?.hasMore ?? false };
  },
  async createDoubt({ title, content, topic, tags = [] }) {
    const { data } = await api.post("/doubts", { title, content, topic, tags });
    return data.data;
  },
  async getDoubt(id) {
    const { data } = await api.get(`/doubts/${id}`);
    return data.data;
  },
  async addAnswer(doubtId, content) {
    const { data } = await api.post(`/doubts/${doubtId}/answers`, { content });
    return data.data;
  },
  async acceptAnswer(doubtId, answerId) {
    await api.put(`/doubts/${doubtId}/answers/${answerId}/accept`);
  },
  async upvoteAnswer(doubtId, answerId) {
    await api.post(`/doubts/${doubtId}/answers/${answerId}/upvote`);
  },
};
