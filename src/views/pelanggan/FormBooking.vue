<template>
  <div class="p-6 md:p-10 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-xl font-bold text-slate-800 leading-tight">Pengajuan Perjalanan</h2>
      <p class="text-xs text-slate-500 font-medium">Buat permohonan peminjaman armada dan supir operasional.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Booking Form -->
      <div class="lg:col-span-1 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat h-fit">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
          <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
          Form Permohonan
        </h3>
        
        <form @submit.prevent="submitRequest" class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kota / Tujuan Perjalanan</label>
            <input 
              v-model="form.destinasi" 
              type="text" 
              placeholder="Cth: Bandung (Kantor Cabang)" 
              required 
              class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Keberangkatan</label>
            <input 
              v-model="form.tanggal" 
              type="date" 
              required 
              class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Durasi Perjalanan (Hari)</label>
            <input 
              v-model="form.durasi" 
              type="number" 
              min="1" 
              placeholder="Cth: 3" 
              required 
              class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keperluan / Keterangan</label>
            <select 
              v-model="form.keperluan" 
              required 
              class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold"
            >
              <option value="" disabled>-- Pilih Kategori Keperluan --</option>
              <option value="Rapat Klien">Rapat Klien / Bisnis</option>
              <option value="Kunjungan Lapangan">Kunjungan Lapangan / Cabang</option>
              <option value="Operational Audit">Operational Audit</option>
              <option value="Pengiriman Logistik">Pengiriman Logistik Cepat</option>
              <option value="Keperluan Direksi">Layanan Direksi</option>
            </select>
          </div>

          <button 
            type="submit" 
            class="w-full py-2.5 bg-[#0d4d44] hover:bg-[#08352f] text-white font-bold rounded-lg transition-premium shadow-flat hover:shadow-lg text-xs cursor-pointer mt-2"
          >
            Kirim Pengajuan
          </button>
        </form>
      </div>

      <!-- Booking History -->
      <div class="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
          <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
          Riwayat Pengajuan
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Detail Perjalanan & Keperluan</th>
                <th class="py-3 px-4">Durasi</th>
                <th class="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              <tr v-for="item in riwayatRequest" :key="item.id" class="hover:bg-slate-50/40 transition-colors">
                <td class="py-4 px-4 font-bold text-slate-900">REQ-{{ item.id }}</td>
                <td class="py-4 px-4">
                  <p class="font-bold text-slate-800">{{ getDestination(item.tujuan) }}</p>
                  <p class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ getPurposeDate(item.tujuan) }}</p>
                </td>
                <td class="py-4 px-4 font-semibold">{{ item.durasi }} Hari</td>
                <td class="py-4 px-4 text-center">
                  <span 
                    :class="getStatusBadgeClass(item.status)" 
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="riwayatRequest.length === 0">
                <td colspan="4" class="py-12 text-center text-slate-400 font-medium">Belum ada riwayat perjalanan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { API } from '@/api/client';

const form = reactive({ destinasi: '', tanggal: '', durasi: '', keperluan: '' });
const riwayatRequest = ref([]);

const fetchRiwayat = async () => {
  try {
    const res = await API.getMyBookings();
    riwayatRequest.value = res.data;
  } catch (e) {
    console.error("Gagal ambil data riwayat", e);
  }
};

const submitRequest = async () => {
  try {
    const payload = {
      tujuan: `${form.destinasi} - ${form.keperluan} (${form.tanggal})`,
      durasi: form.durasi
    };
    await API.postBooking(payload);
    alert('Request permohonan berhasil dikirim!');
    
    // Clear form
    form.destinasi = '';
    form.tanggal = '';
    form.durasi = '';
    form.keperluan = '';
    
    fetchRiwayat();
  } catch (e) {
    alert('Gagal mengirim request permohonan.');
  }
};

// Utilities to parse combined tujuan string
const getDestination = (tujuanStr) => {
  if (!tujuanStr) return '-';
  return tujuanStr.split(' - ')[0];
};

const getPurposeDate = (tujuanStr) => {
  if (!tujuanStr) return '';
  const parts = tujuanStr.split(' - ');
  if (parts.length > 1) {
    return parts[1];
  }
  return '';
};

// Style badges according to Emerald Executive System
const getStatusBadgeClass = (status) => {
  const norm = status ? status.toLowerCase() : '';
  if (norm === 'pending') {
    return 'bg-amber-50 text-amber-700 border-amber-100';
  }
  if (norm === 'disetujui' || norm === 'approved') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  }
  if (norm === 'ditolak' || norm === 'rejected') {
    return 'bg-red-50 text-red-700 border-red-100';
  }
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

onMounted(fetchRiwayat);
</script>