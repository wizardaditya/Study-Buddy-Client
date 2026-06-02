import api from "@/lib/axios";

export const postService = {
  async getFeed(page = 1, limit = 10) {
    const { data } = await api.get(`/posts?page=${page}&limit=${limit}`);
    return { posts: data.data, hasMore: data.pagination?.hasMore ?? false };
  },
  async createPost({ content, type, mediaUrl, tags }) {
    const { data } = await api.post("/posts", { content, type, mediaUrl, tags });
    return data.data;
  },
  async getPost(id) {
    const { data } = await api.get(`/posts/${id}`);
    return data.data;
  },
  async deletePost(id) {
    await api.delete(`/posts/${id}`);
  },
  async likePost(id) {
    await api.post(`/posts/${id}/like`);
  },
  async unlikePost(id) {
    await api.delete(`/posts/${id}/like`);
  },
  async getComments(id) {
    const { data } = await api.get(`/posts/${id}/comments`);
    return data.data;
  },
  async addComment(id, content) {
    const { data } = await api.post(`/posts/${id}/comments`, { content });
    return data.data;
  },
};
