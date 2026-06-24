<template>
  <div class="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800 leading-tight">Persetujuan Manajer</h2>
      <p class="text-xs text-slate-500 font-medium">Review dan verifikasi permohonan dinas perjalanan operasional kantor.</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-5 rounded-lg border border-slate-200/80 shadow-flat flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Menunggu Verifikasi</p>
          <h3 class="text-2xl font-extrabold text-slate-800">{{ kpis.pending }}</h3>
        </div>
        <div class="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl flex items-center justify-center font-bold text-lg">
          ⏳
        </div>
      </div>

      <div class="bg-white p-5 rounded-lg border border-slate-200/80 shadow-flat flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Disetujui Bulan Ini</p>
          <h3 class="text-2xl font-extrabold text-slate-800">{{ kpis.approved }}</h3>
        </div>
        <div class="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center font-bold text-lg">
          ✓
        </div>
      </div>

      <div class="bg-white p-5 rounded-lg border border-slate-200/80 shadow-flat flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pengajuan Ditolak</p>
          <h3 class="text-2xl font-extrabold text-slate-800">{{ kpis.rejected }}</h3>
        </div>
        <div class="w-10 h-10 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center justify-center font-bold text-lg">
          ✕
        </div>
      </div>
    </div>

    <!-- Fleet Capacity Context Card -->
    <div class="bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Kapasitas Armada</h4>
          <p class="text-sm font-bold text-slate-800">Utilisasi Kendaraan Operasional Saat Ini</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-slate-800">
            {{ fleet.used }} dari {{ fleet.total }} Mobil Aktif
          </span>
          <span class="text-[10px] text-slate-400 font-semibold ml-2">
            ({{ utilizationRate }}% Terpakai)
          </span>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-200/20">
        <div 
          class="bg-[#0d4d44] h-full rounded-full transition-all duration-500" 
          :style="{ width: `${utilizationRate}%` }"
        ></div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-50 text-xs">
        <div>
          <span class="text-slate-400 font-semibold">Tersedia:</span>
          <span class="font-bold text-[#0d4d44] ml-1.5">{{ fleet.available }} Mobil</span>
        </div>
        <div>
          <span class="text-slate-400 font-semibold">Sedang Jalan:</span>
          <span class="font-bold text-slate-800 ml-1.5">{{ fleet.used }} Mobil</span>
        </div>
      </div>
    </div>

    <!-- Tables Grid -->
    <div class="grid grid-cols-1 gap-8">
      <!-- Pending Requests Queue -->
      <div class="bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
            Antrean Persetujuan Pending
          </h3>
          <span class="bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
            {{ pendingRequests.length }} Menunggu
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-3 px-4">ID & Pemohon</th>
                <th class="py-3 px-4">Tujuan & Keterangan</th>
                <th class="py-3 px-4">Durasi</th>
                <th class="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              <tr v-for="req in pendingRequests" :key="req.id" class="hover:bg-slate-50/40 transition-colors">
                <td class="py-4 px-4">
                  <p class="font-bold text-slate-900">#{{ req.id }}</p>
                  <p class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ req.pelanggan }}</p>
                </td>
                <td class="py-4 px-4">
                  <p class="font-bold text-slate-800">{{ getDestination(req.tujuan) }}</p>
                  <p class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ getPurposeDate(req.tujuan) }}</p>
                </td>
                <td class="py-4 px-4 font-semibold">{{ req.durasi }} Hari</td>
                <td class="py-4 px-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button 
                      @click="handleAction(req.id, 'approved')" 
                      class="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-[#0d4d44] hover:text-white rounded-lg text-[10px] font-bold transition-premium cursor-pointer"
                    >
                      Setujui
                    </button>
                    <button 
                      @click="handleAction(req.id, 'rejected')" 
                      class="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 hover:bg-red-600 hover:text-white rounded-lg text-[10px] font-bold transition-premium cursor-pointer"
                    >
                      Tolak
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="pendingRequests.length === 0">
                <td colspan="4" class="py-12 text-center text-slate-400 font-semibold">Semua antrean pengajuan selesai diselesaikan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Request Logs / History -->
      <div class="bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
          <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
          Histori Log Seluruh Pengajuan
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Karyawan</th>
                <th class="py-3 px-4">Tujuan Perjalanan</th>
                <th class="py-3 px-4 text-center">Status Manager</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              <tr v-for="item in allRequests" :key="item.id" class="hover:bg-slate-50/40 transition-colors">
                <td class="py-3.5 px-4 font-bold text-slate-900">REQ-{{ item.id }}</td>
                <td class="py-3.5 px-4 font-semibold text-slate-700">{{ item.pelanggan }}</td>
                <td class="py-3.5 px-4 font-medium text-slate-600">{{ item.tujuan }}</td>
                <td class="py-3.5 px-4 text-center">
                  <span 
                    :class="getStatusBadgeClass(item.status)" 
                    class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="allRequests.length === 0">
                <td colspan="4" class="py-12 text-center text-slate-400 font-medium">Belum ada data perjalanan dalam sistem.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { API } from '@/api/client';

const pendingRequests = ref([]);
const allRequests = ref([]);
const driversList = ref([]);

const kpis = reactive({ pending: 0, approved: 0, rejected: 0 });
const fleet = reactive({ total: 0, used: 0, available: 0 });

const utilizationRate = computed(() => {
  if (fleet.total === 0) return 0;
  return Math.round((fleet.used / fleet.total) * 100);
});

const loadDashboardData = async () => {
  try {
    const [pendingRes, allRes, driversRes] = await Promise.all([
      API.getPendingBookings(),
      API.getAllBookings(),
      API.getDrivers()
    ]);
    
    pendingRequests.value = pendingRes.data;
    allRequests.value = allRes.data;
    driversList.value = driversRes.data;

    // Calculate KPIs
    kpis.pending = pendingRequests.value.length;
    kpis.approved = allRequests.value.filter(r => r.status === 'disetujui' || r.status === 'approved').length;
    kpis.rejected = allRequests.value.filter(r => r.status === 'ditolak' || r.status === 'rejected').length;

    // Calculate Fleet Capacity
    fleet.total = driversList.value.length;
    fleet.used = driversList.value.filter(d => d.car_status === 'dipakai').length;
    fleet.available = driversList.value.filter(d => d.car_status === 'tersedia').length;
  } catch (error) {
    console.error("Gagal memuat data manager:", error);
  }
};

const handleAction = async (id, status) => {
  try {
    await API.updateBookingStatus(id, status);
    
    // Update local state arrays
    pendingRequests.value = pendingRequests.value.filter(item => item.id !== id);
    
    // Reload database metrics
    loadDashboardData();
  } catch (error) {
    alert("Gagal memperbarui status pengajuan.");
  }
};

// Utilities
const getDestination = (tujuanStr) => {
  if (!tujuanStr) return '-';
  return tujuanStr.split(' - ')[0];
};

const getPurposeDate = (tujuanStr) => {
  if (!tujuanStr) return '';
  const parts = tujuanStr.split(' - ');
  if (parts.length > 1) return parts[1];
  return '';
};

const getStatusBadgeClass = (status) => {
  const norm = status ? status.toLowerCase() : '';
  if (norm === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (norm === 'disetujui' || norm === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (norm === 'ditolak' || norm === 'rejected') return 'bg-red-50 text-red-700 border-red-100';
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

onMounted(loadDashboardData);
</script>