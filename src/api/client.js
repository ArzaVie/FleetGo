import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const API = {
  login: (data) => apiClient.post('/login', data),
  postBooking: (data) => apiClient.post('/bookings', data),
  getPending: () => apiClient.get('/approver/pending'),
  approveBooking: (id) => apiClient.patch(`/approver/status/${id}`, { status: 'approved' }),
  getReadyToAssign: () => apiClient.get('/admin/ready-to-assign'),
  postSuratTugas: (data) => apiClient.post('/surat-tugas', data),
  getMyTask: () => apiClient.get('/driver/my-task'),
  postPersekot: (data) => apiClient.post('/driver/persekot', data),
};