// File: src/views/About.vue

<template>
  <div class="about-page">
    <SectionTitle :main-title="t('about.title')" />

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="error" class="error-state">
      <el-alert :title="t('common.error')" type="error" show-icon />
    </div>

    <div v-else-if="labIntro" class="about-content">
      <!-- 实验室简介 -->
      <section class="intro-section">
        <h2 class="section-subtitle">{{ t('about.summary') }}</h2>
        <div class="rich-text-content" v-html="renderRichText(labIntro.summary)"></div>
      </section>

      <!-- 研究方向 -->
      <section class="directions-section">
        <h2 class="section-subtitle">{{ t('about.directions') }}</h2>
        <div class="rich-text-content" v-html="renderRichText(labIntro.research_directions)"></div>
      </section>

      <!-- 代表性成果 -->
      <section class="achievements-section">
        <h2 class="section-subtitle">{{ t('about.achievements') }}</h2>
        <div class="rich-text-content" v-html="renderRichText(labIntro.achievements)"></div>
      </section>

      <!-- 实验环境 -->
      <section class="environment-section" v-if="environmentPhotos.length > 0">
        <h2 class="section-subtitle">{{ t('about.environment') }}</h2>
        <div class="environment-gallery">
          <div
            v-for="photo in environmentPhotos"
            :key="photo.id"
            class="gallery-item"
            @click="openImageModal(photo)"
          >
            <img
              :src="getImageUrl(photo)"
              :alt="photo.alternativeText || 'Environment Photo'"
              class="gallery-image"
            />
            <div class="image-overlay">
              <span class="view-icon">🔍</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="empty-state">
      <p>{{ t('common.noContent') }}</p>
      <el-button type="primary" @click="goHome">
        {{ t('button.back') }}
      </el-button>
    </div>

    <!-- 图片模态框 -->
    <el-dialog
      v-model="imageModalVisible"
      :title="selectedImage?.attributes.alternativeText || 'Environment Photo'"
      width="80%"
      destroy-on-close
    >
      <div class="modal-image-container">
        <img
          v-if="selectedImage"
          :src="getImageUrl(selectedImage)"
          :alt="selectedImage.attributes.alternativeText || 'Environment Photo'"
          class="modal-image"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElSkeleton, ElAlert, ElButton, ElDialog } from 'element-plus';
import SectionTitle from '@/components/SectionTitle.vue';
import { getLabIntro } from '@/services/api';
import type { LabIntro, Media } from '@/types';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// 路由参数
const currentLocale = route.params.locale as string;

// 响应式数据
const labIntro = ref<LabIntro | null>(null);
const loading = ref(false);
const error = ref(false);

// 图片模态框
const imageModalVisible = ref(false);
const selectedImage = ref<Media | null>(null);

// 计算属性
const environmentPhotos = ref<Media[]>([]);

// 获取图片URL
const getImageUrl = (image: Media) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + image.url;
};

// 渲染富文本（简化版本，实际项目可能需要更复杂的富文本渲染器）
const renderRichText = (content: any) => {
  if (!content) return '';

  // 如果是HTML字符串
  if (typeof content === 'string') {
    return content;
  }

  // 如果是富文本JSON对象（Strapi格式）
  if (typeof content === 'object' && content.blocks) {
    // 这里应该使用proper的富文本渲染器
    // 现在简单提取纯文本并转换为基本HTML
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

// 打开图片模态框
const openImageModal = (image: Media) => {
  selectedImage.value = image;
  imageModalVisible.value = true;
};

// 返回首页
const goHome = () => {
  router.push(`/${currentLocale}`);
};

// 获取实验室简介数据
const fetchLabIntro = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await getLabIntro(locale.value);
    labIntro.value = response.data;

    // 提取环境照片 - Strapi 5 扁平化结构
    if (response.data.environment_photos) {
      environmentPhotos.value = response.data.environment_photos;
    }
  } catch (err) {
    console.error('Failed to fetch lab intro:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLabIntro();
});
</script>

<style scoped>
.about-page {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

section {
  position: relative;
}

.section-subtitle {
  color: #0052a3;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8f1ff;
}

.rich-text-content {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

.rich-text-content :deep(p) {
  margin-bottom: 16px;
  text-align: justify;
}

.rich-text-content :deep(h2) {
  color: #0052a3;
  margin: 24px 0 12px 0;
}

.rich-text-content :deep(h3) {
  color: #333;
  margin: 20px 0 10px 0;
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

/* 环境照片画廊 */
.environment-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  aspect-ratio: 4/3;
}

.gallery-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 82, 163, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.view-icon {
  color: white;
  font-size: 24px;
}

/* 模态框样式 */
.modal-image-container {
  text-align: center;
  max-height: 70vh;
  overflow: auto;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .about-page {
    padding: 35px;
  }

  .environment-gallery {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .about-page {
    padding: 25px;
  }

  .about-content {
    gap: 30px;
  }

  .section-subtitle {
    font-size: 20px;
  }

  .rich-text-content {
    font-size: 15px;
  }

  .environment-gallery {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }

  .gallery-item {
    aspect-ratio: 3/2;
  }
}
</style>