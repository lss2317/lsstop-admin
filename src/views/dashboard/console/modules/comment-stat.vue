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
  import type { CommentStat } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  /**
   * 后端返回数据（模拟）
   * 来源：GET /dashboard/console → ConsoleData.commentStat
   */
  const commentStat: CommentStat = {
    dailyStats: [
      { date: '2026-05-01', count: 18 },
      { date: '2026-05-02', count: 25 },
      { date: '2026-05-03', count: 12 },
      { date: '2026-05-04', count: 30 },
      { date: '2026-05-05', count: 22 },
      { date: '2026-05-06', count: 35 },
      { date: '2026-05-07', count: 28 }
    ],
    totalCount: 170,
    todayCount: 35,
    dailyAvg: 24,
    weekOverWeek: '+15%'
  };

  const xAxisLabels = commentStat.dailyStats.map((d) => formatDateShort(d.date));
  const chartData = commentStat.dailyStats.map((d) => d.count);

  /** 底部统计指标（前端配置 label，后端提供 value） */
  const list = [
    { name: '总数', num: String(commentStat.totalCount) },
    { name: '今日新增', num: String(commentStat.todayCount) },
    { name: '日均评论', num: String(commentStat.dailyAvg) },
    { name: '周同比', num: commentStat.weekOverWeek }
  ];
</script>
