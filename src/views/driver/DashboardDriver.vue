<template>
  <div class="min-h-screen bg-slate-50 p-6 md:p-10">
    <div class="max-w-4xl mx-auto">
      <Navbar />

      <!-- Loading state atau Tampilan Tugas -->
      <div v-if="task" class="space-y-6">
        
        <!-- Info Tugas Aktif Dinamis -->
        <div class="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <h2 class="text-2xl font-bold">{{ task.tujuan }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-white/20">
            <div>
              <p class="text-emerald-100 text-xs uppercase tracking-wider mb-1">ID Surat</p>
              <p class="font-bold text-lg">{{ task.id_surat }}</p>
            </div>
            <div>
              <p class="text-emerald-100 text-xs uppercase tracking-wider mb-1">Status</p>
              <p class="font-bold text-lg">{{ task.status }}</p>
            </div>
          </div>
        </div>

        <!-- Form Persekot & Deskripsi -->
        <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 class="text-lg font-bold text-slate-800 mb-6">Ajukan Persekot & Keperluan</h3>
          
          <form @submit.prevent="submitPersekot" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Nominal Persekot (Rp)</label>
              <input 
                v-model="persekot.nominal" 
                type="number" 
                placeholder="Cth: 500000" 
                required 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Penggunaan</label>
              <textarea 
                v-model="persekot.deskripsi" 
                placeholder="Jelaskan uang ini untuk apa saja" 
                required 
                rows="3"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              ></textarea>
            </div>

            <button type="submit" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all">
              Ajukan Persekot
            </button>
          </form>
        </div>
      </div>

      <!-- State kalau tidak ada tugas -->
      <div v-else class="text-center py-20 text-slate-500">
        <p>Tidak ada tugas aktif saat ini.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { API } from '@/api/client'; // Import Pipa API
import Navbar from '../../components/navbar.vue';

const task = ref(null);
const persekot = reactive({ nominal: '', deskripsi: '' });

// 1. Ambil tugas saat halaman dimuat
onMounted(async () => {
  try {
    const res = await API.getMyTask();
    task.value = res.data;
  } catch (error) {
    console.error("Gagal memuat tugas:", error);
  }
});

// 2. Kirim persekot ke backend
const submitPersekot = async () => {
  try {
    await API.postPersekot({
      nominal: persekot.nominal,
      deskripsi: persekot.deskripsi
    });
    alert('Pengajuan dana sukses!');
    persekot.nominal = '';
    persekot.deskripsi = '';
  } catch (error) {
    alert('Gagal mengajukan persekot, coba lagi.');
  }
};
</script>