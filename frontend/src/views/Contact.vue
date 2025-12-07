// File: src/views/Contact.vue

<template>
  <div class="contact-page">
    <SectionTitle :main-title="t('contact.title')" />

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="6" animated />
    </div>

    <div v-else-if="error" class="error-state">
      <el-alert :title="t('common.error')" type="error" show-icon />
    </div>

    <div v-else-if="siteConfig" class="contact-content">
      <div class="contact-grid">
        <!-- 左侧：联系信息 -->
        <section class="contact-info-section">
          <div class="info-card">
            <h3 class="info-title">{{ t('contact.title') }}</h3>

            <div class="info-items">
              <div v-if="siteConfig.attributes.contact_address" class="info-item">
                <div class="info-icon">📍</div>
                <div class="info-content">
                  <strong>{{ t('contact.address') }}：</strong>
                  <div class="address-text" v-html="formatAddress(siteConfig.attributes.contact_address)"></div>
                </div>
              </div>

              <div v-if="siteConfig.attributes.contact_postcode" class="info-item">
                <div class="info-icon">📮</div>
                <div class="info-content">
                  <strong>{{ t('contact.postcode') }}：</strong>
                  <span>{{ siteConfig.attributes.contact_postcode }}</span>
                </div>
              </div>

              <div v-if="siteConfig.attributes.contact_phone" class="info-item">
                <div class="info-icon">📞</div>
                <div class="info-content">
                  <strong>{{ t('contact.phone') }}：</strong>
                  <a :href="`tel:${siteConfig.attributes.contact_phone}`" class="contact-link">
                    {{ siteConfig.attributes.contact_phone }}
                  </a>
                </div>
              </div>

              <div v-if="siteConfig.attributes.contact_email" class="info-item">
                <div class="info-icon">✉️</div>
                <div class="info-content">
                  <strong>{{ t('contact.email') }}：</strong>
                  <a :href="`mailto:${siteConfig.attributes.contact_email}`" class="contact-link">
                    {{ siteConfig.attributes.contact_email }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 常用服务 -->
          <div
            v-if="siteConfig.attributes.common_services?.length"
            class="info-card"
          >
            <h3 class="info-title">{{ t('contact.services') }}</h3>
            <ul class="services-list">
              <li
                v-for="(service, index) in siteConfig.attributes.common_services"
                :key="index"
                class="service-item"
              >
                <a
                  :href="service.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="service-link"
                >
                  <span class="service-icon">🔗</span>
                  <span class="service-label">{{ service.label }}</span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <!-- 右侧：地图和友情链接 -->
        <section class="contact-map-section">
          <!-- 地图 -->
          <div class="info-card map-card">
            <h3 class="info-title">{{ t('contact.map') }}</h3>
            <div class="map-container">
              <div v-if="siteConfig.attributes.map_embed" v-html="siteConfig.attributes.map_embed" class="map-embed"></div>
              <div v-else class="map-placeholder">
                <div class="placeholder-content">
                  <span class="placeholder-icon">🗺️</span>
                  <p>{{ t('common.noData') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 友情链接 -->
          <div
            v-if="siteConfig.attributes.friend_links?.length"
            class="info-card"
          >
            <h3 class="info-title">{{ t('contact.friendLinks') }}</h3>
            <div class="links-grid">
              <a
                v-for="(link, index) in siteConfig.attributes.friend_links"
                :key="index"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="friend-link"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>{{ t('common.noData') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElSkeleton, ElAlert } from 'element-plus';
import SectionTitle from '@/components/SectionTitle.vue';
import { getSiteConfig } from '@/services/api';
import type { SiteConfig } from '@/types';

const { t, locale } = useI18n();

// 响应式数据
const siteConfig = ref<SiteConfig | null>(null);
const loading = ref(false);
const error = ref(false);

// 格式化地址
const formatAddress = (address: string) => {
  return address.replace(/\n/g, '<br>');
};

// 获取站点配置
const fetchSiteConfig = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await getSiteConfig(locale.value);
    siteConfig.value = response.data;
  } catch (err) {
    console.error('Failed to fetch site config:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSiteConfig();
});
</script>

<style scoped>
.contact-page {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
}

.contact-content {
  margin-top: 20px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* 信息卡片 */
.info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #e8e8e8;
  margin-bottom: 25px;
}

.info-card:last-child {
  margin-bottom: 0;
}

.info-title {
  color: #0052a3;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8f1ff;
}

/* 信息项目 */
.info-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.info-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-content {
  flex: 1;
}

.info-content strong {
  color: #333;
  font-weight: 500;
  font-size: 16px;
}

.contact-link {
  color: #0052a3;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #004080;
  text-decoration: underline;
}

.address-text {
  margin-top: 5px;
  line-height: 1.6;
  color: #333;
}

/* 服务列表 */
.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.service-item {
  margin-bottom: 12px;
}

.service-item:last-child {
  margin-bottom: 0;
}

.service-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
}

.service-link:hover {
  border-color: #0052a3;
  background: #f0f7ff;
  color: #0052a3;
  transform: translateY(-1px);
}

.service-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.service-label {
  font-size: 14px;
  font-weight: 500;
}

/* 地图卡片 */
.map-card {
  min-height: 400px;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  height: 350px;
  position: relative;
}

.map-embed {
  width: 100%;
  height: 100%;
}

.map-embed :deep(iframe) {
  width: 100%;
  height: 100%;
  border: none;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #666;
}

.placeholder-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

/* 友情链接 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.friend-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: #0052a3;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
}

.friend-link:hover {
  border-color: #0052a3;
  background: #0052a3;
  color: white;
  transform: translateY(-1px);
}

/* 状态样式 */
.loading-state,
.error-state,
.empty-state {
  padding: 80px 0;
  text-align: center;
}

.error-state .el-alert {
  max-width: 400px;
  margin: 0 auto;
}

.empty-state {
  color: #666;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .contact-page {
    padding: 35px;
  }

  .contact-grid {
    gap: 25px;
  }

  .info-card {
    padding: 22px;
  }
}

@media (max-width: 768px) {
  .contact-page {
    padding: 25px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .info-card {
    padding: 20px;
    margin-bottom: 20px;
  }

  .info-title {
    font-size: 18px;
  }

  .info-item {
    gap: 12px;
  }

  .info-icon {
    font-size: 20px;
  }

  .info-content strong {
    font-size: 15px;
  }

  .map-container {
    height: 280px;
  }

  .links-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>