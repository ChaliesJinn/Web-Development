// File: src/components/OutputCard.vue

<template>
  <div class="output-card">
    <div class="output-header">
      <div class="output-type" :class="typeClass">
        {{ getOutputTypeName() }}
      </div>
      <div class="output-year">{{ output.attributes.year }}</div>
    </div>

    <div class="output-content">
      <h3 class="output-title">{{ output.attributes.title }}</h3>

      <div class="output-meta" v-if="output.attributes.authors">
        <div class="output-authors">
          <span class="meta-label">{{ t('research.authors') }}：</span>
          <span class="authors-text">{{ output.attributes.authors }}</span>
        </div>
      </div>

      <div class="output-meta" v-if="output.attributes.journal_or_conference">
        <div class="output-journal">
          <span class="meta-label">{{ t('research.journal') }}：</span>
          <span class="journal-text">{{ output.attributes.journal_or_conference }}</span>
        </div>
      </div>

      <div class="output-abstract" v-if="abstractText">
        <div class="abstract-content">
          {{ abstractText }}
          <button
            v-if="showExpandButton"
            class="expand-button"
            @click="toggleAbstract"
          >
            {{ isExpanded ? t('common.loading', '收起') : t('button.more', '展开') }}
          </button>
        </div>
      </div>

      <div class="output-link" v-if="output.attributes.doi_or_link">
        <a
          :href="output.attributes.doi_or_link"
          target="_blank"
          rel="noopener noreferrer"
          class="doi-link"
        >
          <span class="link-icon">🔗</span>
          <span class="link-text">{{ t('research.doi') }}: {{ output.attributes.doi_or_link }}</span>
        </a>
      </div>
    </div>

    <div class="output-actions" v-if="hasAttachments || hasCover">
      <el-button
        v-if="hasAttachments"
        size="small"
        type="primary"
        plain
        @click="showAttachments"
      >
        {{ t('news.attachments') }} ({{ output.attributes.attachments?.data.length }})
      </el-button>
      <el-button
        v-if="hasCover"
        size="small"
        type="info"
        plain
        @click="showCover"
      >
        {{ t('common.loading', '封面') }}
      </el-button>
    </div>

    <!-- 附件弹窗 -->
    <el-dialog
      v-model="attachmentDialogVisible"
      :title="t('news.attachments')"
      width="60%"
    >
      <div class="attachments-list">
        <div
          v-for="attachment in output.attributes.attachments?.data"
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
    </el-dialog>

    <!-- 封面弹窗 -->
    <el-dialog
      v-model="coverDialogVisible"
      :title="output.attributes.title"
      width="80%"
    >
      <div class="cover-preview">
        <img
          v-if="output.attributes.cover?.data"
          :src="getImageUrl(output.attributes.cover.data)"
          :alt="output.attributes.cover.data.attributes.alternativeText || output.attributes.title"
          class="cover-image-large"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElButton, ElDialog } from 'element-plus';
import type { ResearchOutput } from '@/types';

interface Props {
  output: ResearchOutput;
}

const props = defineProps<Props>();

const { t } = useI18n();

// 对话框显示状态
const attachmentDialogVisible = ref(false);
const coverDialogVisible = ref(false);
const isExpanded = ref(false);

// 计算属性
const typeClass = computed(() => {
  return `type-${props.output.attributes.type}`;
});

const hasAttachments = computed(() => {
  return (props.output.attributes.attachments?.data?.length || 0) > 0;
});

const hasCover = computed(() => {
  return !!props.output.attributes.cover?.data;
});

const abstractText = computed(() => {
  const abstract = props.output.attributes.abstract;
  if (!abstract) return '';

  if (typeof abstract === 'string') {
    return abstract;
  }

  if (typeof abstract === 'object' && abstract.blocks) {
    const text = abstract.blocks
      .map((block: any) => block.text || '')
      .join(' ');

    if (!isExpanded.value && text.length > 200) {
      return text.substring(0, 200) + '...';
    }
    return text;
  }

  return String(abstract);
});

const showExpandButton = computed(() => {
  const abstract = props.output.attributes.abstract;
  if (!abstract) return false;

  let fullText = '';
  if (typeof abstract === 'string') {
    fullText = abstract;
  } else if (typeof abstract === 'object' && abstract.blocks) {
    fullText = abstract.blocks.map((block: any) => block.text || '').join(' ');
  } else {
    fullText = String(abstract);
  }

  return fullText.length > 200;
});

// 方法
const getOutputTypeName = () => {
  return t(`outputType.${props.output.attributes.type}`);
};

const toggleAbstract = () => {
  isExpanded.value = !isExpanded.value;
};

const getFileUrl = (file: any) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + file.attributes.url;
};

const getImageUrl = (image: any) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + image.attributes.url;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const showAttachments = () => {
  attachmentDialogVisible.value = true;
};

const showCover = () => {
  coverDialogVisible.value = true;
};
</script>

<style scoped>
.output-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.output-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 82, 163, 0.15);
  border-color: #0052a3;
}

/* 输出头部 */
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.output-type {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-paper {
  background: #e3f2fd;
  color: #1976d2;
}

.type-patent {
  background: #fff3e0;
  color: #f57c00;
}

.type-award {
  background: #e8f5e8;
  color: #4caf50;
}

.type-software {
  background: #fce4ec;
  color: #c2185b;
}

.type-other {
  background: #f3e5f5;
  color: #7b1fa2;
}

.output-year {
  font-size: 18px;
  font-weight: 600;
  color: #0052a3;
  background: #e8f1ff;
  padding: 6px 12px;
  border-radius: 20px;
}

/* 输出内容 */
.output-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.output-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin: 0;
}

.output-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.output-authors,
.output-journal {
  display: flex;
  gap: 5px;
}

.meta-label {
  color: #0052a3;
  font-weight: 500;
  font-size: 14px;
  flex-shrink: 0;
}

.authors-text,
.journal-text {
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.output-abstract {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e8e8e8;
}

.abstract-content {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  position: relative;
}

.expand-button {
  background: none;
  border: none;
  color: #0052a3;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  text-decoration: underline;
}

.expand-button:hover {
  color: #004080;
}

.output-link {
  margin-top: 5px;
}

.doi-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0052a3;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
  word-break: break-all;
}

.doi-link:hover {
  color: #004080;
  text-decoration: underline;
}

.link-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* 输出操作 */
.output-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

/* 弹窗内容 */
.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.attachment-item:hover {
  border-color: #0052a3;
  background: #f0f7ff;
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
  font-size: 16px;
  flex-shrink: 0;
}

.attachment-name {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.attachment-size {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.cover-preview {
  text-align: center;
}

.cover-image-large {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .output-card {
    padding: 20px;
  }

  .output-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .output-title {
    font-size: 16px;
  }

  .meta-label,
  .authors-text,
  .journal-text {
    font-size: 13px;
  }
}
</style>