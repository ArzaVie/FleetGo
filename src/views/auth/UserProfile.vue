<template>
  <div class="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800 leading-tight">Profil Pengguna</h2>
      <p class="text-xs text-slate-500 font-medium">Kelola data pribadi Anda, sesuaikan nama tampilan dan foto profil.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Left: Profile Preview Card -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat flex flex-col items-center text-center space-y-4">
        <!-- Avatar Container -->
        <div class="relative">
          <div 
            v-if="store.user?.foto"
            class="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-50 shadow-flat flex items-center justify-center bg-slate-100"
          >
            <span v-if="isEmoji(store.user.foto)" class="text-4xl">{{ store.user.foto }}</span>
            <img v-else :src="store.user.foto" class="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div 
            v-else
            class="w-24 h-24 bg-[#0d4d44] text-white border-4 border-emerald-50 rounded-full flex items-center justify-center font-extrabold text-3xl shadow-flat"
          >
            {{ avatarInitials }}
          </div>
        </div>
        
        <div>
          <h3 class="text-base font-extrabold text-slate-800">{{ store.user?.nama || 'Guest' }}</h3>
          <p class="text-xs text-slate-400 font-semibold mt-0.5">{{ store.user?.email }}</p>
        </div>

        <span class="bg-emerald-50 text-[#0d4d44] border border-emerald-100 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
          {{ displayRoleName }}
        </span>
      </div>

      <!-- Right: Edit Form Card -->
      <div class="md:col-span-2 bg-white p-6 rounded-lg border border-slate-200/80 shadow-flat space-y-6">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span class="w-1.5 h-3 bg-[#0d4d44] rounded-full"></span>
          Ubah Profil Saya
        </h3>

        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- Nama Input -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
            <input 
              v-model="profileForm.nama" 
              type="text" 
              placeholder="Nama Lengkap" 
              required 
              class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-semibold" 
            />
          </div>

          <!-- Avatar Preset Selector -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Foto / Avatar Profil</label>
            
            <div class="grid grid-cols-6 gap-3 mb-4">
              <button 
                type="button"
                v-for="preset in avatarPresets" 
                :key="preset.value"
                @click="selectPreset(preset.value)"
                class="h-12 rounded-lg border flex items-center justify-center text-2xl transition-all hover:bg-slate-50 cursor-pointer"
                :class="profileForm.foto === preset.value ? 'border-[#0d4d44] bg-emerald-50/50 scale-105 ring-1 ring-[#0d4d44]' : 'border-slate-200 bg-white'"
                :title="preset.label"
              >
                {{ preset.value }}
              </button>
            </div>

            <!-- Custom URL Input -->
            <div>
              <span class="block text-[10px] text-slate-400 font-bold mb-1.5">Atau masukkan URL gambar kustom:</span>
              <input 
                v-model="customAvatarUrl" 
                type="url" 
                placeholder="https://example.com/avatar.jpg" 
                @input="applyCustomUrl"
                class="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-[#0d4d44] focus:ring-1 focus:ring-[#0d4d44] outline-none text-xs font-medium" 
              />
            </div>
          </div>

          <div v-if="successMessage" class="text-emerald-700 text-xs font-bold bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-100/50">
            {{ successMessage }}
          </div>

          <button 
            type="submit" 
            class="px-4 py-2.5 bg-[#0d4d44] hover:bg-[#08352f] text-white font-bold rounded-lg text-xs transition-premium shadow-flat hover:shadow-lg cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoleStore } from '@/stores/roleStore';
import { API } from '@/api/client';

const store = useRoleStore();
const successMessage = ref('');
const customAvatarUrl = ref('');

const profileForm = reactive({
  nama: '',
  foto: ''
});

// Beautiful preset avatars (using representative emojis for ease of rendering & no dead links)
const avatarPresets = [
  { value: '🧑‍💼', label: 'Eksekutif Pria' },
  { value: '👩‍💼', label: 'Eksekutif Wanita' },
  { value: '👨‍✈️', label: 'Supir Armada' },
  { value: '👩‍💻', label: 'Admin Logistik Wanita' },
  { value: '👨‍💻', label: 'Admin Logistik Pria' },
  { value: '👤', label: 'Silhouette' }
];

const loadProfile = () => {
  if (store.user) {
    profileForm.nama = store.user.nama;
    profileForm.foto = store.user.foto || '';
    
    // If current foto is not one of the emoji presets, set custom URL textbox
    const presetValues = avatarPresets.map(p => p.value);
    if (store.user.foto && !presetValues.includes(store.user.foto)) {
      customAvatarUrl.value = store.user.foto;
    } else {
      customAvatarUrl.value = '';
    }
  }
};

const selectPreset = (val) => {
  profileForm.foto = val;
  customAvatarUrl.value = ''; // clear custom URL
};

const applyCustomUrl = () => {
  profileForm.foto = customAvatarUrl.value;
};

const isEmoji = (val) => {
  if (!val) return false;
  // Simple check for emoji character bounds
  return val.length <= 4; 
};

const saveProfile = async () => {
  successMessage.value = '';
  try {
    const res = await API.updateProfile({
      nama: profileForm.nama,
      foto: profileForm.foto
    });
    
    // Update local store state
    store.setUser(res.data.user);
    
    successMessage.value = 'Profil Anda berhasil diperbarui!';
    setTimeout(() => {
      successMessage.value = '';
    }, 4000);
  } catch (error) {
    alert('Gagal memperbarui profil: ' + (error.response?.data?.error || error.message));
  }
};

// Utilities
const avatarInitials = computed(() => {
  const name = store.user?.nama || 'G';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
});

const displayRoleName = computed(() => {
  const currentRole = store.user?.role;
  if (currentRole === 'user') return 'Requester / Pelanggan';
  if (currentRole === 'approver') return 'Manager Approver';
  if (currentRole === 'dispatcher') return 'GS Dispatcher';
  if (currentRole === 'superadmin') return 'Super Admin';
  if (currentRole === 'driver') return 'Driver';
  return currentRole;
});

onMounted(loadProfile);
</script>
