<template>
  <div class="min-h-screen bg-slate-50 p-6 md:p-10">
    <div class="max-w-6xl mx-auto">
      <Navbar />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
          <h2 class="text-xl font-bold text-slate-800 mb-6">Buat Request 🚗</h2>
          <form @submit.prevent="submitRequest" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Tujuan Perjalanan</label>
              <input v-model="form.tujuan" type="text" placeholder="Cth: Bandung - Rapat Klien" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Durasi (Hari)</label>
              <input v-model="form.durasi" type="number" min="1" placeholder="Cth: 3" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all">
              Kirim Request
            </button>
          </form>
        </div>

        <div class="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 class="text-xl font-bold text-slate-800 mb-6">Riwayat Status</h2>
          <div class="overflow-hidden border border-slate-100 rounded-2xl">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th class="py-4 px-5">ID</th>
                  <th class="py-4 px-5">Tujuan</th>
                  <th class="py-4 px-5">Durasi</th>
                  <th class="py-4 px-5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="item in riwayatRequest" :key="item.id">
                  <td class="py-4 px-5 font-bold">REQ-{{ item.id }}</td>
                  <td class="py-4 px-5">{{ item.tujuan }}</td>
                  <td class="py-4 px-5">{{ item.durasi }} Hari</td>
                  <td class="py-4 px-5">
                    <span :class="getStatusClass(item.status)" class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase ring-1">
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { API } from '@/api/client'; // Pipa API
import Navbar from '../../components/navbar.vue';

const form = reactive({ tujuan: '', durasi: '' });
const riwayatRequest = ref([]);

// 1. Ambil data riwayat dari Server
const fetchRiwayat = async () => {
  try {
    const res = await API.getMyBookings();
    riwayatRequest.value = res.data;
  } catch (e) {
    console.error("Gagal ambil data riwayat");
  }
};

// 2. Submit Request ke Server
const submitRequest = async () => {
  try {
    await API.postBooking(form);
    alert('Request berhasil dikirim!');
    form.tujuan = ''; form.durasi = '';
    fetchRiwayat(); // Refresh data setelah kirim
  } catch (e) {
    alert('Gagal kirim request');
  }
};

// Styling status (Conditional)
const getStatusClass = (status) => {
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700 ring-yellow-600/20';
  if (status === 'disetujui') return 'bg-green-100 text-green-700 ring-green-600/20';
  return 'bg-red-100 text-red-700 ring-red-600/20';
};

onMounted(fetchRiwayat);
</script>