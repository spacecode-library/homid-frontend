import { useState, useEffect } from 'react';
import { Hash, ExternalLink, BarChart3, Copy, Edit, MoreVertical, Globe, Shield, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserHomId } from '../../services/ids';
import { searchService } from '../../services/search';
import { idsService } from '../../services/ids';
import { useNotifications } from '../../contexts/NotificationContext';

interface IdCardProps {
  id: UserHomId;
  index: number;
  onEdit?: (id: UserHomId) => void;
  onClick?: (id: UserHomId) => void;
}

interface IdDetails {
  found: boolean;
  targetUrl?: string;
  ownerName?: string;
  isVerified?: boolean;
  websiteInfo?: {
    title: string;
    description: string;
    image: string;
    screenshot: string;
    favicon: string;
  };
}

export const IdCard: React.FC<IdCardProps> = ({ id, index, onEdit, onClick }) => {
  const { showSuccess } = useNotifications();
  const [details, setDetails] = useState<IdDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadIdDetails();
  }, [id.numericId]);

  const loadIdDetails = async () => {
    try {
      setLoading(true);
      // Search for ID details
      const searchResponse = await searchService.searchHomId(id.numericId);
      const searchData = searchResponse.data;
      
      if (searchData.found) {
        // Try to get website metadata using public endpoint
        try {
          const metadataResponse = await idsService.getPublicMetadata(id.numericId);
          setDetails({
            ...searchData,
            websiteInfo: metadataResponse.data.metadata
          });
        } catch (error: any) {
          // If metadata fails, use search data only
          console.log(`Failed to fetch metadata for ID ${id.numericId}:`, error.response?.status || error.message);
          setDetails(searchData);
        }
      } else {
        setDetails(searchData);
      }
    } catch (error) {
      console.error('Failed to load ID details:', error);
      setDetails({ found: false });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://hom.id/${id.formattedId}`);
    showSuccess(
      'ID Copied!',
      `${id.formattedId} has been copied to your clipboard.`,
      { duration: 2000 }
    );
  };

  const handleVisitUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (details?.targetUrl) {
      window.open(details.targetUrl, '_blank');
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const getStatusColor = () => {
    if (!id.isActive) return 'text-gray-500 bg-gray-100';
    if (id.usagePercentage > 80) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = () => {
    if (!id.isActive) return 'Inactive';
    if (id.usagePercentage > 80) return 'Low Credits';
    return 'Active';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyId}
              className="flex items-center gap-2 group"
              title="Click to copy"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Hash className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {id.formattedId}
                  </span>
                  <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${getStatusColor()}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  {getStatusText()}
                </div>
              </div>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Mapping
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // View analytics
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Website Preview */}
        {loading ? (
          <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ) : details?.found && details.targetUrl ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              {details.websiteInfo?.favicon ? (
                <img
                  src={details.websiteInfo.favicon}
                  alt="Website favicon"
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {details.websiteInfo?.title || 'Website'}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {details.targetUrl}
                </p>
                {details.isVerified && (
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Verified</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleVisitUrl}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Visit website"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">No mapping configured</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Redirects</div>
            <div className="text-sm font-semibold text-gray-900">
              {id.redirectCreditsUsed.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Credits Left</div>
            <div className="text-sm font-semibold text-gray-900">
              {id.redirectCreditsRemaining.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Usage</div>
            <div className="text-sm font-semibold text-gray-900">
              {id.usagePercentage}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                id.usagePercentage > 80
                  ? 'bg-orange-500'
                  : id.usagePercentage > 50
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${id.usagePercentage}%` }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires {id.expiryDate ? new Date(id.expiryDate).toLocaleDateString() : 'Never'}</span>
          </div>
          {id.redirectCreditsUsed > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 font-medium">Active</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};