import api from "@/lib/axios";

export const userService = {
  async getMe() {
    const { data } = await api.get("/users/me");
    return data.data;
  },
  async updateMe(updates) {
    const { data } = await api.put("/users/me", updates);
    return data.data;
  },
  async getProfile(username) {
    const { data } = await api.get(`/users/${username}`);
    return data.data;
  },
  async getUsers({ role, search, page = 1 } = {}) {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (search) params.set("search", search);
    params.set("page", page);
    const { data } = await api.get(`/users?${params}`);
    return data.data;
  },
  async follow(userId) {
    await api.post(`/users/${userId}/follow`);
  },
  async unfollow(userId) {
    await api.delete(`/users/${userId}/follow`);
  },
  async getFollowers(userId, page = 1) {
    const { data } = await api.get(`/users/${userId}/followers?page=${page}`);
    return data.data;
  },
  async getFollowing(userId, page = 1) {
    const { data } = await api.get(`/users/${userId}/following?page=${page}`);
    return data.data;
  },
};
