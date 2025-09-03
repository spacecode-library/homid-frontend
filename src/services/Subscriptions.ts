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
  }
}