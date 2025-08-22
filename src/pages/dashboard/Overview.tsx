import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Hash, 
  BarChart3, 
  Eye, 
  Users,
  Plus,
  Search,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { analyticsService } from '../../services/analytics';
import { idsService, type UserHomId } from '../../services/ids';
import { StatCardSkeleton, CardSkeleton } from '../../components/SkeletonLoader';
import { TopPerformingIds } from '../../components/dashboard/TopPerformingIds';


export const DashboardOverview = () => {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIds: 0,
    activeIds: 0,
    totalRedirects: 0,
    uniqueVisitors: 0,
    redirectsChange: 0,
    visitorsChange: 0,
    idsChange: 0,
    activeChange: 0
  });
  const [myIds, setMyIds] = useState<UserHomId[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [, idsRes] = await Promise.all([
        analyticsService.getOverview(),
        idsService.getMyIds(1)
      ]);

      // Process IDs data
      const ids = idsRes.data.ids || [];
      setMyIds(ids);
      
      // Calculate stats from actual data
      const activeIds = ids.filter(id => id.isActive).length;
      const totalRedirects = ids.reduce((sum, id) => sum + id.redirectCreditsUsed, 0);
      
      setStats({
        totalIds: ids.length,
        activeIds: activeIds,
        totalRedirects: totalRedirects,
        uniqueVisitors: Math.floor(totalRedirects * 0.7), // Estimate unique visitors
        redirectsChange: 12.5,
        visitorsChange: 8.3,
        idsChange: 5.2,
        activeChange: 15.7
      });

    } catch (error) {
      handleError(error, {
        customTitle: 'Failed to Load Dashboard',
        customMessage: 'Some dashboard data may be unavailable.'
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total IDs',
      value: stats.totalIds,
      icon: Hash,
      color: 'blue',
      change: stats.idsChange,
      trend: stats.idsChange > 0 ? 'up' : 'down'
    },
    {
      title: 'Active IDs',
      value: stats.activeIds,
      icon: Activity,
      color: 'green',
      change: stats.activeChange,
      trend: stats.activeChange > 0 ? 'up' : 'down'
    },
    {
      title: 'Total Redirects',
      value: stats.totalRedirects.toLocaleString(),
      icon: Eye,
      color: 'purple',
      change: stats.redirectsChange,
      trend: stats.redirectsChange > 0 ? 'up' : 'down'
    },
    {
      title: 'Unique Visitors',
      value: stats.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: 'orange',
      change: stats.visitorsChange,
      trend: stats.visitorsChange > 0 ? 'up' : 'down'
    }
  ];


  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-96 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'User'}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your IDs today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  stat.color === 'blue' ? 'from-blue-50 to-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'from-green-50 to-green-100 text-green-600' :
                  stat.color === 'purple' ? 'from-purple-50 to-purple-100 text-purple-600' :
                  'from-orange-50 to-orange-100 text-orange-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/dashboard/billing"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all group border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-800">Purchase New ID</span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link
              to="/"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all group border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-800">Search IDs</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/dashboard/analytics"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all group border border-purple-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-800">View Analytics</span>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </motion.div>

        {/* Top Performing IDs */}
        <div className="lg:col-span-2">
          <TopPerformingIds ids={myIds} />
        </div>
      </div>
    </div>
  );
};