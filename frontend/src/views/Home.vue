// File: src/views/Home.vue

<template>
  <div class="home-page">
    <!-- Banner轮播图 -->
    <section class="banner-section">
      <div class="banner-container">
        <div class="banner-content">
          <h1 class="banner-title">{{ t('home.welcome') }} {{ currentLabName }}</h1>
          <p class="banner-subtitle">{{ t('home.title') }}</p>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 左侧：综合新闻 -->
      <section class="news-section main-section">
        <SectionTitle :main-title="t('home.comprehensiveNews')" />
        <div v-if="newsLoading" class="loading-state">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="newsError" class="error-state">
          <el-alert :title="t('common.error')" type="error" show-icon />
        </div>
        <div v-else-if="newsList.length > 0" class="news-list">
          <NewsCard
            v-for="news in newsList"
            :key="news.id"
            :news="news"
            @click="handleNewsClick"
          />
        </div>
        <div v-else class="empty-state">
          <p>{{ t('common.noData') }}</p>
        </div>
        <div class="section-footer" v-if="newsList.length > 0">
          <router-link :to="`/${locale}/news`" class="more-link">
            {{ t('button.more') }}
          </router-link>
        </div>
      </section>

      <!-- 右侧 -->
      <div class="right-section">
        <!-- 通知公告 -->
        <section class="notice-section">
          <SectionTitle :main-title="t('home.notices')" />
          <div v-if="noticeLoading" class="loading-state">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else-if="noticeError" class="error-state">
            <el-alert :title="t('common.error')" type="error" show-icon />
          </div>
          <div v-else-if="noticeList.length > 0" class="notice-list">
            <div
              v-for="notice in noticeList"
              :key="notice.id"
              class="notice-item"
              @click="handleNewsClick(notice)"
            >
              <span class="notice-title">{{ notice.title }}</span>
              <span class="notice-date">
                {{ formatDate(notice.publishedAt) }}
              </span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>{{ t('common.noData') }}</p>
          </div>
          <div class="section-footer" v-if="noticeList.length > 0">
            <router-link :to="`/${locale}/news?category=notice`" class="more-link">
              {{ t('button.more') }}
            </router-link>
          </div>
        </section>

        <!-- 学术交流 -->
        <section class="academic-section">
          <SectionTitle :main-title="t('home.academicExchange')" />
          <div v-if="academicLoading" class="loading-state">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else-if="academicError" class="error-state">
            <el-alert :title="t('common.error')" type="error" show-icon />
          </div>
          <div v-else-if="academicList.length > 0" class="academic-list">
            <div
              v-for="academic in academicList"
              :key="academic.id"
              class="academic-item"
              @click="handleNewsClick(academic)"
            >
              <span class="academic-title">{{ academic.title }}</span>
              <span class="academic-date">
                {{ formatDate(academic.publishedAt) }}
              </span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>{{ t('common.noData') }}</p>
          </div>
          <div class="section-footer" v-if="academicList.length > 0">
            <router-link :to="`/${locale}/news?category=academic`" class="more-link">
              {{ t('button.more') }}
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElSkeleton, ElAlert } from 'element-plus';
import SectionTitle from '@/components/SectionTitle.vue';
import NewsCard from '@/components/NewsCard.vue';
import {
  getHomeNews,
  getHomeNotices,
  getHomeAcademics,
  getSiteConfig
} from '@/services/api';
import type { News } from '@/types';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// 路由参数
const currentLocale = route.params.locale as string;

// 响应式数据
const currentLabName = ref('实验室');
const newsList = ref<News[]>([]);
const noticeList = ref<News[]>([]);
const academicList = ref<News[]>([]);

// 加载状态
const newsLoading = ref(false);
const noticeLoading = ref(false);
const academicLoading = ref(false);

const newsError = ref(false);
const noticeError = ref(false);
const academicError = ref(false);

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  return date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', options);
};

// 处理新闻点击
const handleNewsClick = (news: News) => {
  router.push(`/${currentLocale}/news/${news.id}`);
};

// 获取实验室配置
const fetchSiteConfig = async () => {
  try {
    const response = await getSiteConfig(locale.value);
    // 后端字段是 lab_name_main 和 lab_name_sub，不区分语言，因为启用了i18n
      currentLabName.value = response.data?.attributes?.lab_name_main ||
        (response.data?.attributes?.lab_name_sub ?
          `${response.data?.attributes?.lab_name_main} - ${response.data?.attributes?.lab_name_sub}` :
          response.data?.attributes?.lab_name_main);
  } catch (error) {
    console.error('Failed to fetch site config:', error);
  }
};

// 获取首页数据
const fetchHomeData = async () => {
  try {
    // 获取综合新闻
    newsLoading.value = true;
    newsError.value = false;
    const newsResponse = await getHomeNews(locale.value);
    newsList.value = newsResponse.data;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    newsError.value = true;
  } finally {
    newsLoading.value = false;
  }

  try {
    // 获取通知公告
    noticeLoading.value = true;
    noticeError.value = false;
    const noticeResponse = await getHomeNotices(locale.value);
    noticeList.value = noticeResponse.data;
  } catch (error) {
    console.error('Failed to fetch notices:', error);
    noticeError.value = true;
  } finally {
    noticeLoading.value = false;
  }

  try {
    // 获取学术交流
    academicLoading.value = true;
    academicError.value = false;
    const academicResponse = await getHomeAcademics(locale.value);
    academicList.value = academicResponse.data;
  } catch (error) {
    console.error('Failed to fetch academics:', error);
    academicError.value = true;
  } finally {
    academicLoading.value = false;
  }
};

onMounted(async () => {
  await fetchSiteConfig();
  await fetchHomeData();
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Banner样式 */
.banner-section {
  margin: -20px -20px 30px -20px;
  background: linear-gradient(135deg, #0052a3 0%, #003d7a 100%);
  position: relative;
  overflow: hidden;
}

.banner-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  position: relative;
  z-index: 1;
}

.banner-content {
  text-align: center;
  color: white;
}

.banner-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin: 0;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.main-section,
.notice-section,
.academic-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
}

/* 新闻列表样式 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 通知公告和学术交流列表样式 */
.notice-list,
.academic-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notice-item,
.academic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-item:hover,
.academic-item:hover {
  background: #f8f9fa;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: -10px;
  margin-right: -10px;
}

.notice-title,
.academic-title {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-date,
.academic-date {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  margin-left: 15px;
}

/* 状态样式 */
.loading-state,
.error-state,
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-state {
  color: #999;
  font-size: 14px;
}

/* 更多链接 */
.section-footer {
  margin-top: 20px;
  text-align: right;
}

.more-link {
  color: #0052a3;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 8px 16px;
  border: 1px solid #0052a3;
  border-radius: 4px;
  display: inline-block;
}

.more-link:hover {
  background: #0052a3;
  color: white;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .content-grid {
    gap: 25px;
  }

  .main-section,
  .notice-section,
  .academic-section {
    padding: 25px;
  }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .banner-title {
    font-size: 36px;
  }

  .banner-subtitle {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .banner-section {
    margin: -20px -20px 20px -20px;
  }

  .banner-container {
    padding: 60px 20px;
  }

  .banner-title {
    font-size: 28px;
  }

  .banner-subtitle {
    font-size: 16px;
  }

  .main-section,
  .notice-section,
  .academic-section {
    padding: 20px;
  }

  .notice-item,
  .academic-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .notice-date,
  .academic-date {
    margin-left: 0;
    font-size: 11px;
  }
}
</style>