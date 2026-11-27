// 导入根组件和需要的组件库
import { createApp } from "vue";
import App from './App.vue'
import router from "./router/router.js";
import {io} from "socket.io-client";
import elementPlus from "element-plus";
import axios from "axios";
import "element-plus/dist/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// 创建、挂载并配置vue实例
const app = createApp(App)
app.config.productionTip = false           // 禁止生成提示
// const ws = io('http://localhost:5000', {
// 	transports:['websocket'],
//     autoConnect:true,
//     auth: {
//         token: localStorage.getItem('token')
//     }
// })
// const http = axios.create({
//     baseURL: 'http://localhost:5000',
//     timeout: 5000
// })
app.use(router)
app.use(elementPlus)
// app.provide('socket', ws)
// app.provide('axios', http)
app.mount('#app')