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
  const props = withDefaults(
    defineProps<{
      trend?: InteractionTrend;
    }>(),
    {
      trend: () => ({
        dailyData: [
          { date: '2026-05-01', comment: 18, message: 8, like: 32 },
          { date: '2026-05-02', comment: 25, message: 12, like: 45 },
          { date: '2026-05-03', comment: 12, message: 6, like: 28 },
          { date: '2026-05-04', comment: 30, message: 15, like: 52 },
          { date: '2026-05-05', comment: 22, message: 10, like: 38 },
          { date: '2026-05-06', comment: 35, message: 18, like: 60 },
          { date: '2026-05-07', comment: 28, message: 14, like: 48 }
        ]
      })
    }
  );

  const xAxisData = computed(() => props.trend.dailyData.map((d) => formatDateShort(d.date)));
  const chartData = computed(() => [
    { name: '评论', data: props.trend.dailyData.map((d) => d.comment) },
    { name: '留言', data: props.trend.dailyData.map((d) => d.message) },
    { name: '点赞', data: props.trend.dailyData.map((d) => d.like) }
  ]);
</script>
