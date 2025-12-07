// File: src/views/Research.vue

<template>
  <div class="research-page">
    <SectionTitle :main-title="t('research.title')" />

    <!-- 科研项目部分 -->
    <section class="research-section">
      <h2 class="section-subtitle">{{ t('research.projects') }}</h2>

      <div v-if="projectsLoading" class="loading-state">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="projectsError" class="error-state">
        <el-alert :title="t('common.error')" type="error" show-icon />
      </div>

      <div v-else-if="ongoingProjects.length > 0 || completedProjects.length > 0">
        <!-- 在研项目 -->
        <div v-if="ongoingProjects.length > 0" class="project-group">
          <h3 class="group-title">{{ t('research.ongoingProjects') }}</h3>
          <div class="projects-grid">
            <ProjectCard
              v-for="project in ongoingProjects"
              :key="project.id"
              :project="project"
            />
          </div>
        </div>

        <!-- 已结题项目 -->
        <div v-if="completedProjects.length > 0" class="project-group">
          <h3 class="group-title">{{ t('research.completedProjects') }}</h3>
          <div class="projects-grid">
            <ProjectCard
              v-for="project in completedProjects"
              :key="project.id"
              :project="project"
            />
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>{{ t('common.noData') }}</p>
      </div>
    </section>

    <!-- 科研成果部分 -->
    <section class="research-section">
      <h2 class="section-subtitle">{{ t('research.outputs') }}</h2>

      <!-- 筛选器 -->
      <div class="filters-section">
        <div class="filters-container">
          <!-- 类型筛选 -->
          <div class="filter-item">
            <el-select
              v-model="selectedType"
              :placeholder="t('research.allTypes')"
              class="type-select"
              clearable
              @change="handleTypeFilter"
            >
              <el-option
                v-for="type in outputTypes"
                :key="type"
                :label="getOutputTypeName(type)"
                :value="type"
              />
            </el-select>
          </div>

          <!-- 年份筛选 -->
          <div class="filter-item">
            <el-select
              v-model="selectedYear"
              :placeholder="t('research.allYears')"
              class="year-select"
              clearable
              @change="handleYearFilter"
            >
              <el-option
                v-for="year in availableYears"
                :key="year"
                :label="year.toString()"
                :value="year"
              />
            </el-select>
          </div>

          <!-- 重置按钮 -->
          <div class="filter-item">
            <el-button @click="resetFilters">
              {{ t('button.back') }}
            </el-button>
          </div>
        </div>
      </div>

      <div v-if="outputsLoading" class="loading-state">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else-if="outputsError" class="error-state">
        <el-alert :title="t('common.error')" type="error" show-icon />
      </div>

      <div v-else-if="filteredOutputs.length > 0" class="outputs-list">
        <OutputCard
          v-for="output in filteredOutputs"
          :key="output.id"
          :output="output"
        />
      </div>

      <div v-else class="empty-state">
        <p>{{ t('common.noData') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElSelect, ElOption, ElButton, ElSkeleton, ElAlert } from 'element-plus';
import SectionTitle from '@/components/SectionTitle.vue';
import ProjectCard from '@/components/ProjectCard.vue';
import OutputCard from '@/components/OutputCard.vue';
import { getResearchProjects, getResearchOutputs } from '@/services/api';
import type { ResearchProject, ResearchOutput } from '@/types';

const { t, locale } = useI18n();

// 响应式数据
const researchProjects = ref<ResearchProject[]>([]);
const researchOutputs = ref<ResearchOutput[]>([]);

const projectsLoading = ref(false);
const outputsLoading = ref(false);
const projectsError = ref(false);
const outputsError = ref(false);

// 筛选器
const selectedType = ref<string>('');
const selectedYear = ref<number | ''>('');

// 计算属性：按状态分组项目
const ongoingProjects = computed(() => {
  return researchProjects.value.filter(
    project => project.attributes.project_status === 'ongoing'
  );
});

const completedProjects = computed(() => {
  return researchProjects.value.filter(
    project => project.attributes.project_status === 'completed'
  );
});

// 计算属性：可用的类型和年份
const outputTypes = computed(() => {
  const types = new Set(researchOutputs.value.map(output => output.attributes.type));
  return Array.from(types);
});

const availableYears = computed(() => {
  const years = Array.from(new Set(researchOutputs.value.map(output => output.attributes.year)));
  return years.sort((a, b) => b - a);
});

// 计算属性：筛选后的成果
const filteredOutputs = computed(() => {
  let filtered = researchOutputs.value;

  if (selectedType.value) {
    filtered = filtered.filter(output => output.attributes.type === selectedType.value);
  }

  if (selectedYear.value) {
    filtered = filtered.filter(output => output.attributes.year === selectedYear.value);
  }

  return filtered;
});

// 获取成果类型名称
const getOutputTypeName = (type: string) => {
  return t(`outputType.${type}`);
};

// 处理类型筛选
const handleTypeFilter = () => {
  // 类型筛选逻辑已在计算属性中处理
};

// 处理年份筛选
const handleYearFilter = () => {
  // 年份筛选逻辑已在计算属性中处理
};

// 重置筛选器
const resetFilters = () => {
  selectedType.value = '';
  selectedYear.value = '';
};

// 获取科研项目
const fetchResearchProjects = async () => {
  projectsLoading.value = true;
  projectsError.value = false;

  try {
    const response = await getResearchProjects(locale.value);
    researchProjects.value = response.data;
  } catch (err) {
    console.error('Failed to fetch research projects:', err);
    projectsError.value = true;
  } finally {
    projectsLoading.value = false;
  }
};

// 获取科研成果
const fetchResearchOutputs = async () => {
  outputsLoading.value = true;
  outputsError.value = false;

  try {
    const response = await getResearchOutputs(locale.value);
    researchOutputs.value = response.data;
  } catch (err) {
    console.error('Failed to fetch research outputs:', err);
    outputsError.value = true;
  } finally {
    outputsLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchResearchProjects(),
    fetchResearchOutputs()
  ]);
});
</script>

<style scoped>
.research-page {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.research-section {
  margin-bottom: 0;
}

.section-subtitle {
  color: #0052a3;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e8f1ff;
}

/* 项目分组 */
.project-group {
  margin-bottom: 40px;
}

.project-group:last-child {
  margin-bottom: 0;
}

.group-title {
  color: #333;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 25px;
  position: relative;
  padding-left: 20px;
}

.group-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 22px;
  background: #4a9eff;
  border-radius: 2px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

/* 筛选器部分 */
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
  min-width: 150px;
}

.type-select,
.year-select {
  width: 150px;
}

/* 成果列表 */
.outputs-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
:deep(.el-select) {
  --el-input-focus-border-color: #0052a3;
}

:deep(.el-button) {
  --el-button-border-color: #dcdfe6;
  --el-button-hover-border-color: #0052a3;
  --el-button-active-border-color: #0052a3;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .research-page {
    padding: 35px;
    gap: 50px;
  }

  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 22px;
  }

  .filters-container {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .research-page {
    padding: 25px;
    gap: 40px;
  }

  .section-subtitle {
    font-size: 24px;
    margin-bottom: 25px;
  }

  .group-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 18px;
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

  .type-select,
  .year-select {
    width: 100%;
  }
}
</style>