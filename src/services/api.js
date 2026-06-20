// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Sesuai port di index.js BE
});

export default {
  createBooking(userId, tujuan) {
    return API.post('/bookings', { user_id: userId, tujuan });
  },
  approveBooking(bookingId, statusApprover) {
    return API.put(`/bookings/${bookingId}/approve`, { status_approver: statusApprover });
  },
  createSuratTugas(bookingId, adminId, driverId, carId) {
    return API.post('/surat-tugas', {
      booking_id: bookingId, admin_id: adminId, driver_id: driverId, car_id: carId
    });
  },
  ajukanPersekot(suratTugasId, nominalPersekot) {
    return API.post('/keuangan/persekot', {
      surat_tugas_id: suratTugasId, nominal_persekot: nominalPersekot
    });
  },
  submitPelunasan(keuanganId, nominalPengeluaran, fileBukti) {
    return API.put(`/keuangan/pelunasan/${keuanganId}`, {
      nominal_pengeluaran: nominalPengeluaran, file_bukti_pengeluaran: fileBukti
    });
  }
};