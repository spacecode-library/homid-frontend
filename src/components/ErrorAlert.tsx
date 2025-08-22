import React from 'react';
import { AlertCircle, X, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorAlertProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  type = 'error',
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200',
          iconBg: 'bg-amber-100',
          icon: 'text-amber-600',
          title: 'text-amber-900',
          message: 'text-amber-700',
          IconComponent: AlertCircle
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
          iconBg: 'bg-blue-100',
          icon: 'text-blue-600',
          title: 'text-blue-900',
          message: 'text-blue-700',
          IconComponent: Info
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          iconBg: 'bg-green-100',
          icon: 'text-green-600',
          title: 'text-green-900',
          message: 'text-green-700',
          IconComponent: CheckCircle
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200',
          iconBg: 'bg-red-100',
          icon: 'text-red-600',
          title: 'text-red-900',
          message: 'text-red-700',
          IconComponent: AlertCircle
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`${styles.bg} border rounded-2xl p-4 shadow-lg backdrop-blur-sm`}
        >
          <div className="flex items-start gap-4">
            <div className={`${styles.iconBg} ${styles.icon} rounded-xl p-2 flex-shrink-0`}>
              <styles.IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1">
              {title && (
                <h3 className={`${styles.title} font-semibold mb-0.5 text-sm`}>{title}</h3>
              )}
              <p className={`${styles.message} text-sm leading-relaxed`}>{message}</p>
            </div>
            {onClose && (
              <button
                onClick={() => {
                  setVisible(false);
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Progress bar for auto-close */}
          {autoClose && duration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{ 
                color: styles.icon.replace('text-', '').replace('-600', '') 
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};