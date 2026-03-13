import api from './api';

export const settingsApi = {
  getThemeSettings: async () => {
    try {
      const res = await api.get('/dealer/settings');
      return res.data;
    } catch (err) {
      console.error('Error fetching theme settings:', err);
      throw err;
    }
  },
  
  updateThemeSettings: async (settings) => {
    try {
      const res = await api.put('/dealer/settings', settings);
      return res.data;
    } catch (err) {
      console.error('Error updating theme settings:', err);
      throw err;
    }
  }
};
