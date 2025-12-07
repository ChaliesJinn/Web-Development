// File: src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import BaseLayout from '@/layouts/BaseLayout.vue';
import { useI18n } from 'vue-i18n';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:locale(zh|en)?',
      component: BaseLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home.vue'),
          meta: { title: 'nav.home' }
        },
        {
          path: 'about',
          name: 'About',
          component: () => import('@/views/About.vue'),
          meta: { title: 'nav.about' }
        },
        {
          path: 'team',
          name: 'Team',
          component: () => import('@/views/Team.vue'),
          meta: { title: 'nav.team' }
        },
        {
          path: 'news',
          name: 'NewsList',
          component: () => import('@/views/NewsList.vue'),
          meta: { title: 'nav.news' }
        },
        {
          path: 'news/:id',
          name: 'NewsDetail',
          component: () => import('@/views/NewsDetail.vue'),
          meta: { title: 'nav.news' }
        },
        {
          path: 'research',
          name: 'Research',
          component: () => import('@/views/Research.vue'),
          meta: { title: 'nav.research' }
        },
        {
          path: 'contact',
          name: 'Contact',
          component: () => import('@/views/Contact.vue'),
          meta: { title: 'nav.contact' }
        }
      ]
    },
    // 重定向根路径
    {
      path: '/',
      redirect: '/zh'
    },
    // 捕获所有其他路由并重定向到中文首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/zh'
    }
  ]
});

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  const { locale } = to.params as { locale?: string };

  // 如果没有locale参数，默认重定向到zh
  if (!locale) {
    // 保留当前路径，只添加locale前缀
    const fullPath = to.fullPath;
    if (fullPath === '/') {
      next('/zh');
    } else {
      next(`/zh${fullPath}`);
    }
    return;
  }

  // 验证locale是否有效
  if (!['zh', 'en'].includes(locale)) {
    next('/zh');
    return;
  }

  // 设置页面标题 - 延迟到组件中处理
  // 不在路由守卫中使用 useI18n
  if (to.meta?.title) {
    // 使用静态标题，动态标题在各个组件中设置
    const titleMap: Record<string, Record<string, string>> = {
      zh: {
        'nav.home': '首页',
        'nav.about': '关于我们',
        'nav.team': '团队介绍',
        'nav.news': '新闻动态',
        'nav.research': '科研成果',
        'nav.contact': '联系我们'
      },
      en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.team': 'Team',
        'nav.news': 'News',
        'nav.research': 'Research',
        'nav.contact': 'Contact'
      }
    };

    const labName = locale === 'zh' ? '网络空间安全实验室' : 'Cyber Security Lab';
    const pageTitle = titleMap[locale]?.[to.meta.title as string] || to.meta.title as string;
    document.title = `${pageTitle} - ${labName}`;
  }

  next();
});

// 切换语言的方法
export function switchLanguage(targetLocale: string, currentRoute: any) {
  const { locale: currentLocale, ...restParams } = currentRoute.params;
  const { query, hash } = currentRoute;

  const newRoute = {
    params: { locale: targetLocale, ...restParams },
    query,
    hash
  };

  return router.push(newRoute);
}

export default router;