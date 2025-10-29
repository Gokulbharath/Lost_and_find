import { useEffect, useState } from 'react';
import { Upload, Bell, CheckCircle, Plus, PackageSearch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LostItem, FoundItem } from '../lib/mockData';
import { itemsAPI } from '../api/api';
import { useAuth } from '../contexts/useAuth';
import { ItemCard } from '../components/ItemCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    totalReturned: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recentRes, statsRes] = await Promise.all([
        itemsAPI.recent(),
        itemsAPI.stats(),
      ]);
      setLostItems(recentRes.data.data.items.filter((item: any) => item.type === 'lost'));
      setFoundItems(recentRes.data.data.items.filter((item: any) => item.type === 'found'));
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const allItems = [
    ...lostItems.map(item => ({ ...item, type: 'lost' as const })),
    ...foundItems.map(item => ({ ...item, type: 'found' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 py-24 overflow-hidden transition-colors duration-300">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200 dark:border-blue-800">✨ Campus Lost & Found Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Find What You <span className="text-gradient-primary">Lost</span>,<br />Return What You <span className="text-gradient-success">Found</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              A centralized campus platform to connect lost and found items instantly with your community
            </p>

            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <Link
                  to="/report-lost"
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-red-500/50"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Report Lost Item
                </Link>
                <Link
                  to="/report-found"
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-500/50"
                >
                  <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Report Found Item
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-10 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-red-100 dark:border-red-900/20 hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl font-extrabold bg-gradient-to-br from-red-600 to-red-700 bg-clip-text text-transparent">{stats.totalLost}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lost Items</div>
              </div>
              <div className="group bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-green-100 dark:border-green-900/20 hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl font-extrabold bg-gradient-to-br from-green-600 to-green-700 bg-clip-text text-transparent">{stats.totalFound}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Found Items</div>
              </div>
              <div className="group bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-blue-100 dark:border-blue-900/20 hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl font-extrabold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.totalReturned}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Successful Returns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Items</h2>
          <Link
            to="/search"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <PackageSearch className="w-4 h-4" />
            View All Items
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-md h-80 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : allItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item) => (
              <ItemCard
                key={`${item.type}-${item.id}`}
                item={item}
                type={item.type}
                onClick={() => navigate(`/item/${item.type}/${item.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <PackageSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No items reported yet</p>
          </div>
        )}
      </section>

      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to reunite lost items with their owners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-900">1</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Report a Lost Item
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Post details about your lost item with a photo and description to help others identify it
              </p>
            </div>
            <div className="group text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-900">2</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Someone Finds It
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Community members report found items to the platform, creating a match opportunity
              </p>
            </div>
            <div className="group text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Bell className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-900">3</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Get Connected
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Connect with finders through the platform to verify and retrieve your lost item
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
