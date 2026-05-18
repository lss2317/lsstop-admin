<template>
  <div class="art-card h-100 p-5 mb-5 overflow-hidden max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>热门文章 Top{{ articles.length }}</h4>
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
  const props = defineProps<{
    articles: TopArticleItem[];
  }>();

  /** 反转数据：ECharts 水平柱状图默认从下往上排列，反转后高值在上 */
  const reversed = computed(() => [...props.articles].reverse());

  /** 图表 Y 轴标签（文章标题，15字截断） */
  const articleNames = computed(() =>
    reversed.value.map((a) => (a.name.length > 15 ? a.name.slice(0, 15) + '...' : a.name))
  );

  /** 图表数据（浏览量） */
  const chartData = computed(() => reversed.value.map((a) => a.viewCount));
</script>
