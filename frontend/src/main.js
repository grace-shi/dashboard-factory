import axios from 'axios'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'

import './main.scss'
const {
  VUE_APP_API_BASE,
  VUE_APP_API_PATH
} = process.env

axios.defaults.baseURL = `${VUE_APP_API_BASE}${VUE_APP_API_PATH}`

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')
