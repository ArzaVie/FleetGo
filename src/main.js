import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css' 

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Pasang Pinia untuk state management (kalau nanti butuh)
app.use(createPinia())

// Pasang Router untuk navigasi 4 role
app.use(router)

// Render aplikasinya (Cukup satu kali aja di sini)
app.mount('#app')