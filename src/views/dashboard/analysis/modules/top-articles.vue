<template>
  <div class="art-card h-100 p-5 mb-5 overflow-hidden max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>热门文章 Top7</h4>
        <p>按浏览量排序</p>
      </div>
    </div>
    <ArtHBarChart
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="articleNames"
      :showAxisLine="false"
      barWidth="45%"
    />
  </div>
</template>

<script setup lang="ts">
  import type { TopArticleItem } from '@/apis/dashboard/types';

  /** 热门文章 Top7（按浏览量排序） */
  const props = withDefaults(
    defineProps<{
      articles?: TopArticleItem[];
    }>(),
    {
      articles: () => [
        { name: 'Docker部署实战', viewCount: 320 },
        { name: 'TypeScript进阶', viewCount: 480 },
        { name: 'Vue3组合式API', viewCount: 560 },
        { name: 'Nest.js入门', viewCount: 620 },
        { name: 'Redis缓存策略', viewCount: 750 },
        { name: 'MySQL优化指南', viewCount: 890 },
        { name: 'Git工作流', viewCount: 1200 }
      ]
    }
  );

  /** 图表 X 轴标签（文章标题） */
  const articleNames = computed(() => props.articles.map((a) => a.name));

  /** 图表数据（浏览量） */
  const chartData = computed(() => props.articles.map((a) => a.viewCount));
</script>
