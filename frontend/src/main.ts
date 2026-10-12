import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '@fontsource/unbounded/400.css'
import '@fontsource/space-mono/400.css'

createApp(App)
    .use(router)
    .mount('#app')