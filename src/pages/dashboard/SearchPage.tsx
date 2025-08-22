import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { SearchWithHistory } from '../../components/dashboard/SearchWithHistory';

export const DashboardSearchPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Search className="w-8 h-8 text-gray-700" />
          Search Hom.IDs
        </h1>
        <p className="text-gray-600">
          Find and save Hom.IDs to your collection
        </p>
      </motion.div>
      
      <SearchWithHistory />
    </div>
  );
};