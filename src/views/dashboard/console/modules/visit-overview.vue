<template>
  <div class="art-card h-105 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>近十天访问量</h4>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 56px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { VisitOverview } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  const props = defineProps<{
    data: VisitOverview;
  }>();

  const xAxisData = computed(() => props.data.dailyStats.map((d) => formatDateShort(d.date)));
  const chartData = computed(() => props.data.dailyStats.map((d) => d.count));
</script>
