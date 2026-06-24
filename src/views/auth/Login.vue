<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
    <!-- Background glow decoration -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-[#0d4d44] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

    <div class="w-full max-w-4xl bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] relative z-10">
      
      <!-- Left Column: Branding & Info (Visible on MD and up) -->
      <div class="md:col-span-5 bg-gradient-to-br from-[#0d4d44] via-[#093d35] to-[#052420] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <!-- Glow circles inside left col -->
        <div class="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full filter blur-2xl"></div>
        <div class="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-400/20 rounded-full filter blur-2xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-black text-lg tracking-wider">FG</span>
            </div>
            <div>
              <span class="text-lg font-black tracking-tight text-white">FleetGo</span>
            </div>
          </div>

          <div class="space-y-4 mt-12">
            <h2 class="text-2xl md:text-3xl font-extrabold leading-tight text-emerald-100">
              Corporate <br/>Fleet Portal
            </h2>
            <p class="text-xs md:text-sm text-emerald-100/70 font-semibold leading-relaxed">
              Portal terpadu untuk pengelolaan dan pemesanan kendaraan dinas operasional perusahaan guna mempermudah pengajuan perjalanan dinas, meningkatkan efisiensi waktu, dan mendukung mobilitas kerja karyawan.
            </p>
          </div>
        </div>


        <div class="text-[10px] text-emerald-200/50 font-semibold mt-8 relative z-10">
          PT. Telemedia Dinamika Sarana &copy; 2026
        </div>
      </div>

      <!-- Right Column: Login Form -->
      <div class="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
        <div class="max-w-md w-full mx-auto space-y-6">
          <div>
            <h3 class="text-xl font-extrabold text-slate-800 tracking-tight">Selamat Datang Kembali</h3>
            <p class="text-xs text-slate-400 font-semibold mt-1">Masuk dengan akun perusahaan yang telah terdaftar.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Username / Email</label>
              <div class="relative">
                <input 
                  v-model="username" 
                  type="text" 
                  placeholder="Cth: user@kantor.com atau Admin Logistik"
                  required 
                  class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none transition-all text-xs font-bold text-slate-700 placeholder:text-slate-400" 
                />
                <span class="absolute right-4 top-3 text-slate-400 text-xs">👤</span>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="password" 
                  type="password" 
                  placeholder="Masukkan password Anda"
                  required 
                  class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none transition-all text-xs font-bold text-slate-700 placeholder:text-slate-400" 
                />
                <span class="absolute right-4 top-3 text-slate-400 text-xs">🔒</span>
              </div>
            </div>

            <div v-if="errorMessage" class="text-red-600 text-xs font-bold bg-red-50/80 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
              <span>⚠️</span>
              <span>{{ errorMessage }}</span>
            </div>

            <button 
              type="submit" 
              class="w-full py-3.5 bg-[#0d4d44] hover:bg-[#08352f] text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-950/10 hover:shadow-lg hover:shadow-emerald-950/20 text-xs cursor-pointer tracking-wider uppercase mt-2 flex items-center justify-center gap-2"
            >
              <span>Masuk ke Akun</span>
              <span>🚀</span>
            </button>
          </form>

          <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-semibold">
            <span>Butuh bantuan akses? Hubungi GS Admin</span>
            <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">v1.1.0</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { API } from '@/api/client';
import { useRoleStore } from '@/stores/roleStore';

const router = useRouter();
const store = useRoleStore();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    const response = await API.login({
      username: username.value,
      password: password.value
    });

    // Save state using Pinia
    store.setUser(response.data.user);
    localStorage.setItem('token', response.data.token);

    // Redirect based on role
    const role = response.data.user.role;
    if (role === 'user') {
      router.push('/pelanggan');
    } else if (role === 'dispatcher' || role === 'superadmin') {
      router.push('/admin');
    } else {
      router.push(`/${role}`);
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Koneksi ke server gagal!';
  }
};
</script>