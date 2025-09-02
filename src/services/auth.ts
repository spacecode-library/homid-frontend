import { api } from './api';

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode?: string;
  userType: 'END_USER' | 'CREATOR';
}

export interface LoginData {
  email: string;
  password: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode?: string;
  userType: 'id_buyer' | 'id_creator' | 'END_USER' | 'CREATOR';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Transform userType to backend format
    const backendData = {
      ...data,
      userType: data.userType === 'END_USER' ? 'end_user' : 'id_buyer'
    };
    
    const response = await api.post('/auth/register', backendData);
    console.log('Register response:', response.data);
    const { tokens, user } = response.data.data;
    
    // Store tokens
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    
    // Return normalized response
    return {
      ...response.data,
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    };
  },
  
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    const { tokens, user } = response.data.data;
    
    // Store access token
    localStorage.setItem('accessToken', tokens.accessToken);
    // Store refresh token for future use
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    
    // Return normalized response
    return {
      ...response.data,
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    };
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },
  
  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { tokens } = response.data.data;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    return tokens.accessToken;
  },
  
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword: newPassword,
    });
  },
  
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', {
      token,
      newPassword,
      confirmNewPassword: newPassword,
    });
  },
  
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },
  
  resendVerificationEmail: async (): Promise<void> => {
    await api.post('/auth/resend-verification');
  },
};