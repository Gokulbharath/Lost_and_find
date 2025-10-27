import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { adminAPI } from '../api/adminApi';
import { User } from '../types/auth';

export interface AdminUser extends User {
  createdAt: string;
  lastLogin: string;
  suspended?: boolean;
}

export interface AdminItem {
  id: string;
  title: string;
  category: string;
  status: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminContextType {
  users: AdminUser[];
  items: AdminItem[];
  loading: boolean;
  error: string | null;
  deleteUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  updateItemStatus: (itemId: string, status: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!user?.isAdmin) return;
    setLoading(true);
    setError(null);
    
    try {
      const [usersRes, itemsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getItems()
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

  const deleteUser = async (userId: string) => {
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
      console.error('Delete user error:', err);
      throw err;
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      await adminAPI.suspendUser(userId);
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, suspended: true }
          : u
      ));
    } catch (err) {
      setError('Failed to suspend user');
      console.error('Suspend user error:', err);
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await adminAPI.deleteItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete item error:', err);
      throw err;
    }
  };

  const updateItemStatus = async (itemId: string, status: string) => {
    try {
      await adminAPI.updateItemStatus(itemId, status);
      setItems(items.map(item =>
        item.id === itemId
          ? { ...item, status }
          : item
      ));
    } catch (err) {
      setError('Failed to update item status');
      console.error('Update item status error:', err);
      throw err;
    }
  };

  const value = {
    users,
    items,
    loading,
    error,
    deleteUser,
    suspendUser,
    deleteItem,
    updateItemStatus,
    refreshData
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}