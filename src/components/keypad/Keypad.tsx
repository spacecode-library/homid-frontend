import React, { useState, useEffect } from 'react';
import { Search, Delete } from 'lucide-react';
import { searchService } from '../../services/search';
import { idsService } from '../../services/ids';
import { useAuth } from '../../hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNotifications } from '../../contexts/NotificationContext';
import { ErrorAlert } from '../ErrorAlert';
import { AnimatePresence, motion } from 'framer-motion';

interface KeypadProps {
  onSubmit?: (searchResult: any) => void;
  showHistory?: boolean;
  className?: string;
}

export const Keypad: React.FC<KeypadProps> = ({ onSubmit, showHistory = false, className = '' }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  searchResult; // Used for search history
  const [history, setHistory] = useState<any[]>([]);
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [error, setError] = useState<{ title?: string; message: string; type?: 'error' | 'warning' | 'info' } | null>(null);
  const { isAuthenticated } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useNotifications();

  useEffect(() => {
    if (showHistory && isAuthenticated) {
      loadSearchHistory();
    }
  }, [showHistory, isAuthenticated]);

  const loadSearchHistory = async () => {
    try {
      const response = await searchService.getSearchHistory(5);
      setHistory(response.data.history);
    } catch (error) {
      handleError(error, {
        customTitle: 'Failed to Load History',
        customMessage: 'Unable to retrieve your search history.',
      });
    }
  };

  const formatDisplay = (val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
  };

  const handleKeyPress = (key: string) => {
    if (value.replace(/\D/g, '').length < 8) {
      setValue(prev => prev + key);
      setIsPressed(key);
      setTimeout(() => setIsPressed(null), 150);
      
      // Vibrate on mobile if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const handleDelete = () => {
    setValue(prev => {
      const digits = prev.replace(/\D/g, '');
      return digits.slice(0, -1);
    });
    setIsPressed('delete');
    setTimeout(() => setIsPressed(null), 150);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleSearch = async () => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 8) {
      setError({
        title: 'Invalid ID Format',
        message: 'Please enter a complete 8-digit ID',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    setError(null);
    const formattedQuery = formatDisplay(value);

    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 10000)
      );
      
      const response = await Promise.race([
        searchService.searchHomId(formattedQuery),
        timeoutPromise
      ]) as any;
      
      if (response.data.found) {
        // Try to fetch website metadata using the public endpoint
        let enrichedData = { ...response.data };
        if (response.data.id) {
          try {
            const metadataResponse = await idsService.getPublicMetadata(response.data.id);
            if (metadataResponse.data.metadata) {
              enrichedData = {
                ...response.data,
                websiteIcon: metadataResponse.data.metadata.favicon,
                previewImage: metadataResponse.data.metadata.image || metadataResponse.data.metadata.screenshot,
                description: metadataResponse.data.metadata.description,
                productName: metadataResponse.data.metadata.title || response.data.productName
              };
            }
          } catch (error) {
            // If metadata fetch fails, continue with basic data
            console.log('Failed to fetch metadata:', error);
          }
        }
        
        setSearchResult(enrichedData);
        
        if (onSubmit) {
          onSubmit(enrichedData);
        } else if (response.data.targetUrl) {
          showSuccess(
            'ID Found!',
            `Redirecting to ${(response.data as any).productName || 'destination'}...`,
            { duration: 2000 }
          );
          setTimeout(() => {
            window.location.href = response.data.targetUrl!;
          }, 1000);
        } else {
          setError({
            title: 'ID Found - No Destination',
            message: 'This ID exists but has no destination URL set.',
            type: 'info'
          });
        }
      } else {
        if (onSubmit) {
          onSubmit(response.data);
        } else {
          setError({
            title: 'ID Not Found',
            message: `The ID "${formattedQuery}" hasn't been registered yet.`,
            type: 'info'
          });
        }
        setSearchResult(null);
      }

      if (isAuthenticated && showHistory) {
        loadSearchHistory();
      }
    } catch (error: any) {
      if (error.message === 'timeout') {
        setError({
          title: 'Search Timeout',
          message: 'The search is taking longer than expected. Please try again.',
          type: 'warning'
        });
      } else {
        setError({
          title: 'Search Failed',
          message: 'Unable to search for the ID. Please check your connection and try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [value]);

  const keys = [
    [
      { number: '1', letters: '' },
      { number: '2', letters: 'ABC' },
      { number: '3', letters: 'DEF' }
    ],
    [
      { number: '4', letters: 'GHI' },
      { number: '5', letters: 'JKL' },
      { number: '6', letters: 'MNO' }
    ],
    [
      { number: '7', letters: 'PQRS' },
      { number: '8', letters: 'TUV' },
      { number: '9', letters: 'WXYZ' }
    ],
    [
      { number: '', letters: '' },
      { number: '0', letters: '' },
      { number: 'delete', letters: '' }
    ]
  ];

  return (
    <div className={`w-full max-w-md mx-auto px-4 flex flex-col justify-center ${className}`}>
      {/* Premium Display Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <div className="text-center mb-6 md:mb-8">
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-3 md:mb-4"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-blue-900">Hom</span>
              <span className="text-blue-400">.</span>
              <span className="text-blue-900">ID</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">The Homepage Connector</p>
          </motion.div>
          
          {/* ID Display */}
          <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20 rounded-2xl pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold text-base sm:text-lg md:text-xl mr-2 md:mr-3">.ID</span>
                <div className="font-mono text-2xl sm:text-3xl md:text-5xl font-bold tracking-widest">
                  {(() => {
                    const digits = value.replace(/\D/g, '');
                    const display = [];
                    
                    // First 4 digits
                    for (let i = 0; i < 4; i++) {
                      if (i < digits.length) {
                        display.push(
                          <span key={`d1-${i}`} className="text-gray-900">
                            {digits[i]}
                          </span>
                        );
                      } else {
                        display.push(
                          <span key={`p1-${i}`} className="text-gray-300">
                            0
                          </span>
                        );
                      }
                    }
                    
                    // Hyphen
                    display.push(
                      <span key="hyphen" className="text-gray-300 mx-1">
                        -
                      </span>
                    );
                    
                    // Last 4 digits
                    for (let i = 4; i < 8; i++) {
                      if (i < digits.length) {
                        display.push(
                          <span key={`d2-${i}`} className="text-gray-900">
                            {digits[i]}
                          </span>
                        );
                      } else {
                        display.push(
                          <span key={`p2-${i}`} className="text-gray-300">
                            0
                          </span>
                        );
                      }
                    }
                    
                    return display;
                  })()}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto mt-4 md:mt-6">
                <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: value ? `${(value.replace(/\D/g, '').length / 8) * 100}%` : '0%' }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {value.replace(/\D/g, '').length} of 8 digits entered
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4"
            >
              <ErrorAlert
                title={error.title}
                message={error.message}
                type={error.type}
                onClose={() => setError(null)}
                autoClose={error.type !== 'error'}
                duration={error.type === 'error' ? 0 : 5000}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Keypad Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6 md:mb-8"
      >
          
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xs mx-auto w-full relative">
        {keys.map((row, rowIndex) => (
          row.map((key, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              whileHover={key.number && !loading ? { scale: 1.02 } : {}}
              whileTap={key.number && !loading ? { scale: 0.98 } : {}}
              onClick={() => {
                if (key.number === 'delete') {
                  handleDelete();
                } else if (key.number) {
                  handleKeyPress(key.number);
                }
              }}
              className={`
                relative h-14 sm:h-16 md:h-20 rounded-2xl font-medium transition-all duration-150
                ${key.number === '' ? 'invisible' : ''}
                ${key.number === 'delete' 
                  ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 active:bg-red-200 flex items-center justify-center shadow-sm hover:shadow-md' 
                  : key.number ? 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 shadow-sm hover:shadow-md text-gray-800' : ''
                }
                ${isPressed === key.number ? 'transform scale-95 shadow-inner ring-4 ring-blue-500/60' : ''}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                group overflow-hidden
              `}
              disabled={key.number === '' || loading}
              aria-label={key.number === 'delete' ? 'Delete' : key.number}
              tabIndex={key.number ? 0 : -1}
            >
              {key.number === 'delete' ? (
                <Delete className="w-5 md:w-6 h-5 md:h-6 relative z-10" />
              ) : key.number ? (
                <div className="flex flex-col items-center justify-center relative z-10">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold leading-none">{key.number}</span>
                  {key.letters && (
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-500 mt-0.5 tracking-wider">{key.letters}</span>
                  )}
                </div>
              ) : null}
              
              {/* Click Effect */}
              {isPressed === key.number && key.number && (
                <motion.div
                  className="absolute inset-0 bg-blue-400/20 rounded-2xl"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))
        ))}
          </div>
      </motion.div>

      {/* Premium Search Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <button
          onClick={handleSearch}
          disabled={value.replace(/\D/g, '').length !== 8 || loading}
          className={`
            w-full max-w-xs mx-auto flex items-center justify-center gap-2
            px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-sm md:text-base
            transition-all duration-200 transform
            ${value.replace(/\D/g, '').length === 8 && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Search ID"
        >
          {loading ? (
            <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-3.5 md:w-4 h-3.5 md:h-4" />
              <span>Search ID</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Search History (Premium Style) */}
      {showHistory && isAuthenticated && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Recent Searches</h3>
          <div className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setValue(item.searchQuery.replace(/-/g, ''));
                  handleSearch();
                }}
                className="w-full p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">#</span>
                  </div>
                  <span className="font-mono text-lg text-gray-700">{formatDisplay(item.searchQuery)}</span>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  item.found 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.found ? 'Found' : 'Not found'}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};