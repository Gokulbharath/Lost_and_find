import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import React from 'react'
import { adminAPI } from '../../api/adminApi';
import { useToast } from '../../components/Toast';


export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    // load initial data
    (async () => {
      try {
        const [uRes, iRes] = await Promise.all([adminAPI.getUsers(), adminAPI.getItems()]);
        setUsers(uRes.data.data || []);
        setItems(iRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast.showToast('Failed to load admin data', 'error');
      }
    })();
  }, [toast]);

  useEffect(() => {
    // load exchange requests lazily
    if (activeTab !== 'approveExchange') return;
    let mounted = true;
    (async () => {
      try {
        const res = await adminAPI.getExchangeRequests();
        if (!mounted) return;
        setExchanges(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.showToast('Failed to load exchange requests', 'error');
      }
    })();
    return () => (mounted = false);
  }, [activeTab, toast]);

  // redirect non-admins after hooks have been set up
  if (!user?.isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
          <div className="flex space-x-4 mb-6">
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Manage Users</button>
            <button onClick={() => setActiveTab('items')} className={`px-4 py-2 rounded-lg ${activeTab === 'items' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Manage Items</button>
             <button onClick={() => setActiveTab('approvePost')} className={`px-4 py-2 rounded-lg ${activeTab === 'approvePost' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Approve Post</button>
              <button onClick={() => setActiveTab('approveExchange')} className={`px-4 py-2 rounded-lg ${activeTab === 'approveExchange' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Approve Exchange</button>
          </div>
          {activeTab === 'users' && <UsersManagement users={users} setUsers={setUsers} />}
          {activeTab === 'items' && <ItemsManagement items={items} setItems={setItems} />}
          {activeTab === 'approvePost' && <ApprovePost items={items} setItems={setItems} />}
          {activeTab === 'approveExchange' && <ApproveExchange exchanges={exchanges} setExchanges={setExchanges} />}
        </div>
      </div>
      <Footer /> 
    </div>    
  ); 
} 

function UsersManagement({ users, setUsers }) {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', email: '', status: 'Active' });
  const toast = useToast();

  const startEdit = (user) => {
    const uid = user._id || user.id;
    setEditingId(uid);
    setEditValues({ name: user.full_name || user.name || '', email: user.email || '', status: user.is_active === false ? 'Inactive' : 'Active' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: '', email: '', status: 'Active' });
  };

  const saveEdit = async (id) => {
    if (!editValues.name.trim() || !editValues.email.trim()) {
      toast.showToast('Name and email are required', 'error');
      return;
    }
    try {
      await adminAPI.updateUser(id, { full_name: editValues.name, email: editValues.email });
      setUsers((prev) => prev.map((u) => ((u._id || u.id) === id ? { ...u, full_name: editValues.name, email: editValues.email } : u)));
      toast.showToast('User updated', 'success');
      cancelEdit();
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to update user', 'error');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
      toast.showToast('User deleted', 'success');
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to delete user', 'error');
    }
  };

  const suspendUser = async (id) => {
    try {
      await adminAPI.suspendUser(id);
      setUsers((prev) => prev.map((u) => ((u._id || u.id) === id ? { ...u, is_active: false } : u)));
      toast.showToast('User suspended', 'success');
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to suspend user', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Users Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => {
              const uid = user._id || user.id;
              const name = user.full_name || user.name || 'Unknown';
              const email = user.email || '';
              const status = user.is_active === false ? 'Inactive' : 'Active';
              return (
                <tr key={uid} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === uid ? (
                      <input value={editValues.name} onChange={(e) => setEditValues((s) => ({ ...s, name: e.target.value }))} className="border px-2 py-1 rounded w-64 text-sm" />
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{`ID: ${uid}`}</div>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {editingId === uid ? (
                      <input value={editValues.email} onChange={(e) => setEditValues((s) => ({ ...s, email: e.target.value }))} className="border px-2 py-1 rounded w-64 text-sm" />
                    ) : (
                      email
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === uid ? (
                      <select value={editValues.status} onChange={(e) => setEditValues((s) => ({ ...s, status: e.target.value }))} className="border px-2 py-1 rounded text-sm">
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
                        {status}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {editingId === uid ? (
                      <>
                        <button onClick={() => saveEdit(uid)} className="px-3 py-1 bg-green-600 text-white rounded-md text-xs">Save</button>
                        <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-xs">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(user)} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700" title="Edit">✏️</button>
                        <button onClick={() => deleteUser(uid)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600" title="Delete">🗑️</button>
                        <button onClick={() => suspendUser(uid)} className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600" title="Suspend">⛔</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemsManagement({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: '', category: '', status: '' });
  const toast = useToast();

  const activeItems = items.filter((it) => it.is_active !== false);

  const startEdit = (it) => {
    const id = it._id || it.id;
    setEditingId(id);
    setEditValues({ title: it.title || it.item || '', category: it.category || it.Category || '', status: it.status || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ title: '', category: '', status: '' });
  };

  const saveEdit = async (id) => {
    // only status update available via admin endpoints; other fields would require a custom endpoint
    try {
      await adminAPI.updateItemStatus(id, editValues.status);
      setItems((prev) => prev.map((p) => ((p._id || p.id) === id ? { ...p, status: editValues.status } : p)));
      toast.showToast('Item status updated', 'success');
      cancelEdit();
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to update item', 'error');
    }
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await adminAPI.deleteItem(id, type);
      setItems((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.showToast('Item deleted', 'success');
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to delete item', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Items Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeItems.map((it) => {
              const id = it._id || it.id;
              return (
                <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === id ? (
                      <input value={editValues.title} onChange={(e) => setEditValues((s) => ({ ...s, title: e.target.value }))} className="border px-2 py-1 rounded w-56 text-sm" />
                    ) : (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{it.title || it.item}</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {editingId === id ? (
                      <input value={editValues.category} onChange={(e) => setEditValues((s) => ({ ...s, category: e.target.value }))} className="border px-2 py-1 rounded w-56 text-sm" />
                    ) : (
                      it.category || it.Category
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === id ? (
                      <select value={editValues.status} onChange={(e) => setEditValues((s) => ({ ...s, status: e.target.value }))} className="border px-2 py-1 rounded text-sm">
                        <option value="available">available</option>
                        <option value="returned">returned</option>
                        <option value="closed">closed</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${it.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
                        {it.status}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {editingId === id ? (
                      <>
                        <button onClick={() => saveEdit(id)} className="px-3 py-1 bg-green-600 text-white rounded-md text-xs">Save</button>
                        <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-xs">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(it)} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700" title="Edit">✏️</button>
                        <button onClick={() => deleteItem(id, it.type)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600" title="Delete">🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {activeItems.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApprovePost({ items, setItems }) {
  const toast = useToast();

  const pending = items.filter((it) => it.is_active === false);

  const acceptPost = async (item) => {
    if (!window.confirm('Accept this post?')) return;
    try {
      const id = item._id || item.id;
      await adminAPI.acceptItem(id, item.type);
      setItems((prev) => prev.map((p) => ((p._id || p.id) === id ? { ...p, is_active: true } : p)));
      toast.showToast('Post accepted', 'success');
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to accept post', 'error');
    }
  };

  const deletePost = async (item) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const id = item._id || item.id;
      await adminAPI.rejectItem(id, item.type);
      setItems((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.showToast('Post deleted', 'success');
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to delete post', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Approve Posts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pending.map((p) => {
              const id = p._id || p.id;
              const userName = p.user_id?.full_name || p.user_id?.name || 'Unknown';
              const email = p.user_id?.email || '';
              return (
                <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{userName}</span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{email}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{p.title || p.item}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{p.category || p.Category}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3 flex items-center">
                    <button onClick={() => acceptPost(p)} className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600" title="Accept Post">✅</button>
                    <button onClick={() => deletePost(p)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600" title="Delete Post">🗑️</button>
                  </td>
                </tr>
              );
            })}

            {pending.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No posts to approve.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApproveExchange({ exchanges, setExchanges }) {
  const toast = useToast();
  
  const acceptExchange = async (id) => {
    if (!window.confirm('Accept this exchange request?')) return;
    try {
      await adminAPI.acceptExchangeRequest(id);
      deleteExchange(id);
      setExchanges((prev) => prev.filter((e) => e._id !== id && e.id !== id));
      toast.showToast('Exchange accepted and item marked as returned', 'success');
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to accept exchange', 'error');
    }
  };

  const deleteExchange = async (id) => {
    if (!window.confirm('Delete this exchange request?')) return;
    try {
      await adminAPI.deleteExchangeRequest(id);
      setExchanges((prev) => prev.filter((e) => e._id !== id && e.id !== id));
      toast.showToast('Exchange request deleted', 'success');
    } catch (err) {
      console.error(err);
      toast.showToast('Failed to delete exchange', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Approve Exchanges</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {exchanges.map((ex) => {
              const id = ex._id || ex.id;
              const name = ex.userId?.full_name || ex.userId?.name || 'Unknown';
              const email = ex.userId?.email || '';
              return (
                <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{ex.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{ex.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ex.type === 'lost' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {ex.type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ex.status === 'available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {ex.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3 flex items-center">
                    <button 
                      onClick={() => acceptExchange(id)} 
                      className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600" 
                      title="Accept Exchange Request"
                    >
                      ✅
                    </button>
                    <button 
                      onClick={() => deleteExchange(id)} 
                      className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600" 
                      title="Delete Exchange Request"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}

            {exchanges.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No exchange requests.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
