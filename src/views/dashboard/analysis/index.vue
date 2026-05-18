<!-- 分析页面 -->
<template>
  <div v-if="analysisData">
    <VisitTrend :stats="analysisData.uniqueVisitorTrend.dailyStats" />

    <ElRow :gutter="20">
      <ElCol :xl="10" :lg="10" :xs="24">
        <TopArticles :articles="analysisData.topArticles" />
      </ElCol>
      <ElCol :xl="7" :lg="7" :xs="24">
        <CategoryDistribution :categories="analysisData.categoryDistribution" />
      </ElCol>
      <ElCol :xl="7" :lg="7" :xs="24">
        <CommentSource :sources="analysisData.commentSource" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="14" :lg="14" :xs="24">
        <InteractionTrend :trend="analysisData.interactionTrend" />
      </ElCol>
      <ElCol :xl="10" :lg="10" :xs="24">
        <TagRadar :tags="analysisData.tagRadar" />
      </ElCol>
    </ElRow>
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

  async function loadData() {
    loading.value = true;
    try {
      analysisData.value = await fetchAnalysisData();
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadData();
  });
</script>
