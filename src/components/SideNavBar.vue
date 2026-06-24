<template>
  <aside class="w-64 h-screen bg-[#0d4d44] text-white flex flex-col justify-between fixed left-0 top-0 z-40 border-r border-[#08352f]/30 py-6 px-4">
    <!-- Top Brand Logo & Menu Items -->
    <div class="flex flex-col gap-6">
      <!-- Logo and App Name -->
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all cursor-pointer" title="FleetGo">
          <span class="font-extrabold text-lg text-emerald-400">FG</span>
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base tracking-wide text-white leading-tight">FleetGo</span>
          <span class="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider">Corporate Portal</span>
        </div>
      </div>
      
      <!-- Role Icon Divider -->
      <div class="h-[1px] bg-white/10 mx-2"></div>
      
      <!-- Context-Aware Menu Items -->
      <nav class="flex flex-col gap-2">
        <!-- Requester Menu (Home/Booking Form) -->
        <button 
          v-if="showRequesterMenu"
          @click="navigate('/pelanggan')"
          class="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-premium hover:bg-white/10 cursor-pointer text-sm font-semibold border border-transparent"
          :class="isRouteActive('/pelanggan') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-emerald-100/70'"
          title="Request Perjalanan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Pemesanan Baru</span>
        </button>

        <!-- Approver Menu (Approval Queue) -->
        <button 
          v-if="showApproverMenu"
          @click="navigate('/approver')"
          class="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-premium hover:bg-white/10 cursor-pointer text-sm font-semibold border border-transparent"
          :class="isRouteActive('/approver') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-emerald-100/70'"
          title="Persetujuan Manajer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span>Persetujuan</span>
        </button>

        <!-- Dispatcher Menu (Surat Tugas / Dispatching) -->
        <button 
          v-if="showDispatcherMenu"
          @click="navigate('/admin')"
          class="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-premium hover:bg-white/10 cursor-pointer text-sm font-semibold border border-transparent"
          :class="isRouteActive('/admin') && store.activeRole === 'dispatcher' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-emerald-100/70'"
          title="Penugasan Driver & Mobil"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Penugasan Armada</span>
        </button>

        <!-- Driver Menu (Active task status updates) -->
        <button 
          v-if="showDriverMenu"
          @click="navigate('/driver')"
          class="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-premium hover:bg-white/10 cursor-pointer text-sm font-semibold border border-transparent"
          :class="isRouteActive('/driver') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-emerald-100/70'"
          title="Tugas Driver"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>Tugas Lapangan</span>
        </button>

        <!-- Super Admin Menu (System Logs/Role management) -->
        <button 
          v-if="showSuperAdminMenu"
          @click="navigateAdminSection('superadmin')"
          class="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-premium hover:bg-white/10 cursor-pointer text-sm font-semibold border border-transparent"
          :class="isRouteActive('/admin') && store.activeRole === 'superadmin' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-emerald-100/70'"
          title="Maintenance & Audit Logs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Maintenance & Logs</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Actions -->
    <div class="flex flex-col gap-2 w-full">
      <!-- Profile Button -->
      <button 
        @click="navigate('/profile')"
        class="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-premium hover:bg-white/10 cursor-pointer text-sm font-semibold border border-transparent"
        :class="isRouteActive('/profile') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-emerald-100/70'"
        title="Profil Saya"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Profil Saya</span>
      </button>

      <!-- Logout Button -->
      <button 
        @click="logout"
        class="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-red-300 transition-premium hover:bg-red-500/20 hover:text-red-400 cursor-pointer text-sm font-semibold border border-transparent"
        title="Keluar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRoleStore } from '../stores/roleStore';

const router = useRouter();
const route = useRoute();
const store = useRoleStore();

// Side menu filters based on activeRole
const showRequesterMenu = computed(() => {
  return store.activeRole === 'user' || store.user?.role === 'superadmin';
});

const showApproverMenu = computed(() => {
  return store.activeRole === 'approver' || store.user?.role === 'superadmin';
});

const showDispatcherMenu = computed(() => {
  return store.activeRole === 'dispatcher' || store.user?.role === 'superadmin';
});

const showDriverMenu = computed(() => {
  return store.activeRole === 'driver' || store.user?.role === 'superadmin';
});

const showSuperAdminMenu = computed(() => {
  return store.user?.role === 'superadmin'; // Only real superadmins can preview/use superadmin tasks
});

const isRouteActive = (path) => {
  return route.path === path;
};

const navigate = (path) => {
  if (store.user?.role === 'superadmin') {
    // If superadmin is previewing, we keep them on /admin but change the preview role
    if (path === '/pelanggan') store.setPreviewRole('user');
    else if (path === '/approver') store.setPreviewRole('approver');
    else if (path === '/driver') store.setPreviewRole('driver');
    else if (path === '/admin') store.setPreviewRole('dispatcher');
    
    // Allow profile to run separately
    if (path === '/profile') router.push('/profile');
    else router.push('/admin');
  } else {
    router.push(path);
  }
};

const navigateAdminSection = (role) => {
  if (store.user?.role === 'superadmin') {
    store.setPreviewRole(role);
    router.push('/admin');
  }
};

const logout = () => {
  store.setUser(null);
  router.push('/login');
};
</script>
