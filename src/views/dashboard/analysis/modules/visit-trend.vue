<template>
  <div class="art-card min-w-0 h-88 p-5 max-sm:h-100">
    <div class="art-card-header">
      <div class="title">
        <h4>近30天独立访客</h4>
        <p>每日独立访客数</p>
      </div>
    </div>
    <ArtLineChart
      v-if="hasChartData"
      height="12.5rem"
      :data="chartData"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
    <div v-else class="flex h-50 items-center justify-center">
      <ElEmpty description="暂无访客趋势数据" :image-size="80" />
    </div>

    <div class="grid grid-cols-4 gap-2 border-t border-g-200/60 pt-3 max-sm:grid-cols-2">
      <div v-for="item in summaryItems" :key="item.name" class="text-center">
        <p class="text-lg font-medium text-g-900">{{ item.num }}</p>
        <p class="mt-0.5 text-xs text-g-500">{{ item.name }}</p>
      </div>
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

  const summaryItems = computed(() => {
    const counts = chartData.value;
    const recent7Days = counts.slice(-7);
    const recent7Average = recent7Days.length
      ? Math.round((recent7Days.reduce((sum, count) => sum + count, 0) / recent7Days.length) * 10) /
        10
      : 0;

    return [
      { name: '今日 UV', num: (counts.at(-1) || 0).toLocaleString() },
      { name: '近7日平均', num: recent7Average.toLocaleString() },
      { name: '30日峰值', num: Math.max(0, ...counts).toLocaleString() },
      { name: '有访问天数', num: counts.filter((count) => count > 0).length.toLocaleString() }
    ];
  });
</script>
