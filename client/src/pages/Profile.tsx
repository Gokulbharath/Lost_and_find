import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { useToast } from '../components/Toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Modal } from '../components/Modal';
import { FormInput } from '../components/FormInput';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleUpdateProfile = async () => {
    const { error } = await updateProfile(editData);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Profile updated successfully!', 'success');
      setEditModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {profile?.full_name || user?.email || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              {profile?.phone && (
                <p className="text-gray-600 dark:text-gray-400">{profile.phone}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden p-8 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Profile Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Email: {user?.email}</p>
          {profile?.full_name && (
            <p className="text-gray-600 dark:text-gray-400">
              Full Name: {profile.full_name}
            </p>
          )}
          {profile?.phone && (
            <p className="text-gray-600 dark:text-gray-400">Phone: {profile.phone}</p>
          )}
        </div>
      </div>
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <FormInput
            label="Full Name"
            value={editData.full_name}
            onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
          />
          <FormInput
            label="Phone Number"
            value={editData.phone || ''}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />
          <button
            onClick={handleUpdateProfile}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}
