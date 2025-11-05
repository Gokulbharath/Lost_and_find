// @refresh reset
import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { adminAPI } from '../api/adminApi';

export const adminContext = createContext(undefined);

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    if (!user?.isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const [usersRes, itemsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getItems(),
      ]);
      setUsers(usersRes.data.data);
      setItems(itemsRes.data.data);
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.isAdmin]);

  useEffect(() => {
    refreshData();
  }, [user, refreshData]);

  const deleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
      console.error('Delete user error:', err);
      throw err;
    }
  };

  const suspendUser = async (userId) => {
    try {
      await adminAPI.suspendUser(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, suspended: true } : u)));
    } catch (err) {
      setError('Failed to suspend user');
      console.error('Suspend user error:', err);
      throw err;
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await adminAPI.deleteItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete item error:', err);
      throw err;
    }
  };

  const updateItemStatus = async (itemId, status) => {
    try {
      await adminAPI.updateItemStatus(itemId, status);
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, status } : i)));
    } catch (err) {
      setError('Failed to update item status');
      console.error('Update item status error:', err);
      throw err;
    }
  };

  const value = { users, items, loading, error, deleteUser, suspendUser, deleteItem, updateItemStatus, refreshData };
  return <adminContext.Provider value={value}>{children}</adminContext.Provider>;
}


