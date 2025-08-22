import React, { useState, useEffect } from 'react';
import { Heart, Folder, X, ExternalLink, Calendar, User } from 'lucide-react';
import { favoritesService, type Favorite } from '../../services/favorites';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export const FavoritesManager: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();
  const { showSuccess } = useNotifications();

  useEffect(() => {
    loadFavorites();
    loadFolders();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await favoritesService.getFavorites();
      console.log('Favorites response:', response);
      setFavorites(response.data.favorites || []);
    } catch (error: any) {
      console.error('Failed to load favorites:', error);
      handleError(error, {
        customTitle: 'Failed to Load Favorites',
        customMessage: 'Unable to retrieve your favorites. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await favoritesService.getFavoriteFolders();
      console.log('Folders response:', response);
      // Backend returns { data: { folders: [{ name: string, count: number }] } }
      const folderNames = response.data.folders.map((f: any) => typeof f === 'string' ? f : f.name);
      setFolders(['All', ...folderNames]);
    } catch (error: any) {
      console.error('Failed to load folders:', error);
      handleError(error, {
        customTitle: 'Failed to Load Folders',
        customMessage: 'Unable to retrieve your folders. Using default view.',
      });
      setFolders(['All']); // Set default folder at least
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await favoritesService.removeFavorite(favoriteId);
      showSuccess(
        'Favorite Removed',
        'The item has been successfully removed from your favorites.',
        { duration: 3000 }
      );
      loadFavorites(); // Reload the list
    } catch (error: any) {
      handleError(error, {
        customTitle: 'Failed to Remove Favorite',
        customMessage: 'Unable to remove the item from your favorites. Please try again.',
      });
    }
  };

  const filteredFavorites = selectedFolder === 'All' 
    ? favorites 
    : favorites.filter((fav) => fav.folderName === selectedFolder);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-red-500" />
          My Favorites
        </h1>
        <p className="text-gray-600">Manage your saved Hom.IDs</p>
      </motion.div>

      {/* Folder Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Folder className="w-4 h-4 text-gray-500" />
            Filter by Folder:
          </label>
          <select 
            value={selectedFolder} 
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Favorites List */}
      <AnimatePresence mode="wait">
        {filteredFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600">
              {selectedFolder === 'All' 
                ? 'Start adding IDs to your favorites collection.' 
                : `No favorites in the "${selectedFolder}" folder.`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFavorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-mono font-bold text-gray-900">
                      {favorite.homId}
                    </h3>
                    {favorite.homIdData?.activeMapping && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        Active
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Remove from favorites"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                
                {favorite.homIdData && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        {favorite.homIdData.owner.firstName} {favorite.homIdData.owner.lastName}
                      </span>
                    </div>
                    
                    {favorite.homIdData.activeMapping && (
                      <a 
                        href={favorite.homIdData.activeMapping.primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="truncate group-hover:underline">
                          {favorite.homIdData.activeMapping.primaryUrl}
                        </span>
                      </a>
                    )}
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Folder className="w-3 h-3" />
                    {favorite.folderName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(favorite.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};