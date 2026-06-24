<template>
  <div 
    v-if="store.user?.role === 'superadmin'"
    class="bg-emerald-50/80 border-b border-emerald-100/50 px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs backdrop-blur-sm z-20"
  >
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <p class="font-semibold text-[#0d4d44]">
        Master Access Preview: <span class="uppercase font-bold text-emerald-800">{{ store.activeRole }} View</span>
      </p>
    </div>

    <!-- Switch Buttons -->
    <div class="flex items-center gap-1.5 flex-wrap">
      <button 
        @click="setRole('user')"
        class="px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer"
        :class="store.previewRole === 'user' ? 'bg-[#0d4d44] text-white border-[#0d4d44]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
      >
        Requester
      </button>
      <button 
        @click="setRole('approver')"
        class="px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer"
        :class="store.previewRole === 'approver' ? 'bg-[#0d4d44] text-white border-[#0d4d44]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
      >
        Approver
      </button>
      <button 
        @click="setRole('dispatcher')"
        class="px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer"
        :class="store.previewRole === 'dispatcher' || store.previewRole === 'admin' ? 'bg-[#0d4d44] text-white border-[#0d4d44]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
      >
        GS Dispatcher
      </button>
      <button 
        @click="setRole('driver')"
        class="px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer"
        :class="store.previewRole === 'driver' ? 'bg-[#0d4d44] text-white border-[#0d4d44]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
      >
        Driver
      </button>
      <button 
        @click="setRole('superadmin')"
        class="px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer"
        :class="store.previewRole === 'superadmin' ? 'bg-[#0d4d44] text-white border-[#0d4d44]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
      >
        Super Admin
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoleStore } from '../stores/roleStore';

const store = useRoleStore();

const setRole = (role) => {
  store.setPreviewRole(role);
};
</script>
