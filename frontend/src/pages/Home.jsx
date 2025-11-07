import { useEffect, useState } from 'react';
import { Upload, Bell, CheckCircle, Plus, PackageSearch, Sparkles, ArrowRight, TrendingUp, Users, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../api/api';
import { useAuth } from '../contexts/useAuth';
import { ItemCard } from '../components/ItemCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLost: 0, totalFound: 0, totalReturned: 0 });
  const [userCounts, setUserCounts] = useState({ lost: 0, found: 0 });

  // Scroll animation refs
  const [heroRef, heroVisible] = useScrollAnimation({ threshold: 0.2 });
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.3 });
  const [itemsRef, itemsVisible] = useScrollAnimation({ threshold: 0.2 });
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserCounts = async () => {
      try {
        const response = await itemsAPI.getCounts();
        setUserCounts(response.data.data);
      } catch (error) {
        console.error('Error loading user counts:', error);
      }
    };
    fetchUserCounts();
  }, [user]);

  const loadData = async () => {
    try {
      const [recentRes, statsRes] = await Promise.all([itemsAPI.recent(), itemsAPI.stats()]);
      setLostItems(recentRes.data.data.items.filter((item) => item.type === 'lost'));
      setFoundItems(recentRes.data.data.items.filter((item) => item.type === 'found'));
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const allItems = [
    ...lostItems.map((item) => ({ ...item, type: 'lost' })),
    ...foundItems.map((item) => ({ ...item, type: 'found' })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen porto-bg relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section Porto Style */}
      <section 
        ref={heroRef}
        className={`porto-hero transition-all duration-1000 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container relative z-10 px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className={`inline-block mb-8 px-6 py-3 border-2 border-[#111827] bg-white rounded-full shadow-[4px_4px_0_#111827] transform transition-all duration-700 ${
              heroVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}>
              <div className="flex items-center gap-2 text-[#111827]">
                <Sparkles className="w-5 h-5" />
                <span className="font-black">Finders Keepers. Together.</span>
              </div>
            </div>

            <h1 className={`porto-hero-title transform transition-all duration-1000 delay-200 ${
              heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              Lost Something?
              <br />
              <span style={{ color: '#4f46e5' }}>We'll Help You Find It</span>
            </h1>

            <p className={`porto-hero-subtitle transform transition-all duration-1000 delay-300 ${
              heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              Your campus hub for seamless item reuniting. Connect with the community and make someone's day.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transform transition-all duration-1000 delay-500 ${
              heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {user ? (
                <>
                  <Link to="/report-lost" className="porto-hero-btn flex items-center gap-3">
                    <Plus className="w-5 h-5" />
                    <span>Report Lost Item</span>
                  </Link>
                  <Link to="/report-found" className="porto-hero-btn flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>Report Found Item</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="porto-hero-btn flex items-center gap-3">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="porto-btn porto-btn-primary">
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* User's Personal Stats */}
            {user && (
              <div className={`max-w-2xl mx-auto mb-12 transform transition-all duration-1000 delay-700 ${
                heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <h3 className="text-3xl font-black text-[#111827] mb-8 text-center flex items-center justify-center gap-2">
                  <Heart className="w-7 h-7" />
                  My Activity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="porto-stat-card">
                    <div className="porto-stat-number">{userCounts.lost}</div>
                    <div className="porto-stat-label">My Lost Items</div>
                  </div>
                  <div className="porto-stat-card">
                    <div className="porto-stat-number">{userCounts.found}</div>
                    <div className="porto-stat-label">My Found Items</div>
                  </div>
                </div>
                <div className="text-center">
                  <Link to="/my-reports" className="porto-btn porto-btn-primary inline-flex items-center gap-2">
                    View My Reports
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Global Stats */}
            <div 
              ref={statsRef}
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto transform transition-all duration-1000 delay-300 ${
                statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
            >
              {[
                { icon: PackageSearch, label: 'Total Lost Items', value: stats.totalLost },
                { icon: CheckCircle, label: 'Total Found Items', value: stats.totalFound },
                { icon: TrendingUp, label: 'Successful Returns', value: stats.totalReturned },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className={`porto-stat-card transform transition-all duration-500 ${
                    statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[#111827] bg-white rounded-xl mb-4 shadow-[4px_4px_0_#111827]">
                    <stat.icon className="w-8 h-8 text-[#111827]" />
                  </div>
                  <div className="porto-stat-number">{stat.value}</div>
                  <div className="porto-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section 
        ref={itemsRef}
        className={`porto-section transform transition-all duration-1000 ${
          itemsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2 className="porto-section-title text-left">
                Latest Discoveries
              </h2>
              <p className="porto-section-subtitle text-left mb-0">Recently reported items from our community</p>
            </div>
            <Link 
              to="/search" 
              className="porto-btn porto-btn-primary flex items-center gap-2"
            >
              <PackageSearch className="w-5 h-5" />
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="porto-card h-80 animate-pulse">
                  <div className="h-48 bg-[#f3f4f6] rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-[#f3f4f6] rounded w-3/4"></div>
                    <div className="h-3 bg-[#f3f4f6] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : allItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allItems.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`transform transition-all duration-700 ${
                    itemsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <ItemCard 
                    item={item} 
                    type={item.type} 
                    onClick={() => navigate(`/item/${item.type}/${item.id}`)} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 porto-card">
              <PackageSearch className="w-20 h-20 text-[#6b7280] mx-auto mb-6" />
              <p className="text-xl text-[#111827] font-black">No items reported yet</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={howItWorksRef}
        className={`porto-section border-t-2 border-[#111827] transform transition-all duration-1000 ${
          howItWorksVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="porto-section-title">
              How It Works
            </h2>
            <p className="porto-section-subtitle">
              Simple steps to reunite lost items with their owners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Upload, 
                title: 'Report Lost Item', 
                desc: 'Post details about your lost item with a photo and description. The more details, the better!',
                delay: 0
              },
              { 
                icon: CheckCircle, 
                title: 'Someone Finds It', 
                desc: 'Community members report found items to the platform. Our matching system helps connect you.',
                delay: 200
              },
              { 
                icon: Bell, 
                title: 'Get Connected', 
                desc: 'Connect with finders through the platform to retrieve your item. Reunite and restore smiles!',
                delay: 400
              },
            ].map((step, idx) => (
              <div 
                key={idx}
                className={`group text-center transform transition-all duration-700 ${
                  howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${step.delay}ms` }}
              >
                <div className="relative mb-8">
                  <div className="w-28 h-28 border-2 border-[#111827] bg-white rounded-3xl flex items-center justify-center mx-auto shadow-[8px_8px_0_#111827] group-hover:translate-[-2px,-2px] group-hover:shadow-[10px_10px_0_#111827] transition-all duration-150">
                    <step.icon className="w-14 h-14 text-[#111827]" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 border-2 border-[#111827] bg-white rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#111827] group-hover:scale-110 transition-all duration-300">
                    <span className="text-[#111827] font-black text-xl">{idx + 1}</span>
                  </div>
                </div>
                <div className="porto-card">
                  <h3 className="text-2xl font-black text-[#111827] mb-4">{step.title}</h3>
                  <p className="porto-item-text">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


