<template>
  <div class="art-card min-w-0 h-105 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>近十天访问量</h4>
      </div>
    </div>
    <ArtLineChart
      v-if="hasChartData"
      height="calc(100% - 56px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
    <div v-else class="flex h-[calc(100%_-_40px)] min-h-[180px] items-center justify-center">
      <ElEmpty description="暂无访问趋势数据" :image-size="80" />
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
</script>
