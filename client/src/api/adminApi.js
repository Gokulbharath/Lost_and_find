import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const adminAPI = {
  getUsers: () => axios.get(`${BASE_URL}/admin/users`),
  getItems: () => axios.get(`${BASE_URL}/admin/items`),
  deleteUser: (userId: string) => axios.delete(`${BASE_URL}/admin/users/${userId}`),
  suspendUser: (userId: string) => axios.post(`${BASE_URL}/admin/users/${userId}/suspend`),
  deleteItem: (itemId: string) => axios.delete(`${BASE_URL}/admin/items/${itemId}`),
  updateItemStatus: (itemId: string, status: string) => 
    axios.patch(`${BASE_URL}/admin/items/${itemId}`, { status })
};