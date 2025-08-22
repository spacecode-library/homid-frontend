import React, { useState, useEffect } from 'react';
import { X, Globe, Bookmark, Link2, ExternalLink, Building, MapPin, Phone, Mail, AlertCircle, ArrowRight, Image, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { favoritesService } from '../services/favorites';
import { useAuth } from '../hooks/useAuth';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

interface ProductPopupProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    formattedId: string;
    productName?: string;
    businessName?: string;
    ownerName?: string;
    targetUrl?: string;
    websiteIcon?: string;
    previewImage?: string;
    productImage?: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
    businessAddress?: string;
    found: boolean;
    isVerified?: boolean;
  };
  onConnect?: () => void;
  onSave?: () => void;
  loading?: boolean;
}

export const ProductPopup: React.FC<ProductPopupProps> = ({
  isOpen,
  onClose,
  product,
  onConnect,
  onSave,
  loading = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteCheckLoading, setFavoriteCheckLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess, showWarning } = useNotifications();
  const navigate = useNavigate();

  // Check if the product is already in favorites - non-blocking
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && product?.formattedId && isOpen) {
        setFavoriteCheckLoading(true);
        try {
          const response = await favoritesService.getFavorites();
          const favorites = response.data.favorites || [];
          const isFav = favorites.some(fav => fav.homId === product.formattedId);
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Failed to check favorite status:', error);
        } finally {
          setFavoriteCheckLoading(false);
        }
      }
    };

    if (isOpen) {
      setImageError(false); // Reset image error when popup opens
      setIsFavorite(false); // Reset favorite status
      checkFavoriteStatus(); // Non-blocking call
    }
  }, [isOpen, isAuthenticated, product?.formattedId]);

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      showWarning(
        'Login Required',
        'Please create an account or login to save favorites.',
        { duration: 4000 }
      );
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      const response = await favoritesService.addFavorite({ homId: product.formattedId });
      showSuccess(
        'Saved!',
        `${product.formattedId} has been saved to your favorites.`,
        { duration: 3000 }
      );
      setIsFavorite(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '';
      
      if (errorMessage.toLowerCase().includes('already in favorites')) {
        setIsFavorite(true);
        showWarning(
          'Already Saved',
          `${product.formattedId} is already in your favorites.`,
          { duration: 4000 }
        );
      } else {
        handleError(error, {
          customTitle: 'Failed to Save',
          customMessage: 'Unable to save this ID. Please try again.',
        });
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  // Handle not found state
  if (!product.found) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Not Found Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm w-full">
                {/* Header */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-center relative">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* ID Display */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg mb-2 shadow-sm">
                    <span className="text-blue-600 font-bold text-xs">.ID</span>
                    <span className="font-mono text-base font-bold text-gray-900">{product.formattedId}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500">Available for registration</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    This ID is Available!
                  </h2>

                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Register this ID to connect it to your website, product, or service.
                  </p>

                  {/* Benefits */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                        Easy to remember and share
                      </li>
                      <li className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                        Track clicks and analytics
                      </li>
                      <li className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                        Professional and branded
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => window.location.href = '/register'}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow hover:shadow-md"
                    >
                      Register This ID
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Search Another ID
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  const handleImageError = () => {
    setImageError(true);
  };

  // Determine which image to show
  const displayImage = product.previewImage || product.productImage;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Premium Header with Website Icon and Branding */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 shadow-sm">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    {/* Left side - Website icon and product info */}
                    <div className="flex items-center gap-4">
                      {/* Website Icon */}
                      <div className="relative">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                          {product.websiteIcon ? (
                            <img
                              src={product.websiteIcon}
                              alt=""
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (product.targetUrl) {
                                  try {
                                    const url = new URL(product.targetUrl);
                                    target.src = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
                                  } catch {
                                    target.style.display = 'none';
                                  }
                                } else {
                                  target.style.display = 'none';
                                }
                              }}
                            />
                          ) : (
                            <Globe className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                        {product.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" fill="white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Title and ID */}
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">
                          {product.productName || 'Connected Product'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-blue-600 font-bold text-xs">.ID</span>
                          <span className="font-mono text-sm font-semibold text-gray-700">{product.formattedId}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Close button */}
                    <button
                      onClick={onClose}
                      className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-all shadow-sm hover:shadow-md"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Product Image */}
              {displayImage && !imageError && (
                <div className="relative bg-gradient-to-b from-gray-100 to-gray-200">
                  <div className="relative">
                    <img
                      src={displayImage}
                      alt={product.productName || 'Product'}
                      className="w-full h-64 sm:h-80 object-contain bg-white"
                      onError={handleImageError}
                    />
                    {/* Premium gradient overlay at edges */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
                  </div>
                  {/* Favorite Button on Image */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToFavorites}
                    disabled={favoriteLoading || favoriteCheckLoading}
                    className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-lg transition-all ${
                      favoriteCheckLoading
                        ? 'bg-gray-200 animate-pulse'
                        : isFavorite 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                        : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl'
                    }`}
                    title={isFavorite ? 'Saved to favorites' : 'Save to favorites'}
                  >
                    {favoriteLoading || favoriteCheckLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    )}
                  </motion.button>
                </div>
              )}

              {/* Business Info Section (only if image is displayed) */}
              {displayImage && !imageError && product.businessName && (
                <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">{product.businessName}</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* If no image, show favorite button */}
                {(!displayImage || imageError) && (
                  <div className="flex justify-center pb-4 border-b border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToFavorites}
                      disabled={favoriteLoading || favoriteCheckLoading}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm ${
                        favoriteCheckLoading
                          ? 'bg-gray-200 animate-pulse border border-gray-300'
                          : isFavorite 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {favoriteLoading || favoriteCheckLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                          {isFavorite ? 'Saved' : 'Save to Favorites'}
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full" />
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                {(product.ownerName || product.contactEmail || product.contactPhone || product.businessAddress) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      {product.ownerName && (
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Owner</p>
                            <p className="text-sm font-semibold text-gray-900">{product.ownerName}</p>
                          </div>
                        </div>
                      )}

                      {product.contactEmail && (
                        <a href={`mailto:${product.contactEmail}`} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate">
                              {product.contactEmail}
                            </p>
                          </div>
                        </a>
                      )}

                      {product.contactPhone && (
                        <a href={`tel:${product.contactPhone}`} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                              {product.contactPhone}
                            </p>
                          </div>
                        </a>
                      )}

                      {product.businessAddress && (
                        <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Address</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {product.businessAddress}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Target URL */}
                {product.targetUrl && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full" />
                      <Link2 className="w-4 h-4" />
                      <span>Destination URL</span>
                    </div>
                    <a
                      href={product.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:text-blue-800 break-all flex items-center gap-2 group font-medium"
                    >
                      {product.targetUrl}
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                )}

                {/* Visit Button */}
                {product.targetUrl && onConnect && (
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onConnect}
                      disabled={loading}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ExternalLink className="w-5 h-5" />
                          Visit Website
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};