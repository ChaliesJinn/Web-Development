// File: src/views/NewsList.vue

<template>
  <div class="news-list-page">
    <SectionTitle :main-title="t('news.title')" />

    <!-- 搜索和筛选区域 -->
    <div class="filters-section">
      <div class="filters-container">
        <!-- 分类筛选 -->
        <div class="filter-item">
          <el-select
            v-model="selectedCategory"
            :placeholder="t('common.allCategories')"
            class="category-select"
            clearable
            @change="handleCategoryChange"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="getCategoryName(category)"
              :value="category.attributes.slug"
            />
          </el-select>
        </div>

        <!-- 关键词搜索 -->
        <div class="filter-item">
          <el-input
            v-model="searchKeyword"
            :placeholder="t('news.searchPlaceholder')"
            class="search-input"
            clearable
            @clear="handleSearchClear"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button type="primary" @click="handleSearch">
                {{ t('button.search') }}
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 新闻列表 -->
    <div class="news-container">
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else-if="error" class="error-state">
        <el-alert :title="t('common.error')" type="error" show-icon />
      </div>

      <div v-else-if="newsList.length > 0" class="news-grid">
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
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElSelect, ElOption, ElInput, ElButton, ElPagination, ElSkeleton, ElAlert } from 'element-plus';
import SectionTitle from '@/components/SectionTitle.vue';
import NewsCard from '@/components/NewsCard.vue';
import { getNewsList, getNewsCategories } from '@/services/api';
import type { News, NewsCategory } from '@/types';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// 路由参数
const currentLocale = route.params.locale as string;

// 响应式数据
const newsList = ref<News[]>([]);
const categories = ref<NewsCategory[]>([]);
const loading = ref(false);
const error = ref(false);

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 筛选数据
const selectedCategory = ref<string>('');
const searchKeyword = ref<string>('');

// 获取分类名称
const getCategoryName = (category: NewsCategory) => {
  return t(`newsCategory.${category.attributes.slug}`);
};

// 处理新闻点击
const handleNewsClick = (news: News) => {
  router.push(`/${currentLocale}/news/${news.id}`);
};

// 处理分类变化
const handleCategoryChange = () => {
  currentPage.value = 1;
  fetchNewsList();
  updateURL();
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchNewsList();
  updateURL();
};

// 处理搜索清空
const handleSearchClear = () => {
  searchKeyword.value = '';
  currentPage.value = 1;
  fetchNewsList();
  updateURL();
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchNewsList();
  updateURL();
};

// 处理页面大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchNewsList();
  updateURL();
};

// 更新URL参数
const updateURL = () => {
  const query: Record<string, string> = {};

  if (selectedCategory.value) {
    query.category = selectedCategory.value;
  }

  if (searchKeyword.value.trim()) {
    query.keyword = searchKeyword.value.trim();
  }

  if (currentPage.value > 1) {
    query.page = currentPage.value.toString();
  }

  if (pageSize.value !== 10) {
    query.pageSize = pageSize.value.toString();
  }

  router.push({
    path: route.path,
    query
  });
};

// 从URL初始化参数
const initFromURL = () => {
  const query = route.query as any;

  selectedCategory.value = query.category || '';
  searchKeyword.value = query.keyword || '';
  currentPage.value = parseInt(query.page) || 1;
  pageSize.value = parseInt(query.pageSize) || 10;
};

// 获取新闻列表
const fetchNewsList = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await getNewsList({
      locale: locale.value,
      page: currentPage.value,
      pageSize: pageSize.value,
      categorySlug: selectedCategory.value || undefined,
      keyword: searchKeyword.value.trim() || undefined
    });

    newsList.value = response.data;
    total.value = response.meta.pagination.total;
  } catch (err) {
    console.error('Failed to fetch news list:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 获取新闻分类
const fetchNewsCategories = async () => {
  try {
    const response = await getNewsCategories(locale.value);
    categories.value = response.data;
  } catch (err) {
    console.error('Failed to fetch news categories:', err);
  }
};

onMounted(async () => {
  await fetchNewsCategories();
  initFromURL();
  await fetchNewsList();
});

// 监听路由参数变化（如语言切换）
watch(
  () => route.query,
  () => {
    initFromURL();
    fetchNewsList();
  }
);

// 监听语言变化
watch(
  () => locale.value,
  async () => {
    await fetchNewsCategories();
    await fetchNewsList();
  }
);
</script>

<style scoped>
.news-list-page {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
}

/* 筛选区域 */
.filters-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.filters-container {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.category-select {
  width: 100%;
}

.search-input {
  width: 100%;
  max-width: 400px;
}

/* 新闻容器 */
.news-container {
  margin-bottom: 30px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

/* 分页区域 */
.pagination-section {
  display: flex;
  justify-content: center;
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

.empty-state {
  color: #666;
  font-size: 16px;
}

/* Element Plus样式覆盖 */
:deep(.el-select),
:deep(.el-input) {
  --el-input-focus-border-color: #0052a3;
}

:deep(.el-button--primary) {
  background-color: #0052a3;
  border-color: #0052a3;
}

:deep(.el-button--primary:hover) {
  background-color: #004080;
  border-color: #004080;
}

:deep(.el-pagination) {
  --el-pagination-button-bg-color: #f8f9fa;
  --el-pagination-hover-color: #0052a3;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #0052a3;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .news-list-page {
    padding: 35px;
  }

  .news-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 22px;
  }

  .filters-container {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .news-list-page {
    padding: 25px;
  }

  .filters-section {
    padding: 15px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .filter-item {
    min-width: auto;
  }

  .search-input {
    max-width: none;
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .pagination-section {
    padding-top: 15px;
  }
}
</style>