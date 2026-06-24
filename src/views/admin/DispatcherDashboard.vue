<template>
  <div class="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800 leading-tight">Penugasan & Kontrol Armada</h2>
      <p class="text-xs text-slate-500 font-medium">Dispatcher Hub: Penugasan driver, pelacakan real-time, dan penutupan tugas.</p>
    </div>

    <!-- Active Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Penugasan Driver Form -->
      <div class="lg:col-span-1 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat h-fit">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
          <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
          Terbitkan Surat Tugas
        </h3>

        <form @submit.prevent="submitSuratTugas" class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Pengajuan Perjalanan</label>
            <select 
              v-model="form.booking_id" 
              required 
              class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold"
            >
              <option value="" disabled>-- Pilih Booking Disetujui --</option>
              <option v-for="b in readyBookings" :key="b.id" :value="b.id">
                REQ-{{ b.id }} ({{ b.pelanggan }}) - {{ getDestinationName(b.tujuan) }}
              </option>
            </select>
            <p v-if="readyBookings.length === 0" class="text-[10px] text-amber-600 mt-1 font-semibold">
              * Tidak ada pengajuan disetujui yang menunggu armada
            </p>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Supir & Armada</label>
            <select 
              v-model="form.driver_id" 
              required 
              class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold"
            >
              <option value="" disabled>-- Pilih Armada Tersedia --</option>
              <option 
                v-for="d in drivers" 
                :key="d.id" 
                :value="d.id"
                :disabled="d.car_status === 'dipakai'"
              >
                {{ d.nama }} - {{ d.kendaraan }} [{{ d.plat }}] 
                {{ d.car_status === 'dipakai' ? '(Sibuk)' : '(Tersedia)' }}
              </option>
            </select>
          </div>

          <button 
            type="submit" 
            :disabled="readyBookings.length === 0"
            class="w-full py-2.5 bg-[#0d4d44] hover:bg-[#08352f] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-premium shadow-flat hover:shadow-lg text-xs cursor-pointer mt-2"
          >
            Kirim Surat Tugas & Jalan
          </button>
        </form>
      </div>

      <!-- Liquidation (Persekot) Cash Advance List -->
      <div class="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
          <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
          Pencairan Dana Uang Muka (Persekot)
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-3 px-4">Tugas ID</th>
                <th class="py-3 px-4">Driver</th>
                <th class="py-3 px-4">Tujuan</th>
                <th class="py-3 px-4">Nominal</th>
                <th class="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              <tr v-for="p in pendingPersekot" :key="p.id" class="hover:bg-slate-50/40 transition-colors">
                <td class="py-4 px-4 font-bold text-[#0d4d44]">ST-{{ p.surat_tugas_id }}</td>
                <td class="py-4 px-4 font-semibold">{{ p.driver }}</td>
                <td class="py-4 px-4">{{ getDestinationName(p.tujuan) }}</td>
                <td class="py-4 px-4 font-bold">Rp {{ formatNumber(p.nominal_persekot) }}</td>
                <td class="py-4 px-4 text-center">
                  <button 
                    @click="liquidatePersekot(p.id)"
                    class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-[#0d4d44] hover:text-white rounded-lg text-[10px] font-bold transition-premium cursor-pointer"
                  >
                    Cairkan
                  </button>
                </td>
              </tr>
              <tr v-if="pendingPersekot.length === 0">
                <td colspan="5" class="py-8 text-center text-slate-400 font-medium">Tidak ada pengajuan persekot pending.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Active Tasks Monitoring / Real-time Status Tracker -->
    <div class="bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
      <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
        <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
        Monitoring Perjalanan & Tanda Tugas Aktif
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th class="py-3 px-4">Surat ID</th>
              <th class="py-3 px-4">Driver & Mobil</th>
              <th class="py-3 px-4">Tujuan / Peminjam</th>
              <th class="py-3 px-4">Uang Muka</th>
              <th class="py-3 px-4">Status Jalan</th>
              <th class="py-3 px-4 text-center">Aksi Penutupan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-slate-700">
            <tr v-for="t in activeTasks" :key="t.id" class="hover:bg-slate-50/40 transition-colors">
              <td class="py-4 px-4 font-bold text-slate-900">ST-{{ t.id }}</td>
              <td class="py-4 px-4">
                <p class="font-bold text-slate-800">{{ t.driver }}</p>
                <p class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ t.mobil }} [{{ t.plat }}]</p>
              </td>
              <td class="py-4 px-4">
                <p class="font-semibold text-slate-800">{{ getDestinationName(t.tujuan) }}</p>
                <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Oleh: {{ t.pelanggan }}</p>
              </td>
              <td class="py-4 px-4">
                <div v-if="t.nominal_persekot">
                  <p class="font-bold text-slate-700">Rp {{ formatNumber(t.nominal_persekot) }}</p>
                  <span 
                    :class="t.status_persekot === 'cair' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'"
                    class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border mt-0.5"
                  >
                    {{ t.status_persekot === 'cair' ? 'Cair' : 'Menunggu' }}
                  </span>
                </div>
                <span v-else class="text-slate-400 font-semibold">-</span>
              </td>
              <td class="py-4 px-4">
                <span 
                  :class="getStatusBadgeClass(t.status_tugas)"
                  class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border"
                >
                  {{ displayTaskStatus(t.status_tugas) }}
                </span>
              </td>
              <td class="py-4 px-4 text-center">
                <!-- Close Tanda Tugas / Trip closure action -->
                <button 
                  @click="closeTugas(t.id)"
                  :disabled="t.status_tugas !== 'selesai' && t.status_tugas !== 'menunggu_acc'"
                  class="px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-[#0d4d44] hover:text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-150 disabled:cursor-not-allowed rounded-lg text-[10px] font-bold transition-premium cursor-pointer"
                  title="Tutup Tugas & Bebaskan Mobil"
                >
                  ACC Selesai
                </button>
              </td>
            </tr>
            <tr v-if="activeTasks.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-400 font-medium">Tidak ada supir / kendaraan yang bertugas saat ini.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { API } from '@/api/client';
import { useRoleStore } from '@/stores/roleStore';

const store = useRoleStore();

const form = reactive({ booking_id: '', driver_id: '' });
const readyBookings = ref([]);
const drivers = ref([]);
const activeTasks = ref([]);
const pendingPersekot = ref([]);

const loadData = async () => {
  try {
    const [bookingsRes, driversRes, activeTasksRes, persekotRes] = await Promise.all([
      API.getReadyToAssign(),
      API.getDrivers(),
      API.getActiveTasks(),
      API.getPendingPersekot()
    ]);
    
    readyBookings.value = bookingsRes.data;
    drivers.value = driversRes.data;
    activeTasks.value = activeTasksRes.data;
    pendingPersekot.value = persekotRes.data;
  } catch (error) {
    console.error("Gagal memuat data dispatcher:", error);
  }
};

const submitSuratTugas = async () => {
  try {
    const res = await API.postSuratTugas(form);
    store.addNotification({ title: `Surat Tugas diterbitkan untuk REQ-${form.booking_id}` });
    alert('Sukses! Surat tugas berhasil diterbitkan ke Driver.');
    form.booking_id = '';
    form.driver_id = '';
    loadData();
  } catch (error) {
    alert("Gagal menerbitkan surat tugas.");
  }
};

const liquidatePersekot = async (id) => {
  try {
    await API.cairkanPersekot(id);
    store.addNotification({ title: `Dana persekot pengajuan #${id} cair` });
    alert('Dana persekot berhasil dicairkan.');
    loadData();
  } catch (error) {
    alert("Gagal mencairkan persekot.");
  }
};

const closeTugas = async (id) => {
  try {
    await API.closeTask(id);
    store.addNotification({ title: `Tugas ST-${id} ditutup, mobil dirilis` });
    alert('Sukses! Tanda tugas berhasil di-ACC (ditutup). Mobil operasional dirilis.');
    loadData();
  } catch (error) {
    alert("Gagal menutup tanda tugas.");
  }
};

// Utilities
const getDestinationName = (tujuanStr) => {
  if (!tujuanStr) return '-';
  return tujuanStr.split(' - ')[0];
};

const formatNumber = (num) => {
  if (!num) return '0';
  return Number(num).toLocaleString('id-ID');
};

const displayTaskStatus = (status) => {
  const norm = status ? status.toLowerCase() : '';
  if (norm === 'ditugaskan') return 'Ditugaskan';
  if (norm === 'menuju_lokasi') return 'Menuju Lokasi';
  if (norm === 'sedang_berjalan') return 'Sedang Jalan';
  if (norm === 'menunggu_acc') return 'Menunggu ACC';
  if (norm === 'selesai') return 'Selesai';
  return status;
};

const getStatusBadgeClass = (status) => {
  const norm = status ? status.toLowerCase() : '';
  if (norm === 'ditugaskan') return 'bg-slate-50 text-slate-500 border-slate-200/50';
  if (norm === 'menuju_lokasi') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (norm === 'sedang_berjalan') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (norm === 'menunggu_acc') return 'bg-purple-50 text-purple-700 border-purple-100';
  if (norm === 'selesai') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

onMounted(loadData);
</script>
