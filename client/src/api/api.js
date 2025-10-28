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
  register: (data: { email: string; password: string; full_name: string; phone?: string | null }) => API.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) => API.post('/api/auth/login', data),
  profile: () => API.get('/api/auth/profile'),
  updateProfile: (data: { full_name?: string; phone?: string | null; avatar_url?: string | null }) => API.put('/api/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => API.put('/api/auth/change-password', data),
  logout: () => API.post('/api/auth/logout'),
};

export type LostItemPayload = {
  title: string;
  description: string;
  category: 'Electronics' | 'Books' | 'ID Cards' | 'Clothing' | 'Others';
  lost_date: string; // ISO string
  location: string;
  contact_info: string;
  image_url?: string | null;
  status?: 'lost' | 'found' | 'closed';
};

export type FoundItemPayload = {
  title: string;
  description: string;
  category: 'Electronics' | 'Books' | 'ID Cards' | 'Clothing' | 'Others';
  found_date: string; // ISO string
  location: string;
  contact_info: string;
  image_url?: string | null;
  status?: 'available' | 'returned' | 'closed';
};

export const itemsAPI = {
  listLost: (params?: { page?: number; limit?: number; category?: string; status?: string; search?: string }) => API.get('/api/items/lost', { params }),
  listFound: (params?: { page?: number; limit?: number; category?: string; status?: string; search?: string }) => API.get('/api/items/found', { params }),
  getLost: (id: string) => API.get(`/api/items/lost/${id}`),
  getFound: (id: string) => API.get(`/api/items/found/${id}`),
  createLost: (data: LostItemPayload, image?: File) => {
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
  createFound: (data: FoundItemPayload, image?: File) => {
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
  updateLost: (id: string, data: Partial<LostItemPayload>) => API.put(`/api/items/lost/${id}`, data),
  updateFound: (id: string, data: Partial<FoundItemPayload>) => API.put(`/api/items/found/${id}`, data),
  deleteLost: (id: string) => API.delete(`/api/items/lost/${id}`),
  deleteFound: (id: string) => API.delete(`/api/items/found/${id}`),
  myLost: () => API.get('/api/items/my/lost'),
  myFound: () => API.get('/api/items/my/found'),
  search: (q: string, type?: 'lost' | 'found') => API.get('/api/items/search', { params: { q, type } }),
  stats: () => API.get('/api/items/stats'),
  recent: () => API.get('/api/items/recent'),
};
