import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/items/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/items/${id}`),
  getMyItems: () => api.get('/items/my-items'),
  searchNearby: (params) => api.get('/items/nearby', { params }),
};

export const claimsAPI = {
  create: (itemId, data) => api.post(`/items/${itemId}/claim`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyClaims: () => api.get('/my-claims'),
  getItemClaims: (itemId) => api.get(`/items/${itemId}/claims`),
  approve: (claimId) => api.put(`/claims/${claimId}/approve`),
  reject: (claimId, reason) => api.put(`/claims/${claimId}/reject`, {
    rejection_reason: reason || ''
  }),
};

export const chatsAPI = {
  getMyChats: () => api.get('/chats'),
  getMessages: (chatId) => api.get(`/chats/${chatId}/messages`),
  sendMessage: (chatId, text) => api.post(`/chats/${chatId}/messages`, { message_text: text }),
  markRead: (chatId) => api.put(`/chats/${chatId}/read`),
  getUnreadCount: () => api.get('/chats/unread-count'),
};

export default api;
