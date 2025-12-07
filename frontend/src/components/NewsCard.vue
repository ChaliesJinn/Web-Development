// File: src/components/NewsCard.vue

<template>
  <div class="news-card" @click="handleClick">
    <div class="card-image" v-if="showImage && news.cover">
      <img
        :src="getImageUrl(news.cover)"
        :alt="news.cover.alternativeText || news.title"
        class="cover-image"
      />
    </div>
    <div class="card-content">
      <div class="card-header">
        <span class="news-category" v-if="news.news_category">
          {{ getCategoryName(news.news_category) }}
        </span>
        <span class="news-date">
          {{ formatDate(news.publishedAt) }}
        </span>
      </div>
      <h3 class="news-title">{{ news.title }}</h3>
      <p class="news-summary" v-if="showSummary">
        {{ getSummaryText(news.summary) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { News, NewsCategory } from '@/types';

interface Props {
  news: News;
  showImage?: boolean;
  showSummary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showImage: true,
  showSummary: true
});

const emit = defineEmits<{
  click: [news: News];
}>();

const { t, locale } = useI18n();

// 获取图片URL
const getImageUrl = (image: any) => {
  if (!image) return '';

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + image.url;
};

// 获取分类名称
const getCategoryName = (category: NewsCategory) => {
  const categorySlug = category.slug;
  return t(`newsCategory.${categorySlug}`);
};

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

// 获取摘要文本（从富文本中提取纯文本）
const getSummaryText = (summary: any) => {
  if (!summary) return '';

  // 如果是字符串，直接返回
  if (typeof summary === 'string') {
    return summary.length > 120 ? summary.substring(0, 120) + '...' : summary;
  }

  // 如果是对象（富文本JSON），尝试提取文本
  if (typeof summary === 'object' && summary.blocks) {
    const text = summary.blocks
      .map((block: any) => block.text || '')
      .join('\n');
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  }

  return '';
};

// 处理点击事件
const handleClick = () => {
  emit('click', props.news);
};
</script>

<style scoped>
.news-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e8e8e8;
}

.news-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #0052a3;
}

.card-image {
  position: relative;
  padding-top: 60%;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .cover-image {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  color: #666;
}

.news-category {
  background: #0052a3;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.news-date {
  color: #999;
}

.news-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.news-summary {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-content {
    padding: 15px;
  }

  .news-title {
    font-size: 15px;
  }

  .news-summary {
    font-size: 13px;
  }
}
</style>