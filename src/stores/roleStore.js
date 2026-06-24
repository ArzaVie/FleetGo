import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useRoleStore = defineStore('roleStore', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const previewRole = ref(localStorage.getItem('previewRole') || null);
  
  const notifications = ref([
    { id: 1, title: 'Request REQ-3 disetujui', time: '10m ago', read: false },
    { id: 2, title: 'Dana Persekot REQ-2 cair', time: '1h ago', read: false }
  ]);

  const activeRole = computed(() => {
    if (user.value?.role === 'superadmin' && previewRole.value) {
      return previewRole.value;
    }
    return user.value?.role || 'guest';
  });

  function setUser(newUser) {
    user.value = newUser;
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      if (newUser.role === 'superadmin') {
        previewRole.value = 'superadmin';
        localStorage.setItem('previewRole', 'superadmin');
      } else {
        previewRole.value = null;
        localStorage.removeItem('previewRole');
      }
    } else {
      localStorage.removeItem('user');
      previewRole.value = null;
      localStorage.removeItem('previewRole');
    }
  }

  function setPreviewRole(role) {
    if (user.value?.role === 'superadmin') {
      previewRole.value = role;
      localStorage.setItem('previewRole', role);
    }
  }

  function addNotification(notification) {
    notifications.value.unshift({
      id: Date.now(),
      title: notification.title,
      time: 'Just now',
      read: false
    });
  }

  function clearNotifications() {
    notifications.value = [];
  }

  return {
    user,
    previewRole,
    activeRole,
    notifications,
    setUser,
    setPreviewRole,
    addNotification,
    clearNotifications
  };
});
