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
  import type { DailyStatItem } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  interface ArticleStatItem {
    name: string;
    num: string;
  }

  /** 近七天每日评论（后端返回，date+count 一体不会错位） */
  const dailyStats: DailyStatItem[] = [
    { date: '2026-05-01', count: 18 },
    { date: '2026-05-02', count: 25 },
    { date: '2026-05-03', count: 12 },
    { date: '2026-05-04', count: 30 },
    { date: '2026-05-05', count: 22 },
    { date: '2026-05-06', count: 35 },
    { date: '2026-05-07', count: 28 }
  ];

  const xAxisLabels = dailyStats.map((d) => formatDateShort(d.date));
  const chartData = dailyStats.map((d) => d.count);

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
