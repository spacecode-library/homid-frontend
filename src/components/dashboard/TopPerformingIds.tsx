import { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink, Globe, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserHomId } from '../../services/ids';
import { searchService } from '../../services/search';
import { idsService } from '../../services/ids';

interface TopPerformingIdsProps {
  ids: UserHomId[];
}

interface IdWithDetails extends UserHomId {
  details?: {
    targetUrl?: string;
    websiteInfo?: {
      title: string;
      favicon: string;
    };
  };
}

export const TopPerformingIds: React.FC<TopPerformingIdsProps> = ({ ids }) => {
  const [idsWithDetails, setIdsWithDetails] = useState<IdWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdDetails();
  }, [ids]);

  const loadIdDetails = async () => {
    try {
      setLoading(true);
      const topIds = ids
        .filter(id => id.redirectCreditsUsed > 0)
        .sort((a, b) => b.redirectCreditsUsed - a.redirectCreditsUsed)
        .slice(0, 5);

      const detailsPromises = topIds.map(async (id) => {
        try {
          const searchResponse = await searchService.searchHomId(id.numericId);
          const details: any = { ...searchResponse.data };
          
          if (details.found) {
            try {
              const metadataResponse = await idsService.getPublicMetadata(id.numericId);
              details.websiteInfo = metadataResponse.data.metadata;
            } catch {
              // Ignore metadata errors
            }
          }
          
          return { ...id, details };
        } catch {
          return { ...id };
        }
      });

      const results = await Promise.all(detailsPromises);
      setIdsWithDetails(results);
    } catch (error) {
      console.error('Failed to load ID details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Top Performing IDs
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (idsWithDetails.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Top Performing IDs
        </h2>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No performance data yet</p>
          <p className="text-sm text-gray-400 mt-1">Start sharing your IDs to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-600" />
        Top Performing IDs
      </h2>

      <div className="space-y-4">
        {idsWithDetails.map((id, index) => (
          <motion.div
            key={id.numericId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative"
          >
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {index + 1}
              </div>

              {/* ID and Website Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-gray-900">{id.formattedId}</span>
                  {id.details?.websiteInfo?.favicon ? (
                    <img
                      src={id.details.websiteInfo.favicon}
                      alt=""
                      className="w-4 h-4 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : id.details?.targetUrl ? (
                    <Globe className="w-4 h-4 text-gray-400" />
                  ) : null}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {id.details?.websiteInfo?.title || id.details?.targetUrl || 'No mapping'}
                  </span>
                  {id.details?.targetUrl && (
                    <a
                      href={id.details.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {id.redirectCreditsUsed.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">redirects</div>
              </div>

              {/* Usage Bar */}
              <div className="w-24">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${id.usagePercentage}%` }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">{id.usagePercentage}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-6 text-center">
        <a
          href="/dashboard/analytics"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
        >
          View detailed analytics
          <TrendingUp className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};