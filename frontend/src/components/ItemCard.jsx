import { Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';

export function ItemCard({ item, type, onClick }) {
  const isLost = type === 'lost';
  const date = isLost ? item.lost_date : item.found_date;
  const statusColor = isLost 
    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
  const statusText = isLost ? 'Lost' : 'Found';

  return (
    <div 
      onClick={onClick} 
      className="porto-item-card group"
    >
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
        {item.image_url || item.image ? (
          <img 
            src={item.image_url || item.image} 
            alt={item.title} 
            className="porto-item-image"
          />
        ) : (
          <div className="porto-item-image flex items-center justify-center bg-[#f3f4f6]">
            <Tag className="w-16 h-16 text-[#6b7280]" />
          </div>
        )}
        <div className="porto-item-badge" style={{ 
          background: isLost ? '#fee2e2' : '#d1fae5',
          color: isLost ? '#991b1b' : '#065f46'
        }}>
          {statusText}
        </div>
      </div>

      <div className="porto-item-content">
        <h3 className="porto-item-title truncate">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3 font-semibold">
          <Tag className="w-4 h-4" />
          <span>{item.category}</span>
        </div>

        <p className="porto-item-text mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>

        <button className="porto-btn porto-btn-primary w-full flex items-center justify-center gap-2">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


