<template>
  <div class="min-h-screen flex bg-[#f9f9ff]">
    <!-- Side navigation, shown only when logged in -->
    <SideNavBar v-if="isLoggedIn" />
    
    <!-- Main workspace content -->
    <div class="flex-1 flex flex-col min-w-0" :class="isLoggedIn ? 'pl-64' : ''">
      <TopNavBar v-if="isLoggedIn" />
      <MasterAccessPanel v-if="isLoggedIn" />
      <main class="flex-1">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRoleStore } from './stores/roleStore';
import SideNavBar from './components/SideNavBar.vue';
import TopNavBar from './components/TopNavBar.vue';
import MasterAccessPanel from './components/MasterAccessPanel.vue';

const route = useRoute();
const store = useRoleStore();

const isLoggedIn = computed(() => {
  // Hide layout on login screen
  return route.path !== '/login' && route.path !== '/' && store.user !== null;
});
</script>

<style>
/* Clean global transitions for a premium desktop feel */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>