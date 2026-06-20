import { createRouter, createWebHistory } from 'vue-router';

// Import views lo (pastikan path-nya sesuai folder)
import Login from '../views/auth/Login.vue';
import FormBooking from '../views/pelanggan/FormBooking.vue';
import ApprovalList from '../views/approver/ApprovalList.vue';
import BuatSuratTugas from '../views/admin/BuatSuratTugas.vue';
import DashboardDriver from '../views/driver/DashboardDriver.vue';

const routes = [
  { path: '/', redirect: '/login' }, // Ini kuncinya! Arahkan ke login
  { path: '/login', component: Login },
  { path: '/pelanggan', component: FormBooking },
  { path: '/approver', component: ApprovalList },
  { path: '/admin', component: BuatSuratTugas },
  { path: '/driver', component: DashboardDriver }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;