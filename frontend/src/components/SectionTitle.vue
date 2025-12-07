// File: src/components/SectionTitle.vue

<template>
  <div class="section-title">
    <h2 class="title-text">
      <span class="title-main">{{ mainTitle }}</span>
      <span v-if="subTitle" class="title-sub">{{ subTitle }}</span>
    </h2>
    <div class="title-line"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mainTitle: string;
  subTitle?: string;
}

defineProps<Props>();
</script>

<style scoped>
.section-title {
  margin-bottom: 30px;
  position: relative;
}

.title-text {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.title-main {
  color: #0052a3;
}

.title-sub {
  font-size: 18px;
  color: #666;
  font-weight: 400;
}

.title-line {
  height: 3px;
  background: linear-gradient(90deg, #0052a3 0%, transparent 100%);
  width: 60px;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .title-text {
    font-size: 24px;
  }

  .title-sub {
    font-size: 16px;
  }

  .section-title {
    margin-bottom: 25px;
  }
}
</style>