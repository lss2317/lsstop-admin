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

  /** 近30天独立访客趋势 */
  const props = defineProps<{
    stats: AnalysisDailyItem[];
  }>();

  const xAxisData = computed(() => props.stats.map((item) => formatDateShort(item.date)));
  const chartData = computed(() => props.stats.map((item) => item.count));
</script>
