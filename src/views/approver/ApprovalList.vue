<template>
  <div class="min-h-screen bg-slate-50 p-6 md:p-10">
    <div class="max-w-5xl mx-auto">
      <Navbar />

      <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-slate-800">Antrean Persetujuan 📝</h2>
          <!-- Menampilkan jumlah data dinamis -->
          <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {{ pendingRequests.length }} Menunggu
          </span>
        </div>
        
        <div class="overflow-hidden border border-slate-100 rounded-2xl">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th class="py-4 px-6">ID & Pelanggan</th>
                <th class="py-4 px-6">Detail Perjalanan</th>
                <th class="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="req in pendingRequests" :key="req.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="py-4 px-6">
                  <p class="font-bold text-slate-900">#{{ req.id }}</p>
                  <p class="text-slate-500 mt-0.5">{{ req.pelanggan }}</p>
                </td>
                <td class="py-4 px-6">
                  <p class="font-semibold text-slate-800">{{ req.tujuan }}</p>
                  <p class="text-slate-500 mt-0.5">{{ req.durasi }} Hari</p>
                </td>
                <td class="py-4 px-6 flex justify-center gap-3">
                  <button @click="handleAction(req.id, 'approved')" class="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl text-sm font-bold transition-all duration-200">
                    Setujui
                  </button>
                  <button @click="handleAction(req.id, 'rejected')" class="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all duration-200">
                    Tolak
                  </button>
                </td>
              </tr>
              <tr v-if="pendingRequests.length === 0">
                <td colspan="3" class="py-12 text-center text-slate-400 font-medium">Semua antrean sudah diselesaikan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API } from '@/api/client'; // Import Pipa API
import Navbar from '../../components/navbar.vue';

const pendingRequests = ref([]);

// Fungsi untuk mengambil data dari server saat halaman dimuat
const loadRequests = async () => {
  try {
    const response = await API.getPendingBookings();
    pendingRequests.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
};

// Fungsi untuk update status ke server
const handleAction = async (id, status) => {
  try {
    await API.updateBookingStatus(id, status);
    // Hapus dari list di tampilan setelah sukses update di database
    pendingRequests.value = pendingRequests.value.filter(item => item.id !== id);
  } catch (error) {
    alert("Gagal melakukan aksi. Silakan coba lagi.");
  }
};

onMounted(loadRequests);
</script>