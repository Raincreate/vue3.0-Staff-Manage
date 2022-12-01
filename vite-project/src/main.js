import { createApp } from 'vue'
import App from './App.vue'
// import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
// import config from './config/index'
import request from './utils/request'
import storage from './utils/storage'
import api from './api/index'
import store from './store/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.use(router).use(ElementPlus).use(store)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// axios.get(config.mockApi + '/login').then((res) => {
//     console.log('res', res);
//     if (res.data.code === 200) {
//         console.log();
//     }
// })

console.log("环境变量测试:",
    import.meta.env);