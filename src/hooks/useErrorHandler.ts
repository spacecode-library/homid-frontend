import { useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatApiError, getErrorNotificationProps } from '../utils/errorHandling';

interface ErrorHandlerOptions {
  showNotification?: boolean;
  customTitle?: string;
  customMessage?: string;
  onError?: (error: any) => void;
}

export const useErrorHandler = () => {
  const { showError, showWarning } = useNotifications();

  const handleError = useCallback((
    error: unknown, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showNotification = true,
      customTitle,
      customMessage,
      onError,
    } = options;

    const apiError = formatApiError(error);
    
    // Log error for debugging
    console.error('Error occurred:', {
      error: apiError,
      originalError: error,
      timestamp: new Date().toISOString(),
    });

    // Show notification if enabled
    if (showNotification) {
      const notificationProps = getErrorNotificationProps(apiError);
      
      showError(
        customTitle || notificationProps.title,
        customMessage || notificationProps.message,
        {
          duration: notificationProps.duration,
          persistent: notificationProps.persistent,
        }
      );
    }

    // Call custom error handler if provided
    if (onError) {
      onError(apiError);
    }

    return apiError;
  }, [showError]);

  const handleValidationError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const apiError = formatApiError(error);
    
    // For validation errors, show a warning instead of error
    if (options.showNotification !== false) {
      showWarning(
        options.customTitle || 'Validation Error',
        options.customMessage || apiError.message,
        {
          duration: 6000,
        }
      );
    }

    return apiError;
  }, [showWarning]);

  const handleNetworkError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const apiError = formatApiError(error);
    
    if (options.showNotification !== false) {
      showError(
        options.customTitle || 'Connection Error',
        options.customMessage || 'Please check your internet connection and try again.',
        {
          duration: 8000,
          action: {
            label: 'Retry',
            onClick: () => {
              // This would trigger a retry if the caller provides a retry function
              if (options.onError) {
                options.onError(apiError);
              }
            },
          },
        }
      );
    }

    return apiError;
  }, [showError]);

  return {
    handleError,
    handleValidationError,
    handleNetworkError,
  };
};