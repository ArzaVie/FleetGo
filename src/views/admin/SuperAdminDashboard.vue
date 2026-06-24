<template>
  <div class="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800 leading-tight">Super Admin: Pemeliharaan & Akses</h2>
      <p class="text-xs text-slate-500 font-medium">Panel Administrasi: Manajemen role, peninjauan log sistem, dan pembersihan basis data.</p>
    </div>

    <!-- Top Grid: Role Management & Purge Data -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Role Management Table -->
      <div class="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
          <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
          Manajemen Hak Akses Pengguna
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-3 px-4">Nama & Email</th>
                <th class="py-3 px-4">Role Saat Ini</th>
                <th class="py-3 px-4 text-center">Ganti Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50/40 transition-colors">
                <td class="py-3 px-4">
                  <p class="font-bold text-slate-800">{{ u.nama }}</p>
                  <p class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ u.email }}</p>
                </td>
                <td class="py-3 px-4">
                  <span 
                    :class="getRoleBadgeClass(u.role)" 
                    class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border"
                  >
                    {{ u.role }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <select 
                    v-model="u.newRole" 
                    @change="updateRole(u.id, u.newRole)"
                    class="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-[10px] font-bold"
                  >
                    <option value="user">Requester</option>
                    <option value="approver">Approver</option>
                    <option value="dispatcher">GS Dispatcher</option>
                    <option value="driver">Driver</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Database Purge Tool -->
      <div class="lg:col-span-1 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat flex flex-col justify-between h-fit">
        <div>
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span class="w-1.5 h-3 bg-red-600 rounded-full animate-pulse"></span>
            Pemeliharaan Basis Data
          </h3>
          <p class="text-xs text-slate-500 font-semibold leading-relaxed">
            Hapus seluruh data transaksi surat tugas, checkpoints, dan catatan keuangan operasional yang status perjalanannya sudah dinyatakan selesai (Lunas).
          </p>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-50">
          <button 
            @click="triggerPurge"
            class="w-full py-2.5 bg-red-50 text-red-600 border border-red-200/50 hover:bg-red-600 hover:text-white font-bold rounded-lg text-xs cursor-pointer transition-premium flex items-center justify-center gap-2"
          >
            🗑️ Bersihkan Data Lama
          </button>
        </div>
      </div>
    </div>

    <!-- Audit Logs -->
    <div class="bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
      <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
        <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
        Log Audit Sistem (Sistem Audit Trail)
      </h3>

      <div class="overflow-y-auto max-h-96">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider sticky top-0 bg-white">
              <th class="py-3 px-4">Waktu</th>
              <th class="py-3 px-4">Pengguna</th>
              <th class="py-3 px-4">Aktivitas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-slate-600">
            <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-slate-50/30 transition-colors">
              <td class="py-3 px-4 font-semibold text-slate-400">{{ formatTimestamp(log.timestamp) }}</td>
              <td class="py-3 px-4 font-bold text-slate-800">{{ log.user_name }}</td>
              <td class="py-3 px-4 font-medium text-slate-700">{{ log.action }}</td>
            </tr>
            <tr v-if="auditLogs.length === 0">
              <td colspan="3" class="py-12 text-center text-slate-400 font-semibold">Tidak ada log aktivitas terdeteksi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Success Modal Dialog for Purging -->
    <div 
      v-if="showSuccessModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div class="bg-white rounded-lg border border-slate-200/80 shadow-premium p-6 max-w-sm w-full text-center space-y-4">
        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-xl">
          🎉
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-800">Pembersihan Selesai</h4>
          <p class="text-xs text-slate-400 font-medium mt-1">Data surat tugas operasional yang sudah selesai dibersihkan dengan sukses.</p>
        </div>
        <button 
          @click="showSuccessModal = false"
          class="w-full py-2 bg-[#0d4d44] hover:bg-[#08352f] text-white font-bold rounded-lg text-xs cursor-pointer transition-premium"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API } from '@/api/client';
import { useRoleStore } from '@/stores/roleStore';

const store = useRoleStore();
const users = ref([]);
const auditLogs = ref([]);
const showSuccessModal = ref(false);

const loadData = async () => {
  try {
    const [usersRes, logsRes] = await Promise.all([
      API.getUsers(),
      API.getAuditLogs()
    ]);
    
    // Map response and inject dynamic newRole tracker
    users.value = usersRes.data.map(u => ({ ...u, newRole: u.role }));
    auditLogs.value = logsRes.data;
  } catch (error) {
    console.error("Gagal memuat data super admin:", error);
  }
};

const updateRole = async (id, newRole) => {
  try {
    await API.updateUserRole(id, newRole);
    alert('Sukses! Hak akses pengguna berhasil diubah.');
    loadData();
  } catch (error) {
    alert("Gagal mengubah role pengguna.");
  }
};

const triggerPurge = async () => {
  if (!confirm("Apakah Anda yakin ingin menghapus data lama? Tindakan ini permanen.")) return;
  try {
    await API.purgeData();
    showSuccessModal.value = true;
    loadData();
  } catch (error) {
    alert("Gagal menghapus data lama.");
  }
};

// Utilities
const formatTimestamp = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getRoleBadgeClass = (role) => {
  const norm = role ? role.toLowerCase() : '';
  if (norm === 'superadmin') return 'bg-red-50 text-red-700 border-red-100';
  if (norm === 'dispatcher' || norm === 'admin') return 'bg-purple-50 text-purple-700 border-purple-100';
  if (norm === 'approver') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (norm === 'driver') return 'bg-blue-50 text-blue-700 border-blue-100';
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

onMounted(loadData);
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
