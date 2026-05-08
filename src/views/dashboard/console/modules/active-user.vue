<template>
  <div class="art-card h-105 p-4 box-border mb-5 max-sm:mb-4">
    <div class="art-card-header mb-2">
      <div class="title">
        <h4>近七天评论统计</h4>
      </div>
    </div>
    <ArtBarChart
      class="box-border p-2"
      barWidth="50%"
      height="16rem"
      :showAxisLine="false"
      :data="chartData"
      :xAxisData="xAxisLabels"
    />

    <div class="flex-b mt-2">
      <div class="flex-1 text-center" v-for="(item, index) in list" :key="index">
        <p class="text-2xl text-g-900">{{ item.num }}</p>
        <p class="text-xs text-g-500 mt-1">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDateShort } from '@/utils/format';

  interface ArticleStatItem {
    name: string;
    num: string;
  }

  // 近七天日期（由后端返回 yyyy-MM-dd 格式）
  const dates = [
    '2026-05-01',
    '2026-05-02',
    '2026-05-03',
    '2026-05-04',
    '2026-05-05',
    '2026-05-06',
    '2026-05-07'
  ];
  const xAxisLabels = dates.map(formatDateShort);

  // 近七天每日评论数（由后端返回）
  const chartData = [18, 25, 12, 30, 22, 35, 28];

  /**
   * 评论统计数据
   */
  const list: ArticleStatItem[] = [
    { name: '待审核', num: '12' },
    { name: '今日新增', num: '35' },
    { name: '日均评论', num: '24' },
    { name: '周同比', num: '+15%' }
  ];
</script>
