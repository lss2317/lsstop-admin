<template>
  <div class="art-card min-w-0 h-100 p-5 overflow-hidden max-xl:col-span-2 max-sm:col-span-1">
    <div class="art-card-header">
      <div class="title">
        <h4>热门文章 Top{{ validArticles.length }}</h4>
        <p>按浏览量排序</p>
      </div>
    </div>
    <ArtHBarChart
      v-if="hasChartData"
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="articleNames"
      :showAxisLine="false"
      :showDataLabel="true"
      barWidth="45%"
    />
    <div v-else class="flex h-[calc(100%_-_40px)] min-h-[180px] items-center justify-center">
      <ElEmpty description="暂无热门文章数据" :image-size="80" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { TopArticleItem } from '@/apis/dashboard/types';

  /** 热门文章 Top7（按浏览量排序） */
  const props = defineProps<{
    articles: TopArticleItem[];
  }>();

  /** 反转数据：ECharts 水平柱状图默认从下往上排列，反转后高值在上 */
  const validArticles = computed(() =>
    (Array.isArray(props.articles) ? props.articles : [])
      .filter(
        (article) =>
          typeof article.name === 'string' &&
          article.name.trim().length > 0 &&
          Number.isFinite(article.viewCount)
      )
      .map((article) => ({ ...article, viewCount: Math.max(0, article.viewCount) }))
  );
  const hasChartData = computed(() => validArticles.value.length > 0);
  const reversed = computed(() => [...validArticles.value].reverse());

  /** 图表 Y 轴标签（文章标题，15字截断） */
  const articleNames = computed(() =>
    reversed.value.map((a) => (a.name.length > 15 ? a.name.slice(0, 15) + '...' : a.name))
  );

  /** 图表数据（浏览量） */
  const chartData = computed(() => reversed.value.map((a) => a.viewCount));
</script>
