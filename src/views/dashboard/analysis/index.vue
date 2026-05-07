<!-- 分析页面 -->
<template>
  <div>
    <VisitTrend />

    <ElRow :gutter="20">
      <ElCol :xl="10" :lg="10" :xs="24">
        <TopArticles />
      </ElCol>
      <ElCol :xl="7" :lg="7" :xs="24">
        <CategoryDistribution />
      </ElCol>
      <ElCol :xl="7" :lg="7" :xs="24">
        <CommentSource />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="14" :lg="14" :xs="24">
        <InteractionTrend />
      </ElCol>
      <ElCol :xl="10" :lg="10" :xs="24">
        <TagRadar />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import VisitTrend from './modules/visit-trend.vue';
  import CommentSource from './modules/comment-source.vue';
  import TopArticles from './modules/top-articles.vue';
  import CategoryDistribution from './modules/category-distribution.vue';
  import InteractionTrend from './modules/interaction-trend.vue';
  import TagRadar from './modules/tag-radar.vue';

  defineOptions({ name: 'Analysis' });
</script>
