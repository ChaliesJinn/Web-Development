// File: src/views/NewsDetail.vue

<template>
  <div class="news-detail-page">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="error" class="error-state">
      <el-alert :title="t('common.error')" type="error" show-icon />
      <div class="back-actions">
        <el-button type="primary" @click="goBack">
          {{ t('common.backToList') }}
        </el-button>
      </div>
    </div>

    <div v-else-if="newsDetail" class="news-content">
      <!-- 返回按钮 -->
      <div class="back-actions">
        <el-button @click="goBack" :icon="ArrowLeft">
          {{ t('button.back') }}
        </el-button>
      </div>

      <!-- 标题区域 -->
      <header class="news-header">
        <div class="news-category" v-if="newsDetail.attributes.category?.data">
          {{ getCategoryName(newsDetail.attributes.category.data) }}
        </div>
        <h1 class="news-title">{{ newsDetail.attributes.title }}</h1>
        <div class="news-meta">
          <span class="news-date">
            {{ formatDate(newsDetail.attributes.published_at) }}
          </span>
        </div>
      </header>

      <!-- 封面图 -->
      <div
        class="news-cover"
        v-if="newsDetail.attributes.cover?.data"
      >
        <img
          :src="getImageUrl(newsDetail.attributes.cover.data)"
          :alt="newsDetail.attributes.cover.data.attributes.alternativeText || newsDetail.attributes.title"
          class="cover-image"
        />
      </div>

      <!-- 正文内容 -->
      <div class="news-body">
        <div class="rich-text-content" v-html="renderRichText(newsDetail.attributes.content)"></div>
      </div>

      <!-- 附件列表 -->
      <div
        v-if="newsDetail.attributes.attachments?.data?.length"
        class="attachments-section"
      >
        <h3 class="section-title">
          {{ t('news.attachments') }}
        </h3>
        <div class="attachments-list">
          <div
            v-for="attachment in newsDetail.attributes.attachments.data"
            :key="attachment.id"
            class="attachment-item"
          >
            <a
              :href="getFileUrl(attachment)"
              :download="attachment.attributes.name"
              class="attachment-link"
            >
              <span class="attachment-icon">📎</span>
              <span class="attachment-name">{{ attachment.attributes.name }}</span>
              <span class="attachment-size" v-if="attachment.attributes.size">
                {{ formatFileSize(attachment.attributes.size) }}
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- 底部分享区域 -->
      <footer class="news-footer">
        <el-button type="primary" plain @click="goBack">
          {{ t('common.backToList') }}
        </el-button>
      </footer>
    </div>

    <div v-else class="empty-state">
      <el-result
        icon="warning"
        :title="t('common.noContent')"
        :sub-title="t('news.detail') + ' ' + t('common.noContent')"
      >
        <template #extra>
          <el-button type="primary" @click="goBack">
            {{ t('common.backToList') }}
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowLeft } from '@element-plus/icons-vue';
import {
  ElSkeleton,
  ElAlert,
  ElButton,
  ElResult
} from 'element-plus';
import { getNewsDetail } from '@/services/api';
import type { News, NewsCategory } from '@/types';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// 路由参数
const currentLocale = route.params.locale as string;
const newsId = parseInt(route.params.id as string);

// 响应式数据
const newsDetail = ref<News | null>(null);
const loading = ref(false);
const error = ref(false);

// 获取分类名称
const getCategoryName = (category: NewsCategory) => {
  return t(`newsCategory.${category.attributes.slug}`);
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', options);
};

// 渲染富文本
const renderRichText = (content: any) => {
  if (!content) return '';

  // 如果是HTML字符串
  if (typeof content === 'string') {
    return content;
  }

  // 如果是富文本JSON对象
  if (typeof content === 'object' && content.blocks) {
    const html = content.blocks
      .map((block: any) => {
        const tag = block.type === 'heading' ? `h${block.level || 2}` : 'p';
        return `<${tag}>${block.text || ''}</${tag}>`;
      })
      .join('');
    return html;
  }

  return String(content);
};

// 获取图片URL
const getImageUrl = (image: any) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + image.attributes.url;
};

// 获取文件URL
const getFileUrl = (file: any) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + file.attributes.url;
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// 返回上一页或列表页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push(`/${currentLocale}/news`);
  }
};

// 获取新闻详情
const fetchNewsDetail = async () => {
  if (isNaN(newsId)) {
    error.value = true;
    return;
  }

  loading.value = true;
  error.value = false;

  try {
    const response = await getNewsDetail(newsId, locale.value);
    newsDetail.value = response.data;
  } catch (err) {
    console.error('Failed to fetch news detail:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchNewsDetail();
});
</script>

<style scoped>
.news-detail-page {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  max-width: 800px;
  margin: 0 auto;
}

/* 返回按钮 */
.back-actions {
  margin-bottom: 30px;
}

/* 标题区域 */
.news-header {
  margin-bottom: 30px;
  text-align: center;
}

.news-category {
  display: inline-block;
  background: #0052a3;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.news-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  margin-bottom: 20px;
  word-break: break-word;
}

.news-meta {
  color: #666;
  font-size: 14px;
}

/* 封面图 */
.news-cover {
  margin-bottom: 30px;
  text-align: center;
}

.cover-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 正文内容 */
.news-body {
  margin-bottom: 40px;
}

.rich-text-content {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
  text-align: justify;
}

.rich-text-content :deep(p) {
  margin-bottom: 16px;
  text-align: justify;
}

.rich-text-content :deep(h2) {
  color: #0052a3;
  margin: 24px 0 12px 0;
  font-size: 24px;
}

.rich-text-content :deep(h3) {
  color: #333;
  margin: 20px 0 10px 0;
  font-size: 20px;
}

.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.rich-text-content :deep(li) {
  margin-bottom: 8px;
}

.rich-text-content :deep(strong) {
  color: #0052a3;
  font-weight: 600;
}

.rich-text-content :deep(a) {
  color: #0052a3;
  text-decoration: none;
}

.rich-text-content :deep(a:hover) {
  text-decoration: underline;
}

.rich-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 15px 0;
}

/* 附件区域 */
.attachments-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.section-title {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.attachment-item:hover {
  border-color: #0052a3;
  box-shadow: 0 2px 8px rgba(0, 82, 163, 0.1);
}

.attachment-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
}

.attachment-link:hover {
  color: #0052a3;
}

.attachment-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.attachment-name {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-size {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

/* 底部区域 */
.news-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

/* 状态样式 */
.loading-state,
.error-state,
.empty-state {
  padding: 60px 0;
  text-align: center;
}

.error-state .el-alert {
  max-width: 400px;
  margin: 0 auto 20px;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .news-detail-page {
    padding: 35px;
  }

  .news-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .news-detail-page {
    padding: 25px;
  }

  .news-title {
    font-size: 24px;
  }

  .rich-text-content {
    font-size: 15px;
  }

  .attachments-section {
    padding: 15px;
  }

  .attachment-link {
    padding: 10px 12px;
  }

  .attachment-name {
    font-size: 13px;
  }
}
</style>