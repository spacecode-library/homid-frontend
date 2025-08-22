import { api } from './api';

export interface AnalyticsOverview {
  totalRedirects: number;
  uniqueVisitors: number;
  totalIds: number;
  activeIds: number;
  topCountries: Array<{
    country: string;
    count: number;
  }>;
  recentActivity: Array<{
    id: string;
    homId: string;
    timestamp: string;
    type: string;
  }>;
}

export interface RedirectAnalytics {
  totalRedirects: number;
  redirectsByDay: Array<{
    date: string;
    count: number;
  }>;
  redirectsByHour: Array<{
    hour: number;
    count: number;
  }>;
  topIds: Array<{
    homId: string;
    count: number;
  }>;
}

export interface GeographicAnalytics {
  redirectsByCountry: Array<{
    country: string;
    count: number;
  }>;
  redirectsByCity: Array<{
    city: string;
    country: string;
    count: number;
  }>;
  topRegions: Array<{
    region: string;
    count: number;
  }>;
}

export interface DeviceAnalytics {
  deviceTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  browsers: Array<{
    browser: string;
    count: number;
    percentage: number;
  }>;
  operatingSystems: Array<{
    os: string;
    count: number;
    percentage: number;
  }>;
}

export interface SocialAnalytics {
  socialPlatforms: Array<{
    platform: string;
    count: number;
    percentage: number;
  }>;
  referrers: Array<{
    referrer: string;
    count: number;
  }>;
}

export const analyticsService = {
  // Get overview analytics
  getOverview: async (): Promise<{ data: AnalyticsOverview }> => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  // Get redirect analytics with date range
  getRedirects: async (startDate?: string, endDate?: string): Promise<{ data: RedirectAnalytics }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/redirects?${params.toString()}`);
    return response.data;
  },

  // Get geographic analytics
  getGeographic: async (startDate?: string, endDate?: string): Promise<{ data: GeographicAnalytics }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/geographic?${params.toString()}`);
    return response.data;
  },

  // Get device analytics
  getDevices: async (startDate?: string, endDate?: string): Promise<{ data: DeviceAnalytics }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/devices?${params.toString()}`);
    return response.data;
  },

  // Get social analytics
  getSocial: async (startDate?: string, endDate?: string): Promise<{ data: SocialAnalytics }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/social?${params.toString()}`);
    return response.data;
  },
};