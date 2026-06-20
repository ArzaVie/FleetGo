<template>
  <div class="min-h-screen bg-slate-50 p-6 md:p-10">
    <div class="max-w-3xl mx-auto">
      <Navbar />

      <div class="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Terbitkan Surat Tugas 🖨️</h2>
        <p class="text-slate-500 text-sm mb-8">Pilih request yang sudah disetujui dan tugaskan ke armada.</p>
        
        <form @submit.prevent="submitSurat" class="space-y-6">
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-5">
            
            <!-- Booking Dinamis -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Booking (Disetujui)</label>
              <select v-model="form.booking_id" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option value="" disabled>-- Pilih Request Booking --</option>
                <option v-for="b in bookings" :key="b.id" :value="b.id">
                  REQ-{{ b.id }} ({{ b.pelanggan }}) - {{ b.tujuan }}
                </option>
              </select>
            </div>

            <!-- Driver Dinamis -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Pilih Armada & Driver</label>
              <select v-model="form.driver_id" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option value="" disabled>-- Pilih Armada Tersedia --</option>
                <option v-for="d in drivers" :key="d.id" :value="d.id">
                  {{ d.nama }} - {{ d.kendaraan }} ({{ d.plat }})
                </option>
              </select>
            </div>
          </div>

          <button type="submit" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-300">
            Buat Surat Tugas & Notifikasi Driver
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { API } from '@/api/client'; // Import Pipa API kita
import Navbar from '@/components/navbar.vue';

const form = reactive({ booking_id: '', driver_id: '' });
const bookings = ref([]); // Data booking dari server
const drivers = ref([]);  // Data driver dari server

// Ambil data saat halaman pertama dibuka
onMounted(async () => {
  try {
    // Anggap kita punya endpoint ini di client.js
    const [bookingRes, driverRes] = await Promise.all([
      API.getReadyToAssign(), 
      API.getDrivers() 
    ]);
    bookings.value = bookingRes.data;
    drivers.value = driverRes.data;
  } catch (error) {
    console.error("Gagal memuat data:", error);
  }
});

const submitSurat = async () => {
  try {
    await API.postSuratTugas(form);
    alert(`Sukses! Surat tugas berhasil diterbitkan.`);
    form.booking_id = '';
    form.driver_id = '';
  } catch (error) {
    alert("Gagal menerbitkan surat tugas.");
  }
};
</script>