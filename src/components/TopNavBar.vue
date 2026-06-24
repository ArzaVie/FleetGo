<template>
  <header class="h-18 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-sm">
      <span class="text-slate-400 font-medium">FleetGo</span>
      <span class="text-slate-300">/</span>
      <span class="text-[#0d4d44] font-semibold uppercase tracking-wider text-xs">
        {{ breadcrumbText }}
      </span>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-7">
      <!-- Notification Dropdown -->
      <div class="relative">
        <button 
          @click="toggleNotifications"
          class="p-2 text-slate-500 hover:text-[#0d4d44] hover:bg-slate-50 rounded-xl transition-all cursor-pointer relative"
          title="Notifikasi"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <!-- Notification count badge -->
          <span 
            v-if="unreadCount > 0"
            class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
          ></span>
        </button>

        <!-- Notification Panel Dropdown Menu -->
        <div 
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-fadeIn"
        >
          <div class="flex items-center justify-between px-4 py-2 border-b border-slate-50">
            <span class="font-bold text-sm text-slate-800">Notifikasi</span>
            <button 
              @click="clearAll"
              class="text-xs text-[#0d4d44] font-semibold hover:underline cursor-pointer"
            >
              Bersihkan
            </button>
          </div>
          
          <div class="max-h-60 overflow-y-auto">
            <div 
              v-for="notif in store.notifications" 
              :key="notif.id"
              class="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50/50"
            >
              <p class="text-xs font-semibold text-slate-700">{{ notif.title }}</p>
              <span class="text-[10px] text-slate-400 font-medium">{{ notif.time }}</span>
            </div>
            
            <div 
              v-if="store.notifications.length === 0"
              class="py-8 text-center text-xs text-slate-400 font-medium"
            >
              Tidak ada notifikasi baru
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile Profile Info -->
      <div class="flex items-center gap-4 border-l border-slate-100 pl-6">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-bold text-slate-800 leading-none mb-1.5">{{ store.user?.nama || 'Guest' }}</p>
          <span class="bg-emerald-50 text-[#0d4d44] border border-emerald-100 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            {{ displayRoleName }}
          </span>
        </div>
        
        <div 
          v-if="store.user?.foto"
          class="w-10.5 h-10.5 rounded-full border border-emerald-700/10 overflow-hidden flex items-center justify-center bg-slate-50 shadow-sm"
        >
          <span v-if="isEmoji(store.user.foto)" class="text-2xl">{{ store.user.foto }}</span>
          <img v-else :src="store.user.foto" class="w-full h-full object-cover" alt="Avatar" />
        </div>
        <div 
          v-else
          class="w-10.5 h-10.5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-base border border-emerald-700/20"
        >
          {{ avatarInitials }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRoleStore } from '../stores/roleStore';

const route = useRoute();
const store = useRoleStore();
const showNotifications = ref(false);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const clearAll = () => {
  store.clearNotifications();
};

const unreadCount = computed(() => {
  return store.notifications.filter(n => !n.read).length;
});

const avatarInitials = computed(() => {
  const name = store.user?.nama || 'G';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
});

const displayRoleName = computed(() => {
  const currentRole = store.activeRole;
  if (currentRole === 'user') return 'Requester';
  if (currentRole === 'approver') return 'Manager Approver';
  if (currentRole === 'dispatcher') return 'GS Dispatcher';
  if (currentRole === 'driver') return 'Driver';
  if (currentRole === 'superadmin') return 'Super Admin';
  return currentRole;
});

const breadcrumbText = computed(() => {
  if (route.path === '/profile') return 'Profil Saya';
  
  const currentRole = store.activeRole;
  if (currentRole === 'user') return 'Dashboard > Pengajuan Perjalanan';
  if (currentRole === 'approver') return 'Dashboard > Persetujuan Perjalanan';
  if (currentRole === 'dispatcher' || currentRole === 'admin') return 'Dashboard > Penugasan Driver';
  if (currentRole === 'driver') return 'Dashboard > Tugas Lapangan';
  if (currentRole === 'superadmin') return 'Dashboard > System Administration';
  return 'Dashboard';
});

// Close dropdown on click outside
const closeDropdown = (e) => {
  if (showNotifications.value && !e.target.closest('.relative')) {
    showNotifications.value = false;
  }
};

const isEmoji = (val) => {
  if (!val) return false;
  return val.length <= 4;
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>
