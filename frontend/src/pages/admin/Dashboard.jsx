import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import React  from 'react'


export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

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
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'items' && <ItemsManagement />} 
          {activeTab === 'approvePost' && <ApprovePost />}
          {activeTab === 'approveExchange' && <ApproveExchange />} 
        </div>
      </div>
      <Footer /> 
    </div>    
  ); 
} 

function UsersManagement() {
  const initialUsers = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", status: "Active" },
    { id: 2, name: "Michael Smith", email: "michael.smith@example.com", status: "Inactive" },
    { id: 3, name: "Sofia Patel", email: "sofia.patel@example.com", status: "Active" },
    { id: 4, name: "Daniel Lee", email: "daniel.lee@example.com", status: "Active" },
    { id: 5, name: "Priya Sharma", email: "priya.sharma@example.com", status: "Inactive" },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", email: "", status: "Active" });

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditValues({ name: user.name, email: user.email, status: user.status });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", email: "", status: "Active" });
  };

  const saveEdit = (id) => {
    if (!editValues.name.trim() || !editValues.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, name: editValues.name, email: editValues.email, status: editValues.status } : u)));
    cancelEdit();
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) cancelEdit();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Users Management
      </h2>

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
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === user.id ? (
                    <input
                      value={editValues.name}
                      onChange={(e) => setEditValues((s) => ({ ...s, name: e.target.value }))}
                      className="border px-2 py-1 rounded w-64 text-sm"
                    />
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{`ID: ${user.id}`}</div>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {editingId === user.id ? (
                    <input
                      value={editValues.email}
                      onChange={(e) => setEditValues((s) => ({ ...s, email: e.target.value }))}
                      className="border px-2 py-1 rounded w-64 text-sm"
                    />
                  ) : (
                    user.email
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === user.id ? (
                    <select
                      value={editValues.status}
                      onChange={(e) => setEditValues((s) => ({ ...s, status: e.target.value }))}
                      className="border px-2 py-1 rounded text-sm"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                      }`}
                    >
                      {user.status}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {editingId === user.id ? (
                    <>
                      <button onClick={() => saveEdit(user.id)} className="px-3 py-1 bg-green-600 text-white rounded-md text-xs">Save</button>
                      <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-xs">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(user)} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700" title="Edit">✏️</button>
                      <button onClick={() => deleteUser(user.id)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600" title="Delete">🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}

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

function ItemsManagement() {
  const initialItems = [
    { id: 1, item: "Mobile Phone", Category: "Electronics", status: "Found" },
    { id: 2, item: "Laptop", Category: "Computers", status: "Not Found" },
    { id: 3, item: "Watch", Category: "Accessories", status: "Found" },
    { id: 4, item: "Water Bottle", Category: "Kitchen", status: "Not Found" },
    { id: 5, item: "Headphones", Category: "Audio", status: "Not Found" },
  ];

  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ item: "", Category: "", status: "Found" });

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditValues({ item: it.item, Category: it.Category, status: it.status });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ item: "", Category: "", status: "Found" });
  };

  const saveEdit = (id) => {
    if (!editValues.item.trim() || !editValues.Category.trim()) {
      alert("Item and Category are required.");
      return;
    }
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, item: editValues.item, Category: editValues.Category, status: editValues.status } : p
      )
    );
    cancelEdit();
  };

  const deleteItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) cancelEdit();
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
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === it.id ? (
                    <input
                      value={editValues.item}
                      onChange={(e) => setEditValues((s) => ({ ...s, item: e.target.value }))}
                      className="border px-2 py-1 rounded w-56 text-sm"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{it.item}</span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {editingId === it.id ? (
                    <input
                      value={editValues.Category}
                      onChange={(e) => setEditValues((s) => ({ ...s, Category: e.target.value }))}
                      className="border px-2 py-1 rounded w-56 text-sm"
                    />
                  ) : (
                    it.Category
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === it.id ? (
                    <select
                      value={editValues.status}
                      onChange={(e) => setEditValues((s) => ({ ...s, status: e.target.value }))}
                      className="border px-2 py-1 rounded text-sm"
                    >
                      <option>Found</option>
                      <option>Not Found</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        it.status === "Found"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                      }`}
                    >
                      {it.status}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {editingId === it.id ? (
                    <>
                      <button onClick={() => saveEdit(it.id)} className="px-3 py-1 bg-green-600 text-white rounded-md text-xs">Save</button>
                      <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-xs">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(it)} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700" title="Edit">✏️</button>
                      <button onClick={() => deleteItem(it.id)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600" title="Delete">🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
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

function ApprovePost() {
  const initialPosts = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", item: "Mobile Phone", Category: "Electronics" },
    { id: 2, name: "Michael Smith", email: "michael.smith@example.com", item: "Laptop", Category: "Computers" },
    { id: 3, name: "Sofia Patel", email: "sofia.patel@example.com", item: "Watch", Category: "Accessories" },
    { id: 4, name: "Daniel Lee", email: "daniel.lee@example.com", item: "Water Bottle", Category: "Kitchen" },
    { id: 5, name: "Priya Sharma", email: "priya.sharma@example.com", item: "Headphones", Category: "Audio" },
  ];

  const [posts, setPosts] = useState(initialPosts);

  const acceptPost = (id) => {
    if (!window.confirm("Accept this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    // optionally show feedback
    alert("Post accepted.");
  };

  const deletePost = (id) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
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
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {p.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {p.item}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {p.Category}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3 flex items-center">
                  <button
                    onClick={() => acceptPost(p.id)}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transition-all duration-150"
                    title="Accept Post"
                  >
                    ✅
                  </button>

                  <button
                    onClick={() => deletePost(p.id)}
                    className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg transition-all duration-150"
                    title="Delete Post"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}

            {posts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No posts to approve.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApproveExchange() {
  const initialExchanges = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", offeredItem: "Mobile Phone", requestedItem: "Charger", Category: "Electronics" },
    { id: 2, name: "Michael Smith", email: "michael.smith@example.com", offeredItem: "Laptop", requestedItem: "Mouse", Category: "Computers" },
    { id: 3, name: "Sofia Patel", email: "sofia.patel@example.com", offeredItem: "Watch", requestedItem: "Bracelet", Category: "Accessories" },
    { id: 4, name: "Daniel Lee", email: "daniel.lee@example.com", offeredItem: "Water Bottle", requestedItem: "Tumbler", Category: "Kitchen" },
    { id: 5, name: "Priya Sharma", email: "priya.sharma@example.com", offeredItem: "Headphones", requestedItem: "Earbuds", Category: "Audio" },
  ];

  const [exchanges, setExchanges] = useState(initialExchanges);

  const acceptExchange = (id) => {
    if (!window.confirm("Accept this exchange request?")) return;
    setExchanges((prev) => prev.filter((e) => e.id !== id));
    alert("Exchange accepted.");
  };

  const deleteExchange = (id) => {
    if (!window.confirm("Delete this exchange request?")) return;
    setExchanges((prev) => prev.filter((e) => e.id !== id));
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Offered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {exchanges.map((ex) => (
              <tr key={ex.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{ex.name}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {ex.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {ex.offeredItem}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {ex.requestedItem}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {ex.Category}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3 flex items-center">
                  <button
                    onClick={() => acceptExchange(ex.id)}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transition-all duration-150"
                    title="Accept Exchange"
                  >
                    ✅
                  </button>

                  <button
                    onClick={() => deleteExchange(ex.id)}
                    className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg transition-all duration-150"
                    title="Delete Exchange"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}

            {exchanges.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No exchange requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
