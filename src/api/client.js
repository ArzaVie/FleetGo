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
  getMyBookings: () => apiClient.get('/my-bookings'),
  getPendingBookings: () => apiClient.get('/approver/pending'),
  getAllBookings: () => apiClient.get('/approver/all-bookings'),
  updateBookingStatus: (id, status) => apiClient.put(`/bookings/${id}/approve`, { status_approver: status === 'approved' ? 'disetujui' : 'ditolak' }),
  getReadyToAssign: () => apiClient.get('/admin/ready-to-assign'),
  getDrivers: () => apiClient.get('/admin/drivers'),
  postSuratTugas: (data) => apiClient.post('/surat-tugas', data),
  getMyTask: () => apiClient.get('/driver/my-task'),
  postPersekot: (data) => apiClient.post('/driver/persekot', data),
  
  // Extension APIs
  updateTaskStatus: (status) => apiClient.put('/driver/task/status', { status_tugas: status }),
  postCheckpoint: (data) => apiClient.post('/driver/task/checkpoint', data),
  getCheckpoints: (suratTugasId) => apiClient.get(`/driver/task/checkpoints/${suratTugasId}`),
  getActiveTasks: () => apiClient.get('/admin/active-tasks'),
  closeTask: (id) => apiClient.put(`/admin/tasks/${id}/close`),
  getPendingPersekot: () => apiClient.get('/admin/keuangan-pending'),
  cairkanPersekot: (id) => apiClient.put(`/admin/keuangan/${id}/cair`),
  getUsers: () => apiClient.get('/admin/users'),
  updateUserRole: (id, role) => apiClient.put(`/admin/users/${id}/role`, { role }),
  getAuditLogs: () => apiClient.get('/admin/audit-logs'),
  purgeData: () => apiClient.post('/admin/purge'),
  submitPelunasan: (id, data) => apiClient.put(`/keuangan/pelunasan/${id}`, data),
  updateProfile: (data) => apiClient.put('/users/profile', data)
};