<!-- 分析页面 -->
<template>
  <div v-loading="loading" class="min-h-72">
    <div v-if="analysisData" class="grid gap-5 pb-5 max-sm:gap-4 max-sm:pb-4">
      <VisitTrend :stats="analysisData.uniqueVisitorTrend.dailyStats" />

      <div
        class="grid grid-cols-[minmax(0,10fr)_minmax(0,7fr)_minmax(0,7fr)] gap-5 max-xl:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4"
      >
        <TopArticles :articles="analysisData.topArticles" />
        <CategoryDistribution :categories="analysisData.categoryDistribution" />
        <CommentSource :sources="analysisData.commentSource" />
      </div>

      <div
        class="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-5 max-xl:grid-cols-1 max-sm:gap-4"
      >
        <InteractionTrend :trend="analysisData.interactionTrend" />
        <TagRadar :tags="analysisData.tagRadar" />
      </div>
    </div>

    <div v-else-if="loadError" class="art-card flex min-h-72 flex-col items-center justify-center">
      <ArtSvgIcon icon="ri:error-warning-line" class="mb-3 text-4xl text-warning" />
      <p class="text-base font-medium text-g-800">分析数据加载失败</p>
      <p class="mt-1 text-sm text-g-500">请检查网络连接后重新加载</p>
      <ElButton type="primary" class="mt-4" @click="loadData">重新加载</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { fetchAnalysisData } from '@/apis/dashboard';
  import type { AnalysisData } from '@/apis/dashboard/types';
  import VisitTrend from './modules/visit-trend.vue';
  import CommentSource from './modules/comment-source.vue';
  import TopArticles from './modules/top-articles.vue';
  import CategoryDistribution from './modules/category-distribution.vue';
  import InteractionTrend from './modules/interaction-trend.vue';
  import TagRadar from './modules/tag-radar.vue';

  defineOptions({ name: 'Analysis' });

  const analysisData = ref<AnalysisData | null>(null);
  const loading = ref(false);
  const loadError = ref(false);

  async function loadData() {
    loading.value = true;
    loadError.value = false;
    try {
      analysisData.value = await fetchAnalysisData();
    } catch {
      loadError.value = true;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadData();
  });
</script>
