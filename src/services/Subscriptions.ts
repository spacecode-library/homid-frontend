import { api } from './api';

export const subscriptionService = {
  createSubscription: async (planId: string, paymentMethodId?: string) => {
    const obj = {
      planId: planId,
      paymentMethodId: paymentMethodId
    }
    const response = await api.post('/subscriptions/create', obj);
    return response.data;
  },

  createBillingPortalSession: async () => {
    const response = await api.post('/subscriptions/billing-portal');
    return response.data;
  },

  generateHomeId: async (obj: any) => {
    const response = await api.post('/homid/generate', obj);
    return response.data;
  },

  insertCartId: async (obj: any) => {
    const response = await api.post('/homid/insert', obj);
    return response.data;
  },

  usersInfo: async () => {
    const response = await api.get('/users/info');
    return response.data;
  },

  homeIdsList: async () => {
    const response = await api.get('/homid/list');
    return response.data;
  },

  homeIdsDetailsPost: async (obj: any) => {
    const response = await api.post('/homid', obj);
    return response.data;
  },

  getHomeIdsDetails: async (homIdId: string) => {
    const response = await api.get(`/homid/${homIdId}`);
    return response.data;
  },

  extractDataBasedOnIUrl: async (obj: any) => {
    const resposne = await api.post('/homid/extract', obj);
    return resposne.data;
  },

  postChat: async (obj: any) => {
    const response = await api.post('/homid/chat', obj);
    return response.data;
  },

  postHomIdInfo: async (obj: any) => {
    const response = await api.post(`homid/info`, obj);
    return response.data;
  },

  updateStatus: async (id: string) => {
    const response = await api.put(`/homid/status/${id}`)
  },

  postHomIdRedirect: async (obj: any) => {
    const response = await api.post('homid/redirect', obj);
    return response.data;
  },

  postHistory: async (obj: any) => {
    const response = await api.post('/homid/history', obj);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/homid/history');
    return response.data;
  },

  postFavouriteFolder: async (obj: any) => {
    const response = await api.post('/favourite', obj);
    return response.data;
  },

  getFavouriteFolder: async () => {
    const response = await api.get('/favourite');
    return response.data;
  },

  postAddTofavouriteCard: async (id: string, obj: any) => {
    const response = await api.post(`/favourite/${id}/products`, obj);
    return response.data;
  },

  getFavouritesById: async (id: string) => {
    const response = await api.get(`/favourite/${id}`);
    return response.data;
  },

  deleteFavouritesItem: async (folderId: string, itemId: string) => {
    const response = await api.delete(`/favourite/folders/${folderId}/items/${itemId}`);
    return response.data;
  },

  deleteFavouritesFolder: async (id: string) => {
    const response = await api.delete(`/favourite/folders/${id}`);
    return response.data;
  },

  getUsersInfo: async () => {
    const response = await api.get('/users/info');
    return response.data;
  },

  postProfileImage: async (formData: FormData) => {
    const response = await api.post('/users/profile/upload-image', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getTopIds: async () => {
    const response = await api.get('/homid/top-ids');
    return response.data;
  },

  getAnalyticsId: async (id: string) => {
    const response = await api.get(`/homid/traffic/${id}`);
    return response.data;
  },

  adminHomeIdsList: async () => {
    const response = await api.get('/homid/admin/list');
    return response.data;
  },

  adminGetHomeIdsDetails: async (homIdId: string) => {
    const response = await api.get(`/homid/admin/${homIdId}`);
    return response.data;
  },

  adminStatusApprove: async (id: string) => {
    const response = await api.put(`/homid/admin/approve/status/${id}`);
    return response.data;
  },

  adminStatusReject: async (id: string, obj: any) => {
    const response = await api.put(`/homid/admin/reject/status/${id}`, obj);
    return response.data;
  },

  updateProfile: async (obj: any) => {
    const response = await api.put('/users/profile', obj);
    return response.data;
  },

  getAnalyticsRankingIDs: async (page: number, limit: number) => {
    const response = await api.get(`/analytics/rankings?page=${page}&limit=${limit}`);
    return response.data;
  },

  getCountryTrafficData: async (limit: number = 15, days: number = 7) => {
    const response = await api.get(`/analytics/country-traffic?limit=${limit}&days=${days}`);
    return response.data;
  },

  getIdStaticsData: async () => {
    const response = await api.get('/analytics/id-statistics');
    return response.data;
  }
}