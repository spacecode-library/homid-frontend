import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Grid3X3 } from 'lucide-react';
import { Keypad } from '../../../components/keypad/Keypad';
import { ProductPopup } from '../../../components/ProductPopup';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
    setShowPopup(true);
  };

  const handleConnect = () => {
    if (searchResult?.targetUrl) {
      window.open(searchResult.targetUrl, '_blank');
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="opacity-0 pointer-events-none">
            {/* Placeholder for balance */}
          </div>
          
          <nav className="flex items-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
            >
              <Grid3X3 className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content - Keypad Full Screen */}
      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Keypad onSubmit={handleSearchResult} showHistory={false} />
        </motion.div>
      </main>

      {/* Product Popup */}
      <ProductPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        product={searchResult}
        onConnect={handleConnect}
      />
    </div>
  );
};