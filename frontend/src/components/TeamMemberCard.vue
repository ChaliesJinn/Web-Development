// File: src/components/TeamMemberCard.vue

<template>
  <div class="member-card">
    <div class="member-avatar">
      <img
        v-if="member.attributes.avatar?.data"
        :src="getAvatarUrl(member.attributes.avatar.data)"
        :alt="member.attributes.name"
        class="avatar-image"
      />
      <div v-else class="avatar-placeholder">
        {{ getAvatarPlaceholder(member.attributes.name) }}
      </div>
    </div>
    <div class="member-info">
      <h3 class="member-name">{{ member.attributes.name }}</h3>
      <p class="member-title">{{ member.attributes.title }}</p>
      <div class="member-contacts">
        <a
          v-if="member.attributes.email"
          :href="`mailto:${member.attributes.email}`"
          class="contact-link email-link"
          :title="t('contact.email')"
        >
          📧
        </a>
        <a
          v-if="member.attributes.homepage"
          :href="member.attributes.homepage"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link homepage-link"
          :title="t('button.website')"
        >
          🔗
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { TeamMember } from '@/types';

interface Props {
  member: TeamMember;
}

defineProps<Props>();

const { t } = useI18n();

// 获取头像URL
const getAvatarUrl = (avatar: any) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
  return baseUrl + avatar.attributes.url;
};

// 获取头像占位符（姓名首字母）
const getAvatarPlaceholder = (name: string) => {
  const chars = name.trim().split('');
  return chars.length > 0 ? chars[0]?.toUpperCase() : '?';
};
</script>

<style scoped>
.member-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 82, 163, 0.15);
  border-color: #0052a3;
}

.member-avatar {
  margin-bottom: 16px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  flex-shrink: 0;
}

.avatar-image,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 3px solid #e8f1ff;
  border-radius: 50%;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #0052a3, #4a9eff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.member-title {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.4;
  flex: 1;
}

.member-contacts {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: auto;
}

.contact-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 16px;
}

.contact-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.email-link:hover {
  background: #4a9eff;
}

.homepage-link:hover {
  background: #0052a3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .member-card {
    padding: 20px;
  }

  .member-avatar {
    width: 80px;
    height: 80px;
    margin-bottom: 12px;
  }

  .avatar-placeholder {
    font-size: 28px;
  }

  .member-name {
    font-size: 16px;
  }

  .member-title {
    font-size: 13px;
  }

  .contact-link {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>