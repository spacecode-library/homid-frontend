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
  }
}