<template>
  <div class="art-card h-105 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>近十天访问量</h4>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 56px)"
      :data="data"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
  </div>
</template>

<script setup lang="ts">
  import type { DailyStatItem } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  /** 近十天每日访问量（后端返回，date+count 一体不会错位） */
  const dailyStats: DailyStatItem[] = [
    { date: '2026-04-28', count: 50 },
    { date: '2026-04-29', count: 25 },
    { date: '2026-04-30', count: 40 },
    { date: '2026-05-01', count: 20 },
    { date: '2026-05-02', count: 70 },
    { date: '2026-05-03', count: 35 },
    { date: '2026-05-04', count: 65 },
    { date: '2026-05-05', count: 30 },
    { date: '2026-05-06', count: 35 },
    { date: '2026-05-07', count: 20 }
  ];

  const xAxisData = dailyStats.map((d) => formatDateShort(d.date));
  const data = dailyStats.map((d) => d.count);
</script>
