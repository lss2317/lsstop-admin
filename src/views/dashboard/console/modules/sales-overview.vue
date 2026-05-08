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
  import { formatDateShort } from '@/utils/format';

  // 近十天访问量数据（由后端返回）
  const data = [50, 25, 40, 20, 70, 35, 65, 30, 35, 20];

  // 近十天日期（由后端返回 yyyy-MM-dd 格式）
  const dates = [
    '2026-04-28',
    '2026-04-29',
    '2026-04-30',
    '2026-05-01',
    '2026-05-02',
    '2026-05-03',
    '2026-05-04',
    '2026-05-05',
    '2026-05-06',
    '2026-05-07'
  ];
  const xAxisData = dates.map(formatDateShort);
</script>
