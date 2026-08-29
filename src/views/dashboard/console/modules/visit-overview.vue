<template>
  <div class="art-card min-w-0 h-105 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>近10天访问量</h4>
        <p>同一 IP 3 小时内去重</p>
      </div>
    </div>
    <ArtLineChart
      v-if="hasChartData"
      class="box-border p-2"
      height="16rem"
      :data="chartData"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
    <div v-else class="flex h-64 items-center justify-center">
      <ElEmpty description="暂无访问趋势数据" :image-size="80" />
    </div>

    <div class="flex-b mt-2">
      <div v-for="item in summaryItems" :key="item.name" class="flex-1 text-center">
        <p class="text-2xl text-g-900">{{ item.num }}</p>
        <p class="text-xs text-g-500 mt-1">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { VisitOverview } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  const props = defineProps<{
    data: VisitOverview;
  }>();

  const dailyStats = computed(() =>
    (Array.isArray(props.data.dailyStats) ? props.data.dailyStats : []).filter(
      (item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(item.count)
    )
  );
  const hasChartData = computed(() => dailyStats.value.length > 0);
  const xAxisData = computed(() => dailyStats.value.map((d) => formatDateShort(d.date)));
  const chartData = computed(() => dailyStats.value.map((d) => Math.max(0, d.count)));

  const summaryItems = computed(() => {
    const counts = chartData.value;
    const total = counts.reduce((sum, count) => sum + count, 0);
    const average = counts.length > 0 ? Math.round((total / counts.length) * 10) / 10 : 0;

    return [
      { name: '近10日访问', num: total.toLocaleString() },
      { name: '今日访问', num: (counts.at(-1) || 0).toLocaleString() },
      { name: '日均访问', num: average.toLocaleString() },
      { name: '单日峰值', num: Math.max(0, ...counts).toLocaleString() }
    ];
  });
</script>
