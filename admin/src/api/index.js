import axios from 'axios';

// In dev: Vite proxy forwards /api → localhost:5000
// In production: set VITE_API_URL=https://your-backend.com/api
const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE });

export const getAllProfiles = () =>
  api.get('/profiles').then((r) => r.data);

export const getProfile = (id) =>
  api.get(`/profiles/${id}`).then((r) => r.data);

export const createProfile = (data) =>
  api.post('/profiles', data).then((r) => r.data);

export const updateProfile = (id, data) =>
  api.put(`/profiles/${id}`, data).then((r) => r.data);

export const deleteProfile = (id) =>
  api.delete(`/profiles/${id}`).then((r) => r.data);

export const getAllConnections = () =>
  api.get('/connections').then((r) => r.data);

export const deleteConnection = (id) =>
  api.delete(`/connections/${id}`).then((r) => r.data);
