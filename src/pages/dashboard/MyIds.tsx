import { useState, useEffect } from 'react';
import { Hash, Plus, Search, Filter, TrendingUp, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../contexts/NotificationContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { idsService, type UserHomId } from '../../services/ids';
import { motion } from 'framer-motion';
import { IdCard } from '../../components/dashboard/IdCard';
import { useNavigate } from 'react-router-dom';

export const MyIds = () => {
  const { user } = useAuth();
  const { showInfo } = useNotifications();
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [myIds, setMyIds] = useState<UserHomId[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    loadMyIds();
  }, []);

  const loadMyIds = async () => {
    try {
      setLoading(true);
      const response = await idsService.getMyIds(pagination.page, pagination.limit);
      setMyIds(response.data.ids);
      setPagination(response.data.pagination);
    } catch (error) {
      handleError(error, {
        customTitle: 'Failed to Load IDs',
        customMessage: 'Unable to retrieve your Hom.IDs. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateId = () => {
    navigate('/dashboard/billing');
  };

  const handleEditId = (_id: UserHomId) => {
    showInfo(
      'Feature Coming Soon',
      'ID editing will be available soon.',
      { duration: 4000 }
    );
  };

  const handleIdClick = (id: UserHomId) => {
    // Navigate to ID details page when implemented
    showInfo(
      'ID Details',
      `Details for ${id.formattedId} will be shown here.`,
      { duration: 3000 }
    );
  };

  const filteredIds = myIds.filter(id => {
    const matchesSearch = id.formattedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         id.numericId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && id.isActive) ||
                         (filterStatus === 'inactive' && !id.isActive);
    return matchesSearch && matchesFilter;
  });

  const totalIds = myIds.length;
  const activeIds = myIds.filter(id => id.isActive).length;
  const totalRedirects = myIds.reduce((sum, id) => sum + id.redirectCreditsUsed, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your IDs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Hash className="w-6 h-6 text-blue-600" />
              </div>
              My IDs
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor your Hom.ID digital identities
            </p>
          </div>
          <button
            onClick={handleCreateId}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Purchase New ID
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All IDs</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Hash className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalIds}</p>
            <p className="text-gray-600 text-sm mt-1">Total IDs Owned</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {activeIds > 0 ? `${Math.round((activeIds / totalIds) * 100)}%` : '0%'}
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{activeIds}</p>
            <p className="text-gray-600 text-sm mt-1">Active IDs</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalRedirects.toLocaleString()}</p>
            <p className="text-gray-600 text-sm mt-1">Total Redirects</p>
          </div>
        </motion.div>
      </div>

      {/* IDs Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {filteredIds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIds.map((id, index) => (
              <IdCard
                key={id.numericId}
                id={id}
                index={index}
                onEdit={handleEditId}
                onClick={handleIdClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Hash className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No IDs Found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters to find your IDs'
                : 'Start your Hom.ID journey by purchasing your first digital identity'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={handleCreateId}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Purchase Your First ID
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Usage Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200"
      >
        <div className="max-w-3xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            Account Overview
          </h3>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-gray-600 text-sm">Total IDs Owned</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">{totalIds}</span>
                  <span className="text-sm text-gray-500">/ {user?.userType === 'id_buyer' ? 'Unlimited' : '10'}</span>
                </div>
              </div>
              {user?.userType !== 'id_buyer' && (
                <div className="w-48">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalIds / 10) * 100, 100)}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{Math.round((totalIds / 10) * 100)}% used</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
              {user?.userType === 'id_buyer' 
                ? '✨ Premium member with unlimited ID purchases and advanced features.'
                : '💡 Upgrade to premium for unlimited ID purchases and exclusive benefits.'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};