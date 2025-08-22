import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '../../contexts/NotificationContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification.persistent && notification.duration && notification.duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - (100 / (notification.duration! / 100));
        });
      }, 100);

      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [notification, removeNotification]);

  const handleClose = () => {
    removeNotification(notification.id);
  };

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      handleClose();
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-600 bg-green-100',
          text: 'text-green-900',
          message: 'text-green-700',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600 bg-red-100',
          text: 'text-red-900',
          message: 'text-red-700',
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600 bg-yellow-100',
          text: 'text-yellow-900',
          message: 'text-yellow-700',
          progress: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600 bg-blue-100',
          text: 'text-blue-900',
          message: 'text-blue-700',
          progress: 'bg-blue-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative w-full max-w-md rounded-lg shadow-lg border ${styles.bg} overflow-hidden`}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${styles.icon} flex items-center justify-center`}>
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${styles.text}`}>
              {notification.title}
            </p>
            {notification.message && (
              <p className={`mt-1 text-sm ${styles.message}`}>
                {notification.message}
              </p>
            )}
            {notification.action && (
              <button
                onClick={handleAction}
                className={`mt-2 text-sm font-medium ${styles.text} hover:underline focus:outline-none`}
              >
                {notification.action.label}
              </button>
            )}
          </div>

          <button
            onClick={handleClose}
            className={`flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.text}`}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar for timed notifications */}
      <AnimatePresence>
        {!notification.persistent && notification.duration && notification.duration > 0 && (
          <motion.div
            initial={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
          >
            <motion.div
              className={`h-full ${styles.progress} origin-left`}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};