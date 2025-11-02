import axios from 'axios';

const baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/api/auth/register', data),
  login: (data) => API.post('/api/auth/login', data),
  profile: () => API.get('/api/auth/profile'),
  updateProfile: (data) => API.put('/api/auth/profile', data),
  changePassword: (data) => API.put('/api/auth/change-password', data),
  logout: () => API.post('/api/auth/logout'),
};

export const itemsAPI = {
  listLost: (params) => API.get('/api/items/lost', { params }),
  listFound: (params) => API.get('/api/items/found', { params }),
  getLost: (id) => API.get(`/api/items/lost/${id}`),
  getFound: (id) => API.get(`/api/items/found/${id}`),
  getCounts: () => API.get('/api/items/my-counts'),
  createLost: (data, image) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    if (image) {
      formData.append('image', image);
    }
    return API.post('/api/items/lost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  createFound: (data, image) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    if (image) {
      formData.append('image', image);
    }
    return API.post('/api/items/found', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateLost: (id, data) => API.put(`/api/items/lost/${id}`, data),
  updateFound: (id, data) => API.put(`/api/items/found/${id}`, data),
  deleteLost: (id) => API.delete(`/api/items/lost/${id}`),
  deleteFound: (id) => API.delete(`/api/items/found/${id}`),
  myLost: () => API.get('/api/items/my/lost'),
  myFound: () => API.get('/api/items/my/found'),
  search: (q, type) => API.get('/api/items/search', { params: { q, type } }),
  stats: () => API.get('/api/items/stats'),
  recent: () => API.get('/api/items/recent'),
};


