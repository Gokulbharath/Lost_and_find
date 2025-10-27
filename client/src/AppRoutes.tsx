import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ReportFound from './pages/ReportFound';
import ReportLost from './pages/ReportLost';
import Search from './pages/Search';
import ItemDetails from './pages/ItemDetails';
import AdminDashboard from './pages/admin/Dashboard';
import { AdminProvider } from './contexts/AdminContext';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/search" element={<Search />} />
      <Route path="/items/:id" element={<ItemDetails />} />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/report-found"
        element={
          <ProtectedRoute>
            <ReportFound />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/report-lost"
        element={
          <ProtectedRoute>
            <ReportLost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminProvider>
              <AdminDashboard />
            </AdminProvider>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;