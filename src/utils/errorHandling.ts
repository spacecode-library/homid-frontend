import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export const formatApiError = (error: unknown): ApiError => {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        // Handle detailed validation errors
        if (data?.details && Array.isArray(data.details)) {
          const fieldErrors = data.details.reduce((acc: Record<string, string[]>, detail: any) => {
            const field = detail.field || 'general';
            if (!acc[field]) acc[field] = [];
            acc[field].push(detail.message);
            return acc;
          }, {});
          
          const errorMessages = Object.entries(fieldErrors).map(([field, messages]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
            return `${fieldName}: ${(messages as string[]).join(', ')}`;
          });
          
          return {
            message: errorMessages.join('\n'),
            code: 'VALIDATION_ERROR',
            status,
            details: data.details,
          };
        }
        
        return {
          message: data?.message || data?.error || 'Invalid request. Please check your input.',
          code: 'VALIDATION_ERROR',
          status,
          details: data?.errors || data?.details,
        };
      
      case 401:
        return {
          message: 'Authentication required. Please sign in again.',
          code: 'UNAUTHORIZED',
          status,
        };
      
      case 403:
        return {
          message: 'Access denied. You don\'t have permission to perform this action.',
          code: 'FORBIDDEN',
          status,
        };
      
      case 404:
        return {
          message: data?.message || 'The requested resource was not found.',
          code: 'NOT_FOUND',
          status,
        };
      
      case 409:
        return {
          message: data?.message || 'This action conflicts with existing data.',
          code: 'CONFLICT',
          status,
        };
      
      case 422:
        return {
          message: data?.message || 'The provided data is invalid.',
          code: 'UNPROCESSABLE_ENTITY',
          status,
          details: data?.errors || data?.details,
        };
      
      case 429:
        return {
          message: 'Too many requests. Please wait a moment and try again.',
          code: 'RATE_LIMITED',
          status,
        };
      
      case 500:
        return {
          message: 'Server error. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
          status,
        };
      
      case 502:
      case 503:
      case 504:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          code: 'SERVICE_UNAVAILABLE',
          status,
        };
      
      default:
        return {
          message: data?.message || error.message || 'An unexpected error occurred.',
          code: 'UNKNOWN_HTTP_ERROR',
          status,
        };
    }
  }

  // Handle network errors
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }

    return {
      message: error.message,
      code: 'GENERIC_ERROR',
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR',
    };
  }

  // Handle unknown errors
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
  };
};

export const getErrorNotificationProps = (error: ApiError) => {
  const isServerError = error.status && error.status >= 500;
  const isNetworkError = error.code === 'NETWORK_ERROR';
  
  return {
    type: 'error' as const,
    title: getErrorTitle(error),
    message: error.message,
    duration: isServerError || isNetworkError ? 10000 : 7000, // Longer for server/network errors
    persistent: error.code === 'UNAUTHORIZED', // Auth errors stay until dismissed
  };
};

const getErrorTitle = (error: ApiError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 'Validation Error';
    case 'UNAUTHORIZED':
      return 'Authentication Required';
    case 'FORBIDDEN':
      return 'Access Denied';
    case 'NOT_FOUND':
      return 'Not Found';
    case 'CONFLICT':
      return 'Conflict Error';
    case 'UNPROCESSABLE_ENTITY':
      return 'Invalid Data';
    case 'RATE_LIMITED':
      return 'Rate Limited';
    case 'INTERNAL_SERVER_ERROR':
      return 'Server Error';
    case 'SERVICE_UNAVAILABLE':
      return 'Service Unavailable';
    case 'NETWORK_ERROR':
      return 'Connection Error';
    default:
      return 'Error';
  }
};

export const getValidationErrors = (error: ApiError): ValidationError[] => {
  if (!error.details) return [];
  
  const errors: ValidationError[] = [];
  
  // Handle different validation error formats
  if (Array.isArray(error.details)) {
    error.details.forEach((detail: any) => {
      if (detail.field && detail.message) {
        errors.push({ field: detail.field, message: detail.message });
      }
    });
  } else if (typeof error.details === 'object') {
    Object.entries(error.details).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((message: string) => {
          errors.push({ field, message });
        });
      } else if (typeof messages === 'string') {
        errors.push({ field, message: messages });
      }
    });
  }
  
  return errors;
};

// Hook for handling errors with notifications
export const useErrorHandler = () => {
  const handleError = (error: unknown, options?: {
    showNotification?: boolean;
    customTitle?: string;
    customMessage?: string;
  }) => {
    const apiError = formatApiError(error);
    
    if (options?.showNotification !== false) {
      // This would be used with the notification context
      // const { showError } = useNotifications();
      // showError(
      //   options?.customTitle || getErrorTitle(apiError),
      //   options?.customMessage || apiError.message
      // );
    }
    
    // Log error for debugging
    console.error('Error occurred:', apiError);
    
    return apiError;
  };

  return { handleError };
};