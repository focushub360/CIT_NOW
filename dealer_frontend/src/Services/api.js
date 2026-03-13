// dealer-portal/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://bharathan56-citnow-backend.hf.space';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to attach token dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API
export const dealerLogin = (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  return api.post('/dealer/login', formData);
};

export const getCurrentUser = () => api.get('/users/me');

// Dealer Dashboard API
export const getDealerDashboard = (timeRange = 'week') => 
  api.get(`/dashboard/super-admin/overview?timeRange=${timeRange}`);
export const getDealerUserStats = (dealerId) =>
  api.get(`/dashboard/dealer/${dealerId}/user-stats`);

// Results API
export const getDealerResults = (limit = 100, timeRange = 'all') =>
  api.get(`/results?limit=${limit}${timeRange !== 'all' ? `&timeRange=${timeRange}` : ''}`);

export const getMyPersonalResults = (limit = 100) =>
  api.get(`/results?limit=${limit}`);
export const deleteMyResult = (resultId) =>
  api.delete(`/dealer/results/${resultId}`);

// Analysis API
export const analyzeVideo = (analysisData) => api.post('/analyze', analysisData);
export const getMyAnalysisTasks = (limit = 20) =>
  api.get(`/dealer/my-analysis-tasks?limit=${limit}`);
export const getAnalysisStatus = (taskId) =>
  api.get(`/analyze-status/${taskId}`);

// Bulk Analysis API
export const bulkAnalyze = (file, transcriptionLanguage = 'auto', targetLanguage = 'en') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('transcription_language', transcriptionLanguage);
  formData.append('target_language', targetLanguage);
  return api.post('/bulk-analyze', formData);
};

export const getBatchStatus = (batchId) => api.get(`/bulk-status/${batchId}`);
export const getBatchResults = (batchId) => api.get(`/bulk-results/${batchId}`);
export const cancelBatch = (batchId) => api.post(`/bulk-cancel/${batchId}`);

export default api;
