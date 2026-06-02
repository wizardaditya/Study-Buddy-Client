import api from "@/lib/axios";

export const testService = {
  async getTests({ topic, difficulty } = {}) {
    const params = new URLSearchParams();
    if (topic) params.append("topic", topic);
    if (difficulty) params.append("difficulty", difficulty);
    const { data } = await api.get(`/tests?${params}`);
    return data.data;
  },
  async getTest(id) {
    const { data } = await api.get(`/tests/${id}`);
    return data.data;
  },
  async submitAttempt(id, answers) {
    const { data } = await api.post(`/tests/${id}/attempt`, { answers });
    return data.data;
  },
  async getResult(id) {
    const { data } = await api.get(`/tests/results/${id}`);
    return data.data;
  },
};
