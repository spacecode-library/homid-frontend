import { motion } from 'framer-motion';
import { Keypad } from '../../components/keypad/Keypad';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Hash, ArrowRight } from 'lucide-react';

export const SearchPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.img
                whileHover={{ scale: 1.05 }}
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
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enter a Hom.ID
            </h1>
            <p className="text-lg text-gray-600">
              Type the 8-digit code to access the content
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Keypad showHistory={isAuthenticated} />
          </motion.div>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-600">
                Want to save your searches?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  Create an account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};