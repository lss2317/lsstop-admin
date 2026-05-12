<template>
  <div class="art-card h-72 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>近30天访客趋势</h4>
        <p>每日独立访客数</p>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
  </div>
</template>

<script setup lang="ts">
  import type { AnalysisDailyItem } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  /** GET /dashboard/analysis → uniqueVisitorTrend.dailyStats */
  const props = withDefaults(
    defineProps<{
      stats?: AnalysisDailyItem[];
    }>(),
    {
      stats: () => [
        { date: '2026-04-08', count: 42 },
        { date: '2026-04-09', count: 55 },
        { date: '2026-04-10', count: 38 },
        { date: '2026-04-11', count: 61 },
        { date: '2026-04-12', count: 48 },
        { date: '2026-04-13', count: 72 },
        { date: '2026-04-14', count: 65 },
        { date: '2026-04-15', count: 53 },
        { date: '2026-04-16', count: 44 },
        { date: '2026-04-17', count: 58 },
        { date: '2026-04-18', count: 67 },
        { date: '2026-04-19', count: 49 },
        { date: '2026-04-20', count: 73 },
        { date: '2026-04-21', count: 62 },
        { date: '2026-04-22', count: 51 },
        { date: '2026-04-23', count: 45 },
        { date: '2026-04-24', count: 69 },
        { date: '2026-04-25', count: 57 },
        { date: '2026-04-26', count: 83 },
        { date: '2026-04-27', count: 76 },
        { date: '2026-04-28', count: 64 },
        { date: '2026-04-29', count: 52 },
        { date: '2026-04-30', count: 47 },
        { date: '2026-05-01', count: 71 },
        { date: '2026-05-02', count: 59 },
        { date: '2026-05-03', count: 88 },
        { date: '2026-05-04', count: 74 },
        { date: '2026-05-05', count: 63 },
        { date: '2026-05-06', count: 56 },
        { date: '2026-05-07', count: 81 }
      ]
    }
  );

  const xAxisData = computed(() => props.stats.map((item) => formatDateShort(item.date)));
  const chartData = computed(() => props.stats.map((item) => item.count));
</script>
