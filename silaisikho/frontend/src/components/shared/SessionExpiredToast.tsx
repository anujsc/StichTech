import { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

export function SessionExpiredToast() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const flag = localStorage.getItem('silaisikho-session-expired');
    if (flag === 'true') {
      // Clear the flag immediately so it doesn't show again
      localStorage.removeItem('silaisikho-session-expired');
      
      // Show the banner
      setShowBanner(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-3 px-4 text-sm flex items-center justify-center gap-2 animate-fade-in">
      <Clock size={16} className="shrink-0" />
      <span>
        Your session has expired. Please log in again — आपका session expire हो गया। कृपया दोबारा login करें
      </span>
      <button
        onClick={() => setShowBanner(false)}
        className="ml-2 text-white hover:text-white/80 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default SessionExpiredToast;
