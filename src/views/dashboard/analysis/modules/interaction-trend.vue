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
  import type { LineDataItem } from '@/types/component/chart';
  import { formatDateShort } from '@/utils/format';

  // 近7天日期（由后端返回 yyyy-MM-dd 格式）
  const dates = [
    '2026-05-01',
    '2026-05-02',
    '2026-05-03',
    '2026-05-04',
    '2026-05-05',
    '2026-05-06',
    '2026-05-07'
  ];
  const xAxisData = dates.map(formatDateShort);

  // 互动数据对比（由后端返回）
  const chartData = computed<LineDataItem[]>(() => [
    {
      name: '评论',
      data: [18, 25, 12, 30, 22, 35, 28]
    },
    {
      name: '留言',
      data: [8, 12, 6, 15, 10, 18, 14]
    },
    {
      name: '点赞',
      data: [32, 45, 28, 52, 38, 60, 48]
    }
  ]);
</script>
