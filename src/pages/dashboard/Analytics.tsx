import { useEffect, useState } from 'react';
import { BarChart3, Globe, Monitor, Calendar, TrendingUp, Users, Eye, MousePointer } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyticsService, type AnalyticsOverview, type RedirectAnalytics, type GeographicAnalytics } from '../../services/analytics';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNotifications } from '../../contexts/NotificationContext';

export const Analytics = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [redirects, setRedirects] = useState<RedirectAnalytics | null>(null);
  const [geographic, setGeographic] = useState<GeographicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  const { handleError } = useErrorHandler();
  const { showInfo } = useNotifications();

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [overviewRes, redirectsRes, geographicRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getRedirects(dateRange.startDate, dateRange.endDate),
        analyticsService.getGeographic(dateRange.startDate, dateRange.endDate)
      ]);

      setOverview(overviewRes.data);
      setRedirects(redirectsRes.data);
      setGeographic(geographicRes.data);

      if (overviewRes.data.totalRedirects === 0) {
        showInfo(
          'No Data Yet',
          'Start sharing your IDs to see analytics data here.',
          { duration: 4000 }
        );
      }
    } catch (error) {
      handleError(error, {
        customTitle: 'Failed to Load Analytics',
        customMessage: 'Unable to retrieve analytics data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-gray-700" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your Hom.ID performance and engagement
        </p>
      </motion.div>

      {/* Date Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Date Range:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{overview?.totalRedirects?.toLocaleString() || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Redirects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{overview?.uniqueVisitors?.toLocaleString() || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Unique Visitors</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{overview?.totalIds || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Total IDs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{overview?.activeIds || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Active IDs</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Redirect Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Redirect Trends
            </h3>
          </div>
          <div className="p-6">
            {redirects?.redirectsByDay && redirects.redirectsByDay.length > 0 ? (
              <div className="flex items-end justify-between h-48 gap-2">
                {redirects.redirectsByDay.slice(-7).map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-100 rounded-t relative flex-1 flex items-end">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600" 
                        style={{ 
                          height: `${Math.max((day.count / Math.max(...redirects.redirectsByDay.map(d => d.count))) * 100, 5)}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{day.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <TrendingUp className="w-12 h-12 mb-2" />
                <p>No redirect data available for the selected period</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              Top Countries
            </h3>
          </div>
          <div className="p-6">
            {geographic?.redirectsByCountry && geographic.redirectsByCountry.length > 0 ? (
              <div className="space-y-3">
                {geographic.redirectsByCountry.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{country.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-lg">
                      {country.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Globe className="w-12 h-12 mb-2" />
                <p>No geographic data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Performing IDs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Top Performing IDs
            </h3>
          </div>
          <div className="p-6">
            {redirects?.topIds && redirects.topIds.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Hom.ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Redirects</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redirects.topIds.slice(0, 5).map((id) => (
                      <tr key={id.homId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-medium text-gray-900">{id.homId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-700">{id.count}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${(id.count / Math.max(...redirects.topIds.map(i => i.count))) * 100}%` 
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <BarChart3 className="w-12 h-12 mb-2" />
                <p>No ID performance data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      {overview?.recentActivity && overview.recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-gray-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {overview.recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-gray-900">{activity.homId}</span>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">{activity.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};