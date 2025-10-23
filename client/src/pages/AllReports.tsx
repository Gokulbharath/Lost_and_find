import { useEffect, useState } from 'react';
import { LostItem, FoundItem } from '../lib/mockData';
import { itemsAPI } from '../api/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ItemCard } from '../components/ItemCard';

export default function AllReports() {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const [lostRes, foundRes] = await Promise.all([
        itemsAPI.listLost({ limit: 100 }),
        itemsAPI.listFound({ limit: 100 }),
      ]);
      setLostItems(lostRes.data.data.items);
      setFoundItems(foundRes.data.data.items);
      setLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">All Posted Items</h1>
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">Lost Items</h2>
              {lostItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostItems.map(item => (
                    <ItemCard key={item.id} item={item} type="lost" onClick={() => window.location.href = `/item/lost/${item.id}`} />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No lost items posted.</div>
              )}
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">Found Items</h2>
              {foundItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foundItems.map(item => (
                    <ItemCard key={item.id} item={item} type="found" onClick={() => window.location.href = `/item/found/${item.id}`} />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No found items posted.</div>
              )}
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
