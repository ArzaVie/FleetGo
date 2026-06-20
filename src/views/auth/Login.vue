<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

    <div class="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden relative z-10">
      <div class="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
        <h1 class="text-3xl font-extrabold text-white mb-2">FleetGo</h1>
        <p class="text-slate-300 text-sm">Sistem Manajemen Kendaraan Terpadu</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
            <input v-model="username" type="text" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input v-model="password" type="password" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div v-if="errorMessage" class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl text-center border border-red-100">
            {{ errorMessage }}
          </div>

          <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30">
            Masuk Sekarang
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { API } from '@/api/client'; // Import Pipa API

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    // Menembak endpoint login ke server
    const response = await API.login({
      username: username.value,
      password: password.value
    });

    // Asumsi server mengembalikan data user dan token
    // response.data format: { user: {...}, token: "..." }
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);

    // Redirect berdasarkan role dari server
    router.push(`/${response.data.user.role}`);
    
  } catch (error) {
    // Jika user/pass salah atau server mati
    errorMessage.value = error.response?.data?.message || 'Koneksi ke server gagal!';
  }
};
</script>