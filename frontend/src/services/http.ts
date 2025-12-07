// File: src/services/http.ts

import axios from 'axios';

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // Strapi API的标准响应格式，返回response.data但保持Strapi结构
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);

    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;

      switch (status) {
        case 404:
          throw new Error('请求的资源不存在');
        case 500:
          throw new Error('服务器内部错误');
        case 429:
          throw new Error('请求过于频繁，请稍后再试');
        default:
          throw new Error(data?.error?.message || '请求失败');
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      throw new Error('请求配置错误');
    }
  }
);

export default http;