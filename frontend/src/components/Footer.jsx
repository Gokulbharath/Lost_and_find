import { Heart, Github, Mail, Shield } from 'lucide-react';

export default function Footer() {
  const patternBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.3
  };

  return (
    <footer className="porto-footer-section">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 border-2 border-white bg-white rounded-lg flex items-center justify-center shadow-[4px_4px_0_#111827]">
                <Shield className="w-6 h-6 text-[#111827]" />
              </div>
              <span className="text-xl font-black text-white">ReclaimIT</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed font-semibold">
              Your trusted campus hub for reuniting lost items with their owners. Making connections, one item at a time.
            </p>
          </div>
          
          <div>
            <h3 className="font-black mb-4 text-lg text-white">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <a href="#" className="porto-footer-link text-sm">About Us</a>
              <a href="#" className="porto-footer-link text-sm">Contact</a>
              <a href="#" className="porto-footer-link text-sm">Privacy Policy</a>
              <a href="#" className="porto-footer-link text-sm">Terms of Service</a>
            </div>
          </div>
          
          <div>
            <h3 className="font-black mb-4 text-lg text-white">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border-2 border-white bg-white rounded-lg flex items-center justify-center shadow-[4px_4px_0_#111827] hover:translate-[-2px,-2px] hover:shadow-[6px_6px_0_#111827] transition-all duration-150">
                <Github className="w-5 h-5 text-[#111827]" />
              </a>
              <a href="#" className="w-10 h-10 border-2 border-white bg-white rounded-lg flex items-center justify-center shadow-[4px_4px_0_#111827] hover:translate-[-2px,-2px] hover:shadow-[6px_6px_0_#111827] transition-all duration-150">
                <Mail className="w-5 h-5 text-[#111827]" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>by Gokul Bharath</span>
            </div>
            <div className="text-white/80 text-sm font-semibold">
              © 2025 ReclaimIT. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


