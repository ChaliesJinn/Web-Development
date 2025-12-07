// File: src/App.vue

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { locale } = useI18n();

// 监听路由语言参数变化，同步更新i18n语言
watch(
  () => route.params.locale,
  (newLocale) => {
    if (newLocale && typeof newLocale === 'string' && ['zh', 'en'].includes(newLocale)) {
      locale.value = newLocale;
    }
  },
  { immediate: true }
);
</script>

<style>
/* 全局样式重置和基础设置 */
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

/* Element Plus 主题覆盖 */
:root {
  --el-color-primary: #0052a3;
  --el-color-primary-light-3: #4a9eff;
  --el-color-primary-light-5: #66b3ff;
  --el-color-primary-light-7: #99ccff;
  --el-color-primary-light-8: #b3d9ff;
  --el-color-primary-light-9: #e6f2ff;
  --el-color-primary-dark-2: #004080;

  --el-color-success: #4caf50;
  --el-color-warning: #ff9800;
  --el-color-danger: #f44336;
  --el-color-info: #2196f3;

  --el-border-radius-base: 6px;
  --el-border-radius-small: 4px;
  --el-border-radius-round: 20px;

  --el-font-size-base: 14px;
  --el-font-size-small: 13px;
  --el-font-size-large: 16px;

  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #c0c4cc;

  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #ebeef5;
  --el-border-color-extra-light: #f2f6fc;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式工具类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 1280px) {
  .container {
    width: 95%;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}

/* 通用间距类 */
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 8px; }
.mb-2 { margin-bottom: 16px; }
.mb-3 { margin-bottom: 24px; }
.mb-4 { margin-bottom: 32px; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 32px; }

/* 文本工具类 */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-primary { color: #0052a3; }
.text-secondary { color: #666; }
.text-muted { color: #999; }

/* 显示工具类 */
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-grid { display: grid; }

/* Flexbox 工具类 */
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.align-center { align-items: center; }
.align-start { align-items: flex-start; }
.align-end { align-items: flex-end; }
</style>