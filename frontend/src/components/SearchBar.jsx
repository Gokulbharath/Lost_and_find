import { Search } from 'lucide-react';

export function SearchBar({ className = '', ...props }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-[#6b7280]" />
      </div>
      <input
        type="text"
        className="porto-input pl-12 pr-4"
        placeholder="Search for lost or found items..."
        {...props}
      />
    </div>
  );
}


