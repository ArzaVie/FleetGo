<template>
  <div class="fade-in animate-fadeIn">
    <component :is="activeComponent" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoleStore } from '@/stores/roleStore';
import FormBooking from '../pelanggan/FormBooking.vue';
import ApprovalList from '../approver/ApprovalList.vue';
import DispatcherDashboard from './DispatcherDashboard.vue';
import DashboardDriver from '../driver/DashboardDriver.vue';
import SuperAdminDashboard from './SuperAdminDashboard.vue';

const store = useRoleStore();

const activeComponent = computed(() => {
  const currentRole = store.activeRole;
  if (currentRole === 'user') return FormBooking;
  if (currentRole === 'approver') return ApprovalList;
  if (currentRole === 'dispatcher' || currentRole === 'admin') return DispatcherDashboard;
  if (currentRole === 'driver') return DashboardDriver;
  if (currentRole === 'superadmin') return SuperAdminDashboard;
  return DispatcherDashboard; // Default fallback is dispatcher
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
