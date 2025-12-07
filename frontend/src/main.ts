// File: src/main.ts

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

import 'element-plus/dist/index.css';
import './style.css';

const app = createApp(App);

// 注册全局插件
app.use(router);
app.use(i18n);

// 挂载应用
app.mount('#app');