<template>
  <div class="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800 leading-tight">Dashboard Supir</h2>
      <p class="text-xs text-slate-500 font-medium">Kelola perjalanan aktif, catat checkpoints, dan laporkan operasional keuangan.</p>
    </div>

    <!-- Active Task Display -->
    <div v-if="task" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Task Status Card (Mobile-First Intent) -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-white rounded-lg border border-slate-200/80 shadow-flat p-6 space-y-6">
          <div class="flex justify-between items-start">
            <div>
              <span class="bg-emerald-50 text-[#0d4d44] border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Tugas Aktif ST-{{ task.id_surat }}
              </span>
              <h3 class="text-lg font-bold text-slate-800 mt-2">{{ getDestinationName(task.tujuan) }}</h3>
              <p class="text-xs text-slate-500 font-semibold mt-0.5">{{ getPurposeDate(task.tujuan) }}</p>
            </div>
            
            <span 
              :class="getStatusBadgeClass(task.status)"
              class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border"
            >
              {{ displayTaskStatus(task.status) }}
            </span>
          </div>

          <!-- Vehicle Info -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-xs border border-slate-100">
            <div>
              <p class="text-slate-400 font-semibold">Kendaraan Dinas</p>
              <p class="font-bold text-slate-800 mt-0.5">{{ task.mobil }}</p>
            </div>
            <div>
              <p class="text-slate-400 font-semibold">Plat Nomor</p>
              <p class="font-bold text-slate-800 mt-0.5">{{ task.plat }}</p>
            </div>
          </div>

          <!-- High-contrast Large Status Action Buttons -->
          <div class="pt-2">
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Pembaruan Status Perjalanan</h4>
            
            <button 
              v-if="task.status === 'ditugaskan'"
              @click="updateStatus('menuju_lokasi')"
              class="w-full py-4 bg-[#0d4d44] hover:bg-[#08352f] text-white font-extrabold rounded-lg text-sm tracking-wide transition-premium shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              🚗 Menuju Lokasi Penjemputan
            </button>

            <button 
              v-else-if="task.status === 'menuju_lokasi'"
              @click="updateStatus('sedang_berjalan')"
              class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-sm tracking-wide transition-premium shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              🛣️ Mulai Jalan (Perjalanan Operasional)
            </button>

            <button 
              v-else-if="task.status === 'sedang_berjalan'"
              @click="updateStatus('menunggu_acc')"
              class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg text-sm tracking-wide transition-premium shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              🏁 Selesaikan Perjalanan & Ajukan ACC
            </button>

            <div 
              v-else-if="task.status === 'menunggu_acc'"
              class="w-full py-4 bg-slate-100 text-slate-500 font-bold border border-slate-200 rounded-lg text-sm tracking-wide text-center"
            >
              ⏳ Menunggu ACC Tanda Tugas oleh Dispatcher
            </div>
          </div>
        </div>

        <!-- Logging Checkpoints -->
        <div class="bg-white rounded-lg border border-slate-200/80 shadow-flat p-6 space-y-6">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
            Catat Checkpoint & Odometer
          </h3>

          <form @submit.prevent="logCheckpoint" class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div class="sm:col-span-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lokasi Checkpoint</label>
              <input 
                v-model="checkpointForm.location" 
                type="text" 
                placeholder="Cth: Rest Area KM 57" 
                required 
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Odometer (KM)</label>
              <input 
                v-model="checkpointForm.odometer" 
                type="number" 
                placeholder="Cth: 12050" 
                required 
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
              />
            </div>
            <button 
              type="submit" 
              class="py-2.5 bg-[#0d4d44] hover:bg-[#08352f] text-white font-bold rounded-lg text-xs cursor-pointer transition-premium shadow-flat"
            >
              Catat Log
            </button>
          </form>

          <!-- Checkpoint History Timeline -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lini Masa Perjalanan</h4>
            
            <div class="space-y-4 pl-3 relative border-l border-slate-200 ml-1.5">
              <div 
                v-for="cp in checkpoints" 
                :key="cp.timestamp" 
                class="relative pl-4"
              >
                <!-- Dot indicator -->
                <span class="absolute -left-[20px] top-1.5 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white"></span>
                
                <p class="text-xs font-bold text-slate-800">{{ cp.location }}</p>
                <div class="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mt-0.5">
                  <span>Odometer: {{ formatNumber(cp.odometer) }} KM</span>
                  <span>•</span>
                  <span>{{ formatTime(cp.timestamp) }}</span>
                </div>
              </div>

              <div 
                v-if="checkpoints.length === 0"
                class="text-xs text-slate-400 font-medium py-2 pl-2"
              >
                Belum ada checkpoints yang tercatat.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Operations (Uang Muka & Pelunasan) -->
      <div class="space-y-6">
        <!-- Persekot (Cash Advance) Card -->
        <div class="bg-white rounded-lg border border-slate-200/80 shadow-flat p-6 space-y-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
            Uang Muka (Persekot)
          </h3>

          <!-- Form to submit persekot (if not exist) -->
          <form v-if="!task.keuangan_id" @submit.prevent="submitPersekot" class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nominal Pengajuan (Rp)</label>
              <input 
                v-model="persekotForm.nominal" 
                type="number" 
                placeholder="Cth: 500000" 
                required 
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Penggunaan</label>
              <textarea 
                v-model="persekotForm.deskripsi" 
                placeholder="Cth: Bensin tol, uang makan, & parkir Bandung" 
                required 
                rows="2"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
              ></textarea>
            </div>
            <button 
              type="submit" 
              class="w-full py-2 bg-[#0d4d44] hover:bg-[#08352f] text-white font-bold rounded-lg text-xs cursor-pointer transition-premium"
            >
              Ajukan Uang Muka
            </button>
          </form>

          <!-- Display persekot status if submitted -->
          <div v-else class="space-y-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-400 font-semibold">Nominal Uang Muka:</span>
              <span class="font-extrabold text-slate-800">Rp {{ formatNumber(task.nominal_persekot) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 font-semibold">Status Pengajuan:</span>
              <span 
                :class="task.status_persekot === 'cair' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'"
                class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
              >
                {{ task.status_persekot === 'cair' ? 'Cair / Diterima' : 'Menunggu Cair' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pelunasan (Settlement / Real Expenses) Card -->
        <div 
          v-if="task.keuangan_id && task.status_persekot === 'cair'" 
          class="bg-white rounded-lg border border-slate-200/80 shadow-flat p-6 space-y-4"
        >
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
            Pelunasan Operasional
          </h3>

          <!-- Form to submit pelunasan (if not lunas) -->
          <form v-if="task.status_pelunasan !== 'lunas'" @submit.prevent="submitPelunasan" class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Pengeluaran Riel (Rp)</label>
              <input 
                v-model="pelunasanForm.nominal" 
                type="number" 
                placeholder="Cth: 485000" 
                required 
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unggah Bukti Kuitansi (Mock)</label>
              <input 
                type="file" 
                @change="handleFileChange"
                required 
                class="w-full text-xs text-slate-500 font-semibold file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-[#0d4d44] hover:file:bg-slate-200 cursor-pointer" 
              />
            </div>
            <button 
              type="submit" 
              class="w-full py-2 bg-[#0d4d44] hover:bg-[#08352f] text-white font-bold rounded-lg text-xs cursor-pointer transition-premium"
            >
              Laporkan Pelunasan
            </button>
          </form>

          <!-- Display pelunasan details if Lunas -->
          <div v-else class="space-y-3 text-xs bg-emerald-50/50 p-4 rounded-lg border border-emerald-100/50">
            <div class="flex justify-between">
              <span class="text-emerald-800 font-semibold">Dana Terpakai:</span>
              <span class="font-extrabold text-emerald-950">Rp {{ formatNumber(task.nominal_pengeluaran) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-emerald-800 font-semibold">Status Pelunasan:</span>
              <span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                Lunas
              </span>
            </div>
            <div class="pt-2 text-[10px] text-emerald-700/80 font-medium border-t border-emerald-100/50">
              Urusan keuangan selesai. Terima kasih!
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-slate-200/80 rounded-lg p-12 text-center text-slate-500 shadow-flat">
      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-150">
        📭
      </div>
      <p class="font-bold text-slate-800 text-sm">Tidak Ada Tugas Aktif</p>
      <p class="text-xs text-slate-400 font-medium mt-1">Anda saat ini sedang tidak berada dalam penugasan perjalanan dinas.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { API } from '@/api/client';
import { useRoleStore } from '@/stores/roleStore';

const store = useRoleStore();
const task = ref(null);
const checkpoints = ref([]);

const checkpointForm = reactive({ location: '', odometer: '' });
const persekotForm = reactive({ nominal: '', deskripsi: '' });
const pelunasanForm = reactive({ nominal: '', file_bukti: 'receipt_mock.png' });

const loadTask = async () => {
  try {
    const res = await API.getMyTask();
    task.value = res.data;
    if (task.value) {
      const cpRes = await API.getCheckpoints(task.value.id_surat);
      checkpoints.value = cpRes.data;
    }
  } catch (error) {
    console.error("Gagal mengambil tugas driver:", error);
  }
};

const updateStatus = async (newStatus) => {
  try {
    await API.updateTaskStatus(newStatus);
    store.addNotification({ title: `Supir update status ke "${displayTaskStatus(newStatus)}"` });
    loadTask();
  } catch (error) {
    alert("Gagal memperbarui status tugas.");
  }
};

const logCheckpoint = async () => {
  try {
    await API.postCheckpoint({
      location: checkpointForm.location,
      odometer: checkpointForm.odometer
    });
    alert('Log checkpoint berhasil dicatat!');
    checkpointForm.location = '';
    checkpointForm.odometer = '';
    loadTask();
  } catch (error) {
    alert("Gagal mencatat checkpoint.");
  }
};

const submitPersekot = async () => {
  try {
    await API.postPersekot({
      nominal: persekotForm.nominal
    });
    alert('Uang muka (persekot) berhasil diajukan ke admin!');
    persekotForm.nominal = '';
    persekotForm.deskripsi = '';
    loadTask();
  } catch (error) {
    alert("Gagal mengajukan uang muka.");
  }
};

const handleFileChange = (e) => {
  pelunasanForm.file_bukti = e.target.files[0]?.name || 'receipt_mock.png';
};

const submitPelunasan = async () => {
  try {
    await API.submitPelunasan(task.value.keuangan_id, {
      nominal_pengeluaran: pelunasanForm.nominal,
      file_bukti_pengeluaran: pelunasanForm.file_bukti
    });
    alert('Log pelunasan dan bukti pengeluaran berhasil dilaporkan!');
    loadTask();
  } catch (error) {
    alert("Gagal mengirim pelunasan.");
  }
};

// Utilities
const getDestinationName = (tujuanStr) => {
  if (!tujuanStr) return '-';
  return tujuanStr.split(' - ')[0];
};

const getPurposeDate = (tujuanStr) => {
  if (!tujuanStr) return '';
  const parts = tujuanStr.split(' - ');
  if (parts.length > 1) return parts[1];
  return '';
};

const formatNumber = (num) => {
  if (!num) return '0';
  return Number(num).toLocaleString('id-ID');
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const displayTaskStatus = (status) => {
  const norm = status ? status.toLowerCase() : '';
  if (norm === 'ditugaskan') return 'Siap Berangkat';
  if (norm === 'menuju_lokasi') return 'Menuju Penjemputan';
  if (norm === 'sedang_berjalan') return 'Dalam Perjalanan';
  if (norm === 'menunggu_acc') return 'Menunggu ACC';
  return status;
};

const getStatusBadgeClass = (status) => {
  const norm = status ? status.toLowerCase() : '';
  if (norm === 'ditugaskan') return 'bg-slate-50 text-slate-500 border-slate-200';
  if (norm === 'menuju_lokasi') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (norm === 'sedang_berjalan') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (norm === 'menunggu_acc') return 'bg-purple-50 text-purple-700 border-purple-100';
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

onMounted(loadTask);
</script>