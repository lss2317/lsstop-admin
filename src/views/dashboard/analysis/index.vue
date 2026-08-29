<!-- 分析页面 -->
<template>
  <div v-if="analysisData" class="grid gap-5 pb-5 max-sm:gap-4 max-sm:pb-4">
    <VisitTrend :stats="analysisData.uniqueVisitorTrend.dailyStats" />

    <div
      class="grid grid-cols-[minmax(0,10fr)_minmax(0,7fr)_minmax(0,7fr)] gap-5 max-xl:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4"
    >
      <TopArticles :articles="analysisData.topArticles" />
      <CategoryDistribution :categories="analysisData.categoryDistribution" />
      <CommentSource :sources="analysisData.commentSource" />
    </div>

    <div class="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-5 max-xl:grid-cols-1 max-sm:gap-4">
      <InteractionTrend :trend="analysisData.interactionTrend" />
      <TagRadar :tags="analysisData.tagRadar" />
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

  async function loadData() {
    analysisData.value = await fetchAnalysisData();
  }

  onMounted(() => {
    loadData();
  });
</script>
