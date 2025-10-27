// Separating the hook into its own file for Fast Refresh compatibility
import { useContext } from 'react';
import { AdminContext } from './AdminContext';

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}