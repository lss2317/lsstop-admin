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
  import { formatDateShort } from '@/utils/format';

  // 近30天日期（由后端返回 yyyy-MM-dd 格式）
  const dates = [
    '2026-04-08',
    '2026-04-09',
    '2026-04-10',
    '2026-04-11',
    '2026-04-12',
    '2026-04-13',
    '2026-04-14',
    '2026-04-15',
    '2026-04-16',
    '2026-04-17',
    '2026-04-18',
    '2026-04-19',
    '2026-04-20',
    '2026-04-21',
    '2026-04-22',
    '2026-04-23',
    '2026-04-24',
    '2026-04-25',
    '2026-04-26',
    '2026-04-27',
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

  // 近30天每日独立访客数（由后端返回）
  const chartData = [
    42, 55, 38, 61, 48, 72, 65, 53, 44, 58, 67, 49, 73, 62, 51, 45, 69, 57, 83, 76, 64, 52, 47, 71,
    59, 88, 74, 63, 56, 81
  ];
</script>
