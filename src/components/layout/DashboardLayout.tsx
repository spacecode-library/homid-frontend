import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Hash,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  CreditCard,
  HelpCircle,
  Search,
  Heart,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService } from '../../services/search';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNotifications } from '../../contexts/NotificationContext';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { showSuccess, showWarning, showError } = useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = async () => {
    const digitsOnly = searchQuery.replace(/\D/g, '');
    
    if (digitsOnly.length !== 8) {
      showError(
        'Invalid ID Format',
        `Please enter a complete 8-digit ID. You entered ${digitsOnly.length} digits.`
      );
      return;
    }
    
    setSearchLoading(true);
    
    try {
      const response = await searchService.searchHomId(digitsOnly);
      
      if (response.data.found) {
        showSuccess(
          'ID Found!',
          `Successfully found ID: ${searchQuery}`,
          { duration: 3000 }
        );
        // Navigate to search page with the result
        navigate('/dashboard/search', { state: { searchResult: response.data, query: searchQuery } });
      } else {
        showWarning(
          'ID Not Found',
          `The ID "${searchQuery}" was not found or is not active.`,
          { duration: 4000 }
        );
      }
    } catch (error: any) {
      handleError(error, {
        customTitle: 'Search Failed',
        customMessage: 'Unable to search for the ID. Please try again.',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'blue' },
    { path: '/dashboard/search', label: 'Search History', icon: Clock, color: 'gray' },
    { path: '/dashboard/favorites', label: 'Favorites', icon: Heart, color: 'red' },
    { path: '/dashboard/ids', label: 'My IDs', icon: Hash, color: 'purple' },
    { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, color: 'green' },
    { path: '/dashboard/billing', label: 'Billing', icon: CreditCard, color: 'yellow' },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'gray' },
    { path: '/dashboard/support', label: 'Support', icon: HelpCircle, color: 'blue' },
  ];

  const getIconColorClass = (color: string, isActive: boolean) => {
    if (isActive) return 'text-white';
    switch (color) {
      case 'blue': return 'text-blue-600 group-hover:text-blue-700';
      case 'red': return 'text-red-600 group-hover:text-red-700';
      case 'purple': return 'text-purple-600 group-hover:text-purple-700';
      case 'green': return 'text-green-600 group-hover:text-green-700';
      case 'yellow': return 'text-yellow-600 group-hover:text-yellow-700';
      default: return 'text-gray-600 group-hover:text-gray-700';
    }
  };

  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-700';
      case 'red': return 'bg-red-600 hover:bg-red-700';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      case 'green': return 'bg-green-600 hover:bg-green-700';
      case 'yellow': return 'bg-yellow-600 hover:bg-yellow-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/ID.svg" 
                alt="Hom.ID Logo" 
                className="w-12 h-12"
              />
              <span className="text-2xl font-bold">
                <span className="text-blue-900">Hom</span>
                <span className="text-blue-400">.</span>
                <span className="text-blue-900">ID</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive 
                      ? `text-white ${getBgColorClass(item.color)} shadow-lg` 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${getIconColorClass(item.color, isActive)}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Account Type</span>
                <span className="font-medium text-gray-700 capitalize">
                  {user?.userType?.toLowerCase() || 'User'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                {sidebarOpen ? 
                  <X className="w-6 h-6 text-gray-600" /> : 
                  <Menu className="w-6 h-6 text-gray-600" />
                }
              </button>

              <div className="flex-1 flex items-center justify-end gap-4">
                {/* Search Bar */}
                <div className="flex items-center gap-2 max-w-md w-full">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        const formatted = e.target.value.replace(/\D/g, '').slice(0, 8);
                        if (formatted.length > 4) {
                          setSearchQuery(`${formatted.slice(0, 4)}-${formatted.slice(4)}`);
                        } else {
                          setSearchQuery(formatted);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      placeholder="Search Hom.ID (e.g., 1234-5678)"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      maxLength={9}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searchLoading || !searchQuery.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {searchLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Search
                  </button>
                </div>
                
                <Link to="/dashboard/billing">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4" />
                    Purchase ID
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};