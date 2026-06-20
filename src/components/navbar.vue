<template>
  <nav class="flex justify-between items-center bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-slate-100 mb-8 sticky top-4 z-50">
    <div class="flex items-center gap-4">
      <button @click="goBack" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <div>
        <h1 class="text-lg font-bold text-slate-800 leading-tight">FleetGo</h1>
        <p class="text-xs text-slate-500 font-medium">{{ userName }}</p>
      </div>
    </div>

    <button @click="handleLogout" class="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200">
      Logout
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userName = ref('Guest');

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) userName.value = user.name;
});

const goBack = () => router.back();
const handleLogout = () => {
  localStorage.removeItem('user');
  router.push('/login');
};
</script>