import { createRouter, createWebHistory } from 'vue-router';

// Import views
import Login from '../views/auth/Login.vue';
import FormBooking from '../views/pelanggan/FormBooking.vue';
import ApprovalList from '../views/approver/ApprovalList.vue';
import MasterDashboard from '../views/admin/MasterDashboard.vue';
import DashboardDriver from '../views/driver/DashboardDriver.vue';
import UserProfile from '../views/auth/UserProfile.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/pelanggan', component: FormBooking },
  { path: '/approver', component: ApprovalList },
  { path: '/admin', component: MasterDashboard },
  { path: '/driver', component: DashboardDriver },
  { path: '/profile', component: UserProfile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Authentication guard
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');
  if (to.path !== '/login' && !user) {
    next('/login');
  } else {
    next();
  }
});

export default router;