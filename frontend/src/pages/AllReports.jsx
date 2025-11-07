import { useEffect, useState } from 'react';
import { itemsAPI } from '../api/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ItemCard } from '../components/ItemCard';

export default function AllReports() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
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
    <div className="min-h-screen porto-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="porto-section-title text-left mb-8">All Posted Items</h1>
        {loading ? (
          <div className="text-center py-16 text-[#6b7280] font-semibold">Loading...</div>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-black mb-4 text-[#111827]">Lost Items</h2>
              {lostItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostItems.map((item) => (
                    <ItemCard key={item.id} item={item} type="lost" onClick={() => (window.location.href = `/item/lost/${item.id}`)} />
                  ))}
                </div>
              ) : (
                <div className="porto-card text-center py-8">
                  <p className="text-[#6b7280] font-semibold">No lost items posted.</p>
                </div>
              )}
            </section>
            <section>
              <h2 className="text-2xl font-black mb-4 text-[#111827]">Found Items</h2>
              {foundItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foundItems.map((item) => (
                    <ItemCard key={item.id} item={item} type="found" onClick={() => (window.location.href = `/item/found/${item.id}`)} />
                  ))}
                </div>
              ) : (
                <div className="porto-card text-center py-8">
                  <p className="text-[#6b7280] font-semibold">No found items posted.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}


