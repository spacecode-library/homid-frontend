import { FavoritesManager } from '../../components/dashboard/FavoritesManager';
import { motion } from 'framer-motion';

export const FavoritesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <FavoritesManager />
    </motion.div>
  );
};