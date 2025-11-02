import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const adminAPI = {
  // Users
  getUsers: () => axios.get(`${BASE_URL}/admin/users`),
  deleteUser: (userId) => axios.delete(`${BASE_URL}/admin/users/${userId}`),
  suspendUser: (userId) => axios.post(`${BASE_URL}/admin/users/${userId}/suspend`),
  updateUser: (userId, payload) => axios.patch(`${BASE_URL}/admin/users/${userId}`, payload),

  // Items
  // pass optional status ('active'|'inactive') to filter
  getItems: (status) => axios.get(`${BASE_URL}/admin/items`, { params: status ? { status } : {} }),
  // delete expects query param `type` ('found'|'lost')
  deleteItem: (itemId, type) => axios.delete(`${BASE_URL}/admin/items/${itemId}`, { params: { type } }),
  updateItemStatus: (itemId, status) => axios.patch(`${BASE_URL}/admin/items/${itemId}`, { status }),
  acceptItem: (itemId, type) => axios.post(`${BASE_URL}/admin/items/${itemId}/accept`, null, { params: { type } }),
  rejectItem: (itemId, type) => axios.post(`${BASE_URL}/admin/items/${itemId}/reject`, null, { params: { type } }),

  // Exchange requests
  getExchangeRequests: (accept) => axios.get(`${BASE_URL}/admin/exchange-requests`, { params: accept !== undefined ? { accept } : {} }),
  addExchangeRequest: (payload) => axios.post(`${BASE_URL}/admin/exchange-requests`, payload),
  acceptExchangeRequest: (id) => axios.post(`${BASE_URL}/admin/exchange-requests/${id}/accept`),
  deleteExchangeRequest: (id) => axios.delete(`${BASE_URL}/admin/exchange-requests/${id}`),
};


