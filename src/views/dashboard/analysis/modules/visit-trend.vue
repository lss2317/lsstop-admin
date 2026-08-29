<template>
  <div class="art-card min-w-0 h-72 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>近30天访客趋势</h4>
        <p>每日独立访客数</p>
      </div>
    </div>
    <ArtLineChart
      v-if="hasChartData"
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
    <div v-else class="flex h-[calc(100%_-_40px)] min-h-[180px] items-center justify-center">
      <ElEmpty description="暂无访客趋势数据" :image-size="80" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { AnalysisDailyItem } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  /** 近30天独立访客趋势 */
  const props = defineProps<{
    stats: AnalysisDailyItem[];
  }>();

  const validStats = computed(() =>
    (Array.isArray(props.stats) ? props.stats : []).filter(
      (item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(item.count)
    )
  );
  const hasChartData = computed(() => validStats.value.length > 0);
  const xAxisData = computed(() => validStats.value.map((item) => formatDateShort(item.date)));
  const chartData = computed(() => validStats.value.map((item) => Math.max(0, item.count)));
</script>
