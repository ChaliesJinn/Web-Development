// File: src/components/ProjectCard.vue

<template>
  <div class="project-card">
    <div class="project-header">
      <div class="project-status" :class="statusClass">
        {{ getStatusText() }}
      </div>
      <h3 class="project-title">{{ props.project.attributes.title }}</h3>
    </div>

    <div class="project-meta">
      <div class="project-period">
        <span class="period-label">{{ t('research.year') }}：</span>
        <span class="period-text">
          {{ formatDate(props.project.attributes.start_date) }} ~
          {{ props.project.attributes.end_date ? formatDate(props.project.attributes.end_date) : t('common.noData') }}
        </span>
      </div>
    </div>

    <div class="project-content">
      <div class="project-summary" v-if="summaryText">
        {{ summaryText }}
      </div>

      <div class="project-team" v-if="teamMembers.length > 0">
        <h4 class="team-title">{{ t('research.authors') }}：</h4>
        <div class="team-members">
          <span
            v-for="(member, index) in teamMembers"
            :key="member.id"
            class="team-member"
          >
            {{ member.attributes.name }}
            <span v-if="index < teamMembers.length - 1">、</span>
          </span>
        </div>
      </div>
    </div>

    <div class="project-cover" v-if="props.project.attributes.cover?.data">
      <img
        :src="getImageUrl(props.project.attributes.cover.data)"
        :alt="props.project.attributes.cover.data.attributes.alternativeText || props.project.attributes.title"
        class="cover-image"
      />
    </div>

    <div class="project-actions" v-if="props.project.attributes.attachments?.data?.length">
      <el-button size="small" type="primary" plain @click="showAttachments">
        {{ t('news.attachments') }} ({{ props.project.attributes.attachments.data.length }})
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
          v-for="attachment in props.project.attributes.attachments?.data"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElButton, ElDialog } from 'element-plus';
import type { ResearchProject } from '@/types';

interface Props {
  project: ResearchProject;
}

const props = defineProps<Props>();

const { t } = useI18n();

// 对话框显示状态
const attachmentDialogVisible = ref(false);

// 计算属性
const statusClass = computed(() => {
  return `status-${props.project.attributes.project_status}`;
});

const teamMembers = computed(() => {
  return props.project.attributes.team_members?.data || [];
});

const summaryText = computed(() => {
  const summary = props.project.attributes.summary;
  if (!summary) return '';

  if (typeof summary === 'string') {
    return summary.length > 150 ? summary.substring(0, 150) + '...' : summary;
  }

  if (typeof summary === 'object' && summary.blocks) {
    const text = summary.blocks
      .map((block: any) => block.text || '')
      .join(' ');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  return String(summary).length > 150 ? String(summary).substring(0, 150) + '...' : String(summary);
});

// 方法
const getStatusText = () => {
  return t(`projectStatus.${props.project.attributes.project_status}`);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

const getImageUrl = (image: any) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + image.attributes.url;
};

const getFileUrl = (file: any) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + file.attributes.url;
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
</script>

<style scoped>
.project-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 82, 163, 0.15);
  border-color: #0052a3;
}

/* 项目头部 */
.project-header {
  margin-bottom: 20px;
}

.project-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-ongoing {
  background: #e8f5e8;
  color: #4caf50;
}

.status-completed {
  background: #e3f2fd;
  color: #2196f3;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 项目元信息 */
.project-meta {
  margin-bottom: 20px;
}

.project-period {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.period-label {
  color: #0052a3;
  font-weight: 500;
}

.period-text {
  color: #333;
}

/* 项目内容 */
.project-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.project-summary {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  text-align: justify;
}

.project-team {
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.team-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
}

.team-members {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.team-member {
  font-size: 13px;
  color: #0052a3;
}

/* 项目封面 */
.project-cover {
  margin-bottom: 20px;
  text-align: center;
}

.cover-image {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 项目操作 */
.project-actions {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .project-card {
    padding: 20px;
  }

  .project-title {
    font-size: 16px;
  }

  .project-summary {
    font-size: 13px;
  }
}
</style>