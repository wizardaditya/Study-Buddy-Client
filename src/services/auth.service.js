import api from "@/lib/axios";

export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    return data.data;
  },
  async register({ name, username, email, password }) {
    const { data } = await api.post("/auth/register", { name, username, email, password });
    return data.data;
  },
  async forgotPassword(email) {
    await api.post("/auth/forgot-password", { email });
  },
  async resetPassword(token, password) {
    await api.post("/auth/reset-password", { token, password });
  },
  async refreshToken(refreshToken) {
    const { data } = await api.post("/auth/refresh", { refreshToken });
    return data.data;
  },
  async logout() {
    await api.post("/auth/logout");
  },
  async googleAuth(idToken) {
    const { data } = await api.post("/auth/google", { idToken });
    return data.data;
  },
};
