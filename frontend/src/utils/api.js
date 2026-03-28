import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for better error handling
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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getDashboard: () => api.get('/users/dashboard'),
  getPublicProfile: (userId) => api.get(`/users/${userId}`),
};

export const resourceAPI = {
  createResource: (data) => api.post('/resources', data),
  getResources: (filters) => api.get('/resources', { params: filters }),
  getResourceById: (id) => api.get(`/resources/${id}`),
  downloadResource: (id) => api.post(`/resources/${id}/download`),
  remixResource: (id, data) => api.post(`/resources/${id}/remix`, data),
  deleteResource: (id) => api.delete(`/resources/${id}`),
};

export const lessonPlanAPI = {
  createLessonPlan: (data) => api.post('/lesson-plans', data),
  getLessonPlans: (filters) => api.get('/lesson-plans', { params: filters }),
  getLessonPlanById: (id) => api.get(`/lesson-plans/${id}`),
  updateLessonPlan: (id, data) => api.put(`/lesson-plans/${id}`, data),
  publishLessonPlan: (id) => api.post(`/lesson-plans/${id}/publish`),
  deleteLessonPlan: (id) => api.delete(`/lesson-plans/${id}`),
};

export const communityAPI = {
  createCommunity: (data) => api.post('/community', data),
  getCommunities: (filters) => api.get('/community', { params: filters }),
  getCommunityById: (id) => api.get(`/community/${id}`),
  joinCommunity: (id) => api.post(`/community/${id}/join`),
  createThread: (communityId, data) => api.post(`/community/${communityId}/discussions`, data),
  getThreads: (communityId, filters) => api.get(`/community/${communityId}/discussions`, { params: filters }),
  addReply: (communityId, threadId, data) =>
    api.post(`/community/${communityId}/discussions/${threadId}/replies`, data),
  likeThread: (communityId, threadId) =>
    api.post(`/community/${communityId}/discussions/${threadId}/like`),
};

export const aiToolsAPI = {
  generateLessonPlan: (data) => api.post('/ai-tools/lesson-planner', data),
  summarizeResource: (data) => api.post('/ai-tools/summarizer', data),
  voiceToLessonPlan: (data) => api.post('/ai-tools/voice-to-lesson', data),
  scanWhiteboard: (data) => api.post('/ai-tools/whiteboard-scanner', data),
  predictStudentPerformance: (data) => api.post('/ai-tools/student-predictor', data),
  analyzeResourceGaps: (filters) => api.get('/ai-tools/gap-analyzer', { params: filters }),
  teachbotQuery: (data) => api.post('/ai-tools/teachbot', data),
  recommendResources: () => api.get('/ai-tools/recommendations'),
};

export const gamificationAPI = {
  getStats: () => api.get('/gamification/stats'),
  getAchievements: () => api.get('/gamification/achievements'),
  getLeaderboard: () => api.get('/gamification/leaderboard'),
  getChallenges: () => api.get('/gamification/challenges'),
  joinChallenge: (id) => api.post(`/gamification/challenges/${id}/join`),
  completeChallenge: (id) => api.post(`/gamification/challenges/${id}/complete`),
};

export const messagesAPI = {
  sendMessage: (data) => api.post('/messages/send', data),
  getConversation: (recipientId) => api.get(`/messages/conversation/${recipientId}`),
  getConversations: () => api.get('/messages'),
};

export const notificationsAPI = {
  getNotifications: (filters) => api.get('/notifications', { params: filters }),
  markAsRead: (ids) => api.put('/notifications/mark-read', { notificationIds: ids }),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const adminAPI = {
  getSchoolHealthReport: (schoolId) => api.get(`/admin/school/${schoolId}/health-report`),
  generateTimetable: (data) => api.post('/admin/timetable/generate', data),
  createPoll: (data) => api.post('/admin/polls', data),
  matchMentor: () => api.post('/admin/mentor/match'),
};

export const paymentAPI = {
  createCheckoutSession: (tier) => api.post('/payments/create-checkout-session', { tier }),
};

export default api;
