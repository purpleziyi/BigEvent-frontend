import './assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'  
import App from './App.vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'  // pinia持久化插件
import locale from 'element-plus/dist/locale/en';  // English


const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState();  // create a persist-instance
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale });
app.mount('#app')
