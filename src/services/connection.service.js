import api from "@/lib/axios";

export const connectionService = {
  async getMyConnections() {
    const { data } = await api.get("/connections");
    return data.data;
  },
  async getPendingRequests() {
    const { data } = await api.get("/connections/pending");
    return data.data;
  },
  async getSentRequests() {
    const { data } = await api.get("/connections/sent");
    return data.data;
  },
  async getStatus(userId) {
    const { data } = await api.get(`/connections/status/${userId}`);
    return data.data; // { status: "none"|"pending"|"accepted", connectionId, isSentByMe }
  },
  async sendRequest(userId) {
    const { data } = await api.post(`/connections/request/${userId}`);
    return data.data;
  },
  async acceptRequest(connectionId) {
    const { data } = await api.put(`/connections/accept/${connectionId}`);
    return data.data;
  },
  async removeConnection(id) {
    await api.delete(`/connections/${id}`);
  },
};
