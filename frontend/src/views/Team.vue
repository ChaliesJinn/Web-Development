// File: src/views/Team.vue

<template>
  <div class="team-page">
    <SectionTitle :main-title="t('team.title')" />

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="6" animated />
    </div>

    <div v-else-if="error" class="error-state">
      <el-alert :title="t('common.error')" type="error" show-icon />
    </div>

    <div v-else-if="groupedMembers && Object.keys(groupedMembers).length > 0" class="team-content">
      <!-- 教师团队 -->
      <section v-if="groupedMembers.professor?.length" class="team-section">
        <h2 class="section-subtitle">{{ t('teamRole.professor') }}</h2>
        <div class="team-grid">
          <TeamMemberCard
            v-for="member in groupedMembers.professor"
            :key="member.id"
            :member="member"
          />
        </div>
      </section>

      <!-- 博士后 -->
      <section v-if="groupedMembers.postdoc?.length" class="team-section">
        <h2 class="section-subtitle">{{ t('teamRole.postdoc') }}</h2>
        <div class="team-grid">
          <TeamMemberCard
            v-for="member in groupedMembers.postdoc"
            :key="member.id"
            :member="member"
          />
        </div>
      </section>

      <!-- 博士生 -->
      <section v-if="groupedMembers.phd?.length" class="team-section">
        <h2 class="section-subtitle">{{ t('teamRole.phd') }}</h2>
        <div class="team-grid">
          <TeamMemberCard
            v-for="member in groupedMembers.phd"
            :key="member.id"
            :member="member"
          />
        </div>
      </section>

      <!-- 硕士生 -->
      <section v-if="groupedMembers.master?.length" class="team-section">
        <h2 class="section-subtitle">{{ t('teamRole.master') }}</h2>
        <div class="team-grid">
          <TeamMemberCard
            v-for="member in groupedMembers.master"
            :key="member.id"
            :member="member"
          />
        </div>
      </section>

      <!-- 本科生 -->
      <section v-if="groupedMembers.undergrad?.length" class="team-section">
        <h2 class="section-subtitle">{{ t('teamRole.undergrad') }}</h2>
        <div class="team-grid">
          <TeamMemberCard
            v-for="member in groupedMembers.undergrad"
            :key="member.id"
            :member="member"
          />
        </div>
      </section>

      <!-- 校友 -->
      <section v-if="groupedMembers.alumni?.length" class="team-section">
        <h2 class="section-subtitle">{{ t('teamRole.alumni') }}</h2>
        <div class="team-grid">
          <TeamMemberCard
            v-for="member in groupedMembers.alumni"
            :key="member.id"
            :member="member"
          />
        </div>
      </section>
    </div>

    <div v-else class="empty-state">
      <p>{{ t('common.noData') }}</p>
      <el-button type="primary" @click="goHome">
        {{ t('button.back') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElSkeleton, ElAlert, ElButton } from 'element-plus';
import SectionTitle from '@/components/SectionTitle.vue';
import TeamMemberCard from '@/components/TeamMemberCard.vue';
import { getTeamMembers } from '@/services/api';
import type { TeamMember } from '@/types';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// 路由参数
const currentLocale = route.params.locale as string;

// 响应式数据
const teamMembers = ref<TeamMember[]>([]);
const loading = ref(false);
const error = ref(false);

// 按角色类型分组
const groupedMembers = computed(() => {
  const groups: Record<string, TeamMember[]> = {
    professor: [],
    postdoc: [],
    phd: [],
    master: [],
    undergrad: [],
    alumni: []
  };

  teamMembers.value.forEach((member) => {
    const roleType = member.attributes.role_type;
    if (groups[roleType]) {
      groups[roleType].push(member);
    }
  });

  return groups;
});

// 返回首页
const goHome = () => {
  router.push(`/${currentLocale}`);
};

// 获取团队成员数据
const fetchTeamMembers = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await getTeamMembers({
      locale: locale.value,
      pageSize: 200
    });
    teamMembers.value = response.data;
  } catch (err) {
    console.error('Failed to fetch team members:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTeamMembers();
});
</script>

<style scoped>
.team-page {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
}

.team-content {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.team-section {
  border-top: 1px solid #e8e8e8;
  padding-top: 30px;
}

.team-section:first-child {
  border-top: none;
  padding-top: 0;
}

.section-subtitle {
  color: #0052a3;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  position: relative;
  padding-left: 15px;
}

.section-subtitle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #0052a3;
  border-radius: 2px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

/* 状态样式 */
.loading-state,
.error-state,
.empty-state {
  padding: 80px 0;
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
  .team-page {
    padding: 35px;
  }

  .team-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 22px;
  }

  .team-content {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .team-page {
    padding: 25px;
  }

  .team-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 18px;
  }

  .section-subtitle {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .team-content {
    gap: 30px;
  }

  .team-section {
    padding-top: 25px;
  }
}
</style>