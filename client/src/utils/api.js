import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, difficultyLevel) =>
    api.post('/auth/register', { name, email, password, difficultyLevel }),
  getProfile: () => api.get('/auth/profile'),
};

export const yogaAPI = {
  getAllModules: (params) => api.get('/yoga', { params }),
  getModuleById: (id) => api.get(`/yoga/${id}`),
};

export const recommendationsAPI = {
  getRecommendations: () => api.get('/recommendations'),
};

export const userAPI = {
  toggleFavorite: (moduleId) => api.post('/user/favorites', { moduleId }),
  getFavorites: () => api.get('/user/favorites'),
  getProgress: () => api.get('/user/progress'),
  markComplete: (moduleId) => api.post('/user/progress', { moduleId }),
  updatePreferences: (prefs) =>
    api.put('/user/preferences', {
      categories: prefs.categories,
      timeOfDay: prefs.timeOfDay === 'Anytime' ? '' : prefs.timeOfDay?.toLowerCase(),
      difficultyLevel: prefs.difficulty,
    }),
};

export default api;
