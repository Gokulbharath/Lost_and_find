import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, PackageSearch } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ItemCard } from '../components/ItemCard';
import { itemsAPI } from '../api/api';
import { FormSelect } from '../components/FormInput';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Books', label: 'Books' },
  { value: 'ID Cards', label: 'ID Cards' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Others', label: 'Others' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'lost', label: 'Lost Items' },
  { value: 'found', label: 'Found Items' },
];

export default function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const [lostRes, foundRes] = await Promise.all([
        itemsAPI.listLost({ limit: 100 }),
        itemsAPI.listFound({ limit: 100 }),
      ]);
      setLostItems(lostRes.data.data.items);
      setFoundItems(foundRes.data.data.items);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = () => {
    let items = [];
    if (status === 'lost' || status === '') {
      items = [...items, ...lostItems.map((item) => ({ ...item, type: 'lost' }))];
    }
    if (status === 'found' || status === '') {
      items = [...items, ...foundItems.map((item) => ({ ...item, type: 'found' }))];
    }
    return items
      .filter((item) => {
        const matchesQuery =
          searchQuery === '' ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = category === '' || item.category === category;
        const matchesLocation = location === '' || item.location.toLowerCase().includes(location.toLowerCase());
        return matchesQuery && matchesCategory && matchesLocation;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const results = filteredItems();

  return (
    <div className="min-h-screen porto-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="porto-section-title text-left mb-4">Search Items</h1>
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden w-full mb-4 porto-btn porto-btn-primary flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <div className={`porto-card space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <h3 className="porto-title mb-4">Filters</h3>
              <FormSelect label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} />
              <FormSelect label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={categories} />
              <div>
                <label className="block text-sm font-black text-[#111827] mb-2">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Filter by location" className="porto-input" />
              </div>
              <button onClick={() => { setSearchQuery(''); setCategory(''); setStatus(''); setLocation(''); }} className="porto-btn w-full">
                Clear Filters
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4 text-sm text-[#6b7280] font-semibold">Found {results.length} item{results.length !== 1 ? 's' : ''}</div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="porto-card h-80 animate-pulse">
                    <div className="h-48 bg-[#f3f4f6] rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-[#f3f4f6] rounded w-3/4"></div>
                      <div className="h-3 bg-[#f3f4f6] rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <ItemCard key={`${item.type}-${item.id}`} item={item} type={item.type} onClick={() => navigate(`/item/${item.type}/${item.id}`)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 porto-card">
                <PackageSearch className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
                <p className="text-[#111827] text-lg font-black">No items found for your search</p>
                <p className="text-[#6b7280] text-sm mt-2 font-semibold">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


