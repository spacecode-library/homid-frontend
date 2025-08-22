import { api } from './api';

export interface AddFavoriteRequest {
  homId: string;
  folderName?: string; // Default: "General"
}

export interface Favorite {
  id: string;
  homId: string;
  folderName: string;
  createdAt: string;
  homIdData?: {
    numericId: string;
    owner: {
      firstName: string;
      lastName: string;
    };
    activeMapping?: {
      primaryUrl: string;
      businessCountry: string;
    };
  };
}

export interface FavoritesResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    folders: Array<{ name: string; count: number }>;
    favorites: Favorite[];
  };
}

export interface FavoriteFoldersResponse {
  success: boolean;
  message: string;
  data: {
    folders: Array<{ name: string; count: number }>;
  };
}

export const favoritesService = {
  // Add ID to favorites (requires authentication)
  addFavorite: async (data: AddFavoriteRequest) => {
    const response = await api.post('/favorites', data);
    return response.data;
  },

  // Get user's favorites (requires authentication)
  getFavorites: async (folder?: string): Promise<FavoritesResponse> => {
    const params = folder ? { folder } : {};
    const response = await api.get('/favorites', { params });
    return response.data;
  },

  // Get favorite folders (requires authentication)
  getFavoriteFolders: async (): Promise<FavoriteFoldersResponse> => {
    const response = await api.get('/favorites/folders');
    return response.data;
  },

  // Remove favorite (requires authentication)
  removeFavorite: async (favoriteId: string) => {
    const response = await api.delete(`/favorites/${favoriteId}`);
    return response.data;
  },
};