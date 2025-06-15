import axios from 'axios';
const API_URL = 'http://localhost:3001/api';

export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const register = (data) => axios.post(`${API_URL}/auth/register`, data);

export const fetchVentas = (token) =>
  axios.get(`${API_URL}/ventas`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const addVenta = (data, token) =>
  axios.post(`${API_URL}/ventas`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateVenta = (id, data, token) =>
  axios.put(`${API_URL}/ventas/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteVenta = (id, token) =>
  axios.delete(`${API_URL}/ventas/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const fetchReportes = (params, token) =>
  axios.get(`${API_URL}/ventas/reportes`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });