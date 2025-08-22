import { api } from './api';

export interface UserHomId {
  numericId: string;
  formattedId: string;
  status: 'active' | 'inactive';
  purchaseDate: string;
  expiryDate: string | null;
  isActive: boolean;
  isExpired: boolean;
  redirectCreditsTotal: number;
  redirectCreditsUsed: number;
  redirectCreditsRemaining: number;
  usagePercentage: number;
  mappingsCount: number;
  hasActiveMapping: boolean;
}

export interface MyIdsResponse {
  ids: UserHomId[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CheckIdAvailabilityResponse {
  available: boolean;
  id?: string;
  message?: string;
}

export interface PurchaseIdResponse {
  id: string;
  formattedId: string;
  purchaseDate: string;
  redirectCredits: number;
}

export interface WebsiteInfo {
  title: string;
  description: string;
  image: string;
  screenshot: string;
  favicon: string;
}

export interface IdMappingData {
  productName: string;
  targetUrl: string;
  websiteInfo?: WebsiteInfo;
  isAdultContent?: boolean;
  websiteType?: 'SERVICE' | 'PRODUCT' | 'BOTH';
  isOwnerVerified?: boolean;
  startDate?: string;
  stopDate?: string;
  socialPlatforms?: string[];
  affiliateUrl?: string;
  isPaidPromotion?: boolean;
  tags?: string[];
  memo?: string;
  businessCountry?: string;
  totalEarnings?: number;
}

export interface UpdateMappingData {
  primaryUrl: string;
  businessCountry?: string;
  mappingType?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  // Enhanced fields
  productName?: string;
  websiteInfo?: {
    title: string;
    description: string;
    image: string;
    screenshot: string;
    favicon: string;
  };
  isAdultContent?: boolean;
  websiteType?: string;
  isOwnerVerified?: boolean;
  socialPlatforms?: string[];
  affiliateUrl?: string;
  isPaidPromotion?: boolean;
  totalEarnings?: number;
  tags?: string[];
  memo?: string;
}

export const idsService = {
  async getMyIds(page = 1, limit = 20): Promise<{ data: MyIdsResponse }> {
    const response = await api.get('/ids/my-ids', {
      params: { page, limit }
    });
    return response.data;
  },

  async checkAvailability(id: string): Promise<{ data: CheckIdAvailabilityResponse }> {
    const response = await api.get(`/ids/check/${id}`);
    return response.data;
  },

  async purchaseId(id?: string): Promise<{ data: PurchaseIdResponse }> {
    const response = await api.post('/ids/purchase', { id });
    return response.data;
  },

  async purchaseBulkIds(count: number): Promise<{ data: PurchaseIdResponse[] }> {
    const response = await api.post('/ids/purchase-bulk', { count });
    return response.data;
  },

  async updateMapping(id: string, data: UpdateMappingData): Promise<{ data: any }> {
    const response = await api.put(`/ids/${id}/mapping`, data);
    return response.data;
  },

  // NEW: Read URL and fetch metadata
  async readUrl(id: string, url: string): Promise<{ data: WebsiteInfo }> {
    const response = await api.post(`/ids/${id}/read-url`, { url });
    return response.data;
  },

  // NEW: Update complete mapping configuration
  async updateCompleteMapping(id: string, mapping: IdMappingData): Promise<{ data: any }> {
    const response = await api.put(`/ids/${id}/mapping`, mapping);
    return response.data;
  },

  // NEW: Get screenshot
  async getScreenshot(id: string, url?: string): Promise<{ data: { screenshot: string } }> {
    const response = await api.get(`/ids/${id}/screenshot${url ? `?url=${url}` : ''}`);
    return response.data;
  },

  // NEW: Get public metadata (no ownership required)
  async getPublicMetadata(id: string): Promise<{ 
    data: {
      homId: string;
      ownerName: string;
      targetUrl: string | null;
      metadata: WebsiteInfo | null;
    }
  }> {
    const response = await api.get(`/ids/${id}/metadata`);
    return response.data;
  }
};