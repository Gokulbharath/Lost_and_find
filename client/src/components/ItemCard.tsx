import { Calendar, MapPin, Tag } from 'lucide-react';
import { LostItem, FoundItem } from '../lib/mockData';

type ItemCardProps = {
  item: LostItem | FoundItem;
  type: 'lost' | 'found';
  onClick: () => void;
};

export function ItemCard({ item, type, onClick }: ItemCardProps) {
  const isLost = type === 'lost';
  const date = isLost ? (item as LostItem).lost_date : (item as FoundItem).found_date;
  const statusColor = isLost ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  const statusText = isLost ? 'Lost' : 'Found';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-2"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 overflow-hidden">
        {(item as any).image ? (
          <>
            <img
              src={(item as any).image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Tag className="w-16 h-16 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm ${statusColor} dark:${statusColor.replace('bg-', 'bg-').replace('-100', '-900/80').replace('-800', '-100')}`}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium">{item.category}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <MapPin className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <Calendar className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>

        <button className="mt-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md group-hover:shadow-lg transform group-hover:scale-[1.02]">
          View Details
        </button>
      </div>
    </div>
  );
}
