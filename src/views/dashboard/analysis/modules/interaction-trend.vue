<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>互动趋势对比</h4>
        <p>近7天评论、留言、点赞变化</p>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showLegend="true"
      :showAxisLine="false"
      :showSplitLine="true"
    />
  </div>
</template>

<script setup lang="ts">
  import type { InteractionTrend } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  /** 互动趋势（近7天评论、留言、点赞变化） */
  const props = defineProps<{
    trend: InteractionTrend;
  }>();

  const xAxisData = computed(() => props.trend.dailyData.map((d) => formatDateShort(d.date)));
  const chartData = computed(() => [
    { name: '评论', data: props.trend.dailyData.map((d) => d.comment) },
    { name: '留言', data: props.trend.dailyData.map((d) => d.message) },
    { name: '点赞', data: props.trend.dailyData.map((d) => d.like) }
  ]);
</script>
