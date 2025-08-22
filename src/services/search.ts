import { api } from './api';

export interface SearchRequest {
  query: string;
}

export interface SearchResult {
  homId: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
  activeMapping?: {
    primaryUrl: string;
    businessCountry: string;
    isActive: boolean;
  };
  redirectCount: number;
  status: string;
}

export interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    found: boolean;
    id?: string;
    formattedId?: string;
    targetUrl?: string;
    ownerName?: string;
    isVerified?: boolean;
    isActive?: boolean;
    message?: string;
    searchQuery?: string;
  };
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  homId?: string;
  searchedAt: string;
  found: boolean;
  result?: {
    id: string;
    formattedId: string;
    targetUrl: string;
    ownerName: string;
  };
}

export interface SearchHistoryResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    history: SearchHistoryItem[];
  };
}

export const searchService = {
  // Search for Hom.ID (public endpoint)
  searchHomId: async (query: string): Promise<SearchResponse> => {
    const response = await api.post('/search', { query });
    return response.data;
  },

  // Get search history (requires authentication)
  getSearchHistory: async (limit?: number): Promise<SearchHistoryResponse> => {
    const params = limit ? { limit } : {};
    const response = await api.get('/search/history', { params });
    return response.data;
  },
};