import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

/**
 * Search profiles with OR/fuzzy matching.
 * @param {{ name?: string, location?: string, department?: string }} params
 */
export const searchProfiles = (params) =>
  api.get('/profiles/search', { params }).then((r) => r.data);

/**
 * Get a single profile by ID.
 * @param {string} id
 */
export const getProfile = (id) =>
  api.get(`/profiles/${id}`).then((r) => r.data);

/**
 * Get all profiles.
 */
export const getAllProfiles = () =>
  api.get('/profiles').then((r) => r.data);

/**
 * Create a new profile.
 * @param {object} data
 */
export const createProfile = (data) =>
  api.post('/profiles', data).then((r) => r.data);

/**
 * Update an existing profile.
 * @param {string} id
 * @param {object} data
 */
export const updateProfile = (id, data) =>
  api.put(`/profiles/${id}`, data).then((r) => r.data);

/**
 * Delete a profile.
 * @param {string} id
 */
export const deleteProfile = (id) =>
  api.delete(`/profiles/${id}`).then((r) => r.data);

/**
 * Submit a connection request for a profile.
 * @param {{ profileId: string, visitorName: string, visitorEmail: string, visitorPhone: string }} data
 */
export const postConnection = (data) =>
  api.post('/connections', data).then((r) => r.data);
