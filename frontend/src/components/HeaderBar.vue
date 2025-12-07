// File: src/components/HeaderBar.vue

<template>
  <header class="header-bar">
    <div class="header-container">
      <!-- Logo和实验室名称 -->
      <div class="header-left">
        <router-link :to="`/${locale}`" class="logo-link">
          <div class="lab-name">{{ currentLabName }}</div>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <nav class="header-nav">
        <router-link
          v-for="navItem in navItems"
          :key="navItem.name"
          :to="`/${locale}/${navItem.path}`"
          class="nav-item"
          :class="{ active: isActiveRoute(navItem.path) }"
        >
          {{ t(navItem.name) }}
        </router-link>
      </nav>

      <!-- 语言切换 -->
      <div class="header-right">
        <div class="language-switch">
          <button
            class="lang-btn"
            :class="{ active: locale === 'zh' }"
            @click="switchLanguage('zh')"
          >
            {{ locale === 'zh' ? '中文' : 'CN' }}
          </button>
          <span class="lang-divider">|</span>
          <button
            class="lang-btn"
            :class="{ active: locale === 'en' }"
            @click="switchLanguage('en')"
          >
            English
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getSiteConfig } from '@/services/api';
import type { SiteConfig } from '@/types';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// 实验室名称
const siteConfig = ref<SiteConfig | null>(null);

const currentLabName = computed(() => {
  if (!siteConfig.value) {
    return locale.value === 'zh' ? '实验室' : 'Laboratory';
  }
  // Strapi 5 扁平化结构，数据直接在根级别
  return siteConfig.value.lab_name_main ||
         (siteConfig.value.lab_name_sub ?
           `${siteConfig.value.lab_name_main} - ${siteConfig.value.lab_name_sub}` :
           siteConfig.value.lab_name_main);
});

// 导航项配置
const navItems = [
  { name: 'nav.home', path: '' },
  { name: 'nav.about', path: 'about' },
  { name: 'nav.team', path: 'team' },
  { name: 'nav.research', path: 'research' },
  { name: 'nav.news', path: 'news' },
  { name: 'nav.contact', path: 'contact' }
];

// 判断当前路由是否活跃
const isActiveRoute = (path: string) => {
  const currentPath = route.path.replace(`/${locale.value}`, '');
  if (path === '') {
    return currentPath === '' || currentPath === '/';
  }
  return currentPath.startsWith(`/${path}`);
};

// 切换语言
const switchLanguage = (targetLocale: string) => {
  if (targetLocale === locale.value) return;

  const currentPath = route.path;
  const newLocalePath = currentPath.replace(`/${locale.value}`, `/${targetLocale}`);

  // 更新i18n locale
  locale.value = targetLocale;

  // 跳转到新路径
  router.push(newLocalePath);
};

// 获取站点配置
const fetchSiteConfig = async () => {
  try {
    const response = await getSiteConfig(locale.value);
    siteConfig.value = response.data;
  } catch (error) {
    console.error('Failed to fetch site config:', error);
  }
};

// 监听locale变化，重新获取站点配置
watch(locale, () => {
  fetchSiteConfig();
});

onMounted(() => {
  fetchSiteConfig();
});
</script>

<style scoped>
.header-bar {
  background: linear-gradient(135deg, #0052a3 0%, #003d7a 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
}

.header-left {
  flex-shrink: 0;
}

.logo-link {
  text-decoration: none;
  color: white;
}

.lab-name {
  font-size: 24px;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
}

.header-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 4px solid white;
}

.header-right {
  flex-shrink: 0;
}

.language-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 4px;
}

.lang-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.lang-btn:hover {
  color: white;
}

.lang-btn.active {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.lang-divider {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .header-container {
    width: 95%;
  }

  .header-nav {
    gap: 20px;
  }

  .lab-name {
    font-size: 20px;
  }

  .nav-item {
    font-size: 14px;
    padding: 6px 12px;
  }
}

@media (max-width: 768px) {
  .header-container {
    height: 60px;
    padding: 0 15px;
  }

  .lab-name {
    font-size: 18px;
  }

  .header-nav {
    gap: 15px;
  }

  .nav-item {
    font-size: 13px;
    padding: 5px 10px;
  }
}
</style>