import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({ baseURL: BASE });

// Attach JWT token to every request automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────
export const login    = (data) => client.post('/api/auth/login',    data);
export const register = (data) => client.post('/api/auth/register', data);

// ── Users ─────────────────────────────────────────────────────────
export const getUsers        = ()         => client.get('/api/users');
export const getUser         = (id)       => client.get(`/api/users/${id}`);
export const updateUser      = (id, data) => client.put(`/api/users/${id}`, data);
export const getMatches      = (userId)   => client.get(`/api/users/matches/${userId}`);
export const getConnections  = (userId)   => client.get(`/api/users/${userId}/connections`);

// ── Feed ──────────────────────────────────────────────────────────
export const getFeed         = ()         => client.get('/api/feed');
export const createPost      = (data)     => client.post('/api/feed', data);
export const likePost        = (id)       => client.put(`/api/feed/${id}/like`);
export const commentOnPost   = (id, data) => client.post(`/api/feed/${id}/comment`, data);
export const deletePost      = (id)       => client.delete(`/api/feed/${id}`);

// ── Events ────────────────────────────────────────────────────────
export const getEvents       = ()         => client.get('/api/events');
export const rsvpEvent       = (id)       => client.put(`/api/events/${id}/rsvp`);
export const suggestEvent    = (data)     => client.post('/api/events/suggest', data);

// ── Jobs ──────────────────────────────────────────────────────────
export const getJobs         = (field)    => client.get('/api/jobs', { params: { field } });
export const postJob         = (data)     => client.post('/api/jobs', data);
export const submitCvReview  = (data)     => client.post('/api/jobs/cv-review', data);
export const getReviewers    = ()         => client.get('/api/jobs/reviewers');

// ── Resources ─────────────────────────────────────────────────────
export const getResources    = ()         => client.get('/api/resources');
export const uploadResource  = (data)     => client.post('/api/resources', data);
export const markRead        = (id)       => client.put(`/api/resources/${id}/read`);
export const getScholarships = ()         => client.get('/api/resources/scholarships');

// ── Community ─────────────────────────────────────────────────────
export const getLeaderboard      = ()       => client.get('/api/community/leaderboard');
export const getHouseLeaderboard = ()       => client.get('/api/community/house-leaderboard');
export const getBadges           = (userId) => client.get(`/api/community/badges/${userId}`);

// ── Conversations & Messages ──────────────────────────────────────
export const getConversations   = ()             => client.get('/api/conversations');
export const createConversation = (participantId)=> client.post('/api/conversations', { participantId });
export const getMessages        = (convId)       => client.get(`/api/messages/${convId}`);
export const sendMessage        = (data)         => client.post('/api/messages', data);
export const deleteMessage      = (id)           => client.delete(`/api/messages/${id}`);
