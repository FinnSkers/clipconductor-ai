import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Service endpoints
export const aiService = {
  generateMetadata: (data: { clip_title: string; game_name?: string; clip_duration?: number }) =>
    api.post('/ai/generate-metadata', data),
  
  generateText: (data: { prompt: string; model?: string }) =>
    api.post('/ai/generate-text', data),
  
  analyzeContent: (clip_title: string) =>
    api.post(`/ai/analyze-content?clip_title=${encodeURIComponent(clip_title)}`),
  
  getModels: () => api.get('/ai/models'),
  
  getHealth: () => api.get('/ai/health'),
  
  testOllama: () => api.post('/ai/test-ollama'),
};

// Backend health
export const systemService = {
  getHealth: () => api.get('/health'),
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
