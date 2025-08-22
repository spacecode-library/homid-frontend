import React, { useState, useEffect } from 'react';
import { Search, Clock, Star, ExternalLink, Shield, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService, type SearchHistoryItem } from '../../services/search';
import { favoritesService } from '../../services/favorites';
import { useAuth } from '../../hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLocation } from 'react-router-dom';

export const SearchWithHistory: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess, showWarning, showError } = useNotifications();
  const location = useLocation();

  // Load search history for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      loadSearchHistory();
    }
  }, [isAuthenticated]);

  // Check if there's a search result passed from navbar
  useEffect(() => {
    if (location.state?.searchResult && location.state?.query) {
      setResult(location.state.searchResult);
      setQuery(location.state.query);
      // Clear the state to prevent showing the same result on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadSearchHistory = async () => {
    try {
      const response = await searchService.getSearchHistory(10);
      console.log('Search history response:', response);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const formatId = (id: string): string => {
    // Remove all non-digit characters
    const digits = id.replace(/\D/g, '');
    
    // If less than or equal to 4 digits, just return them
    if (digits.length <= 4) return digits;
    
    // If more than 8 digits, truncate to 8
    const truncated = digits.slice(0, 8);
    
    // Format as XXXX-XXXX
    if (truncated.length > 4) {
      return `${truncated.slice(0, 4)}-${truncated.slice(4)}`;
    }
    
    return truncated;
  };

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    
    if (!queryToSearch.trim()) {
      showError('Empty Query', 'Please enter a Hom.ID to search');
      return;
    }
    
    // Format the query and validate
    const formattedQuery = formatId(queryToSearch);
    const digitsOnly = formattedQuery.replace(/\D/g, '');
    
    if (digitsOnly.length !== 8) {
      showError(
        'Invalid ID Format',
        `Please enter a complete 8-digit ID. You entered ${digitsOnly.length} digits.`
      );
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      // Use the numeric ID for the API call
      const response = await searchService.searchHomId(digitsOnly);
      setResult(response.data);
      
      // Show appropriate message based on result
      if (response.data.found) {
        showSuccess(
          'ID Found!',
          `Successfully found ID: ${formattedQuery}`,
          { duration: 3000 }
        );
      } else {
        showWarning(
          'ID Not Found',
          `The ID "${formattedQuery}" was not found or is not active.`,
          { duration: 4000 }
        );
      }
      
      // Reload history if user is authenticated
      if (isAuthenticated) {
        loadSearchHistory();
      }
    } catch (error: any) {
      handleError(error, {
        customTitle: 'Search Failed',
        customMessage: 'Unable to search for the ID. Please try again.',
      });
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (homId: string) => {
    if (!isAuthenticated) {
      showWarning(
        'Login Required',
        'Please login to save favorites.',
        { duration: 4000 }
      );
      return;
    }

    try {
      console.log('Adding favorite:', homId);
      const response = await favoritesService.addFavorite({ homId });
      console.log('Add favorite response:', response);
      showSuccess(
        'Added to Favorites!',
        `${homId} has been successfully added to your favorites.`,
        { duration: 3000 }
      );
    } catch (error: any) {
      console.error('Failed to add favorite:', error);
      
      // Check for specific error messages
      const errorMessage = error.response?.data?.message || error.message || '';
      
      if (errorMessage.toLowerCase().includes('already in favorites')) {
        showWarning(
          'Already in Favorites',
          `${homId} is already in your favorites list.`,
          { duration: 4000 }
        );
      } else {
        handleError(error, {
          customTitle: 'Failed to Add Favorite',
          customMessage: 'Unable to add the ID to your favorites. Please try again.',
        });
      }
    }
  };

  const handleHistoryItemClick = (item: SearchHistoryItem) => {
    setQuery(item.query);
    handleSearch(item.query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatId(e.target.value);
    setQuery(formatted);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-gray-600" />
          Search History
        </h2>

        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter Hom.ID (e.g., 1234-5678)"
              maxLength={9}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {query.replace(/\D/g, '').length}/8
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search
              </>
            )}
          </motion.button>
        </div>

        {/* Search Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              {result.found ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-green-900">
                          ID Found: {result.formattedId || formatId(result.id || '')}
                        </h3>
                        {result.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            <Shield className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      {result.ownerName && (
                        <p className="text-gray-700">
                          <span className="font-medium">Owner:</span> {result.ownerName}
                        </p>
                      )}
                      
                      {result.targetUrl && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Redirects to:</span>
                          <a
                            href={result.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {new URL(result.targetUrl).hostname}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {isAuthenticated && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToFavorites(result.formattedId || result.id)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Star className="w-4 h-4 text-yellow-500" />
                        Save to Favorites
                      </motion.button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    ID Not Found
                  </h3>
                  <p className="text-yellow-700">
                    The ID "{result.searchQuery || query}" was not found or is not currently active.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search History */}
      {isAuthenticated && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Recent Searches
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {history.slice(0, 10).map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleHistoryItemClick(item)}
                className="w-full px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
              >
                <div className="text-left">
                  <span className="font-mono font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.query}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.searchedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {item.found ? (
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                      ✓ Found
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Not found
                    </span>
                  )}
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
          
          {history.length > 10 && (
            <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-600">
              Showing 10 most recent searches
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};