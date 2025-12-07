// File: src/components/FooterBar.vue

<template>
  <footer class="footer-bar">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 联系信息 -->
        <div class="footer-section contact-section">
          <h3 class="section-title">{{ t('footer.copyright') }}</h3>
          <div class="contact-info" v-if="siteConfig">
            <p v-if="siteConfig.contact_address">
              <strong>{{ t('contact.address') }}:</strong><br>
              {{ formatAddress(siteConfig.contact_address) }}
            </p>
            <p v-if="siteConfig.contact_postcode">
              <strong>{{ t('contact.postcode') }}:</strong>
              {{ siteConfig.contact_postcode }}
            </p>
            <p v-if="siteConfig.contact_phone">
              <strong>{{ t('contact.phone') }}:</strong>
              {{ siteConfig.contact_phone }}
            </p>
            <p v-if="siteConfig.contact_email">
              <strong>{{ t('contact.email') }}:</strong>
              <a :href="`mailto:${siteConfig.contact_email}`" class="email-link">
                {{ siteConfig.contact_email }}
              </a>
            </p>
          </div>
          <div class="copyright">
            <p>&copy; {{ currentYear }} {{ currentLabName }}. {{ t('footer.allRightsReserved') }}.</p>
          </div>
        </div>

        <!-- 常用服务暂时隐藏，因为数据结构不匹配 -->
        <!-- <div class="footer-section services-section" v-if="siteConfig?.common_services?.length">
          <h3 class="section-title">{{ t('contact.services') }}</h3>
          <ul class="services-list">
            <li v-for="(service, index) in siteConfig.common_services" :key="index">
              <a :href="service.url" target="_blank" rel="noopener noreferrer" class="service-link">
                {{ service.label }}
              </a>
            </li>
          </ul>
        </div> -->

        <!-- 友情链接暂时隐藏，因为数据结构不匹配 -->
        <!-- <div class="footer-section links-section" v-if="siteConfig?.friend_links?.length">
          <h3 class="section-title">{{ t('contact.friendLinks') }}</h3>
          <ul class="links-list">
            <li v-for="(link, index) in siteConfig.friend_links" :key="index">
              <a :href="link.url" target="_blank" rel="noopener noreferrer" class="friend-link">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div> -->
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSiteConfig } from '@/services/api';
import type { SiteConfig } from '@/types';

const { t, locale } = useI18n();
const siteConfig = ref<SiteConfig | null>(null);

const currentYear = computed(() => new Date().getFullYear());

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

// 格式化地址（处理多行文本）
const formatAddress = (address: string) => {
  return address.replace(/\n/g, '<br>');
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

// 监听locale变化
watch(locale, () => {
  fetchSiteConfig();
});

onMounted(() => {
  fetchSiteConfig();
});
</script>

<style scoped>
.footer-bar {
  background: #1a1a1a;
  color: #cccccc;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
}

.footer-section {
  min-width: 0;
}

.section-title {
  color: white;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  border-bottom: 2px solid #0052a3;
  padding-bottom: 5px;
  display: inline-block;
}

.contact-info {
  line-height: 1.6;
}

.contact-info p {
  margin-bottom: 8px;
  color: #cccccc;
}

.contact-info strong {
  color: white;
  font-weight: 500;
}

.email-link {
  color: #4a9eff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.email-link:hover {
  color: #66b3ff;
  text-decoration: underline;
}

.copyright {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #333;
}

.copyright p {
  color: #999999;
  font-size: 14px;
}

.services-list,
.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.services-list li,
.links-list li {
  margin-bottom: 8px;
}

.service-link,
.friend-link {
  color: #cccccc;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
}

.service-link:hover,
.friend-link:hover {
  color: white;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .footer-container {
    width: 95%;
  }

  .footer-content {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .footer-container {
    padding: 30px 15px 15px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>