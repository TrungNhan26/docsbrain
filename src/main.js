import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/index.css' // Đường dẫn đúng với alias @
import '@fortawesome/fontawesome-free/css/all.min.css'
import router from './router/index'
createApp(App).use(router).mount('#app')