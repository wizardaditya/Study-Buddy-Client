import api from "@/lib/axios";

export const mentorService = {
  async getMentors({ expertise, page = 1 } = {}) {
    const params = new URLSearchParams();
    if (expertise) params.append("expertise", expertise);
    params.append("page", page);
    const { data } = await api.get(`/mentors?${params}`);
    return data.data;
  },
  async getMentor(username) {
    const { data } = await api.get(`/mentors/${username}`);
    return data.data;
  },
  async applyAsMentor({ expertise, hourlyRate, bio }) {
    await api.post("/mentors/apply", { expertise, hourlyRate, bio });
  },
  async bookSession(mentorId, { scheduledAt, topic }) {
    await api.post(`/mentors/${mentorId}/book`, { scheduledAt, topic });
  },
};
