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
  import { computed } from 'vue';
  import type { CommentStat } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  const props = defineProps<{
    data: CommentStat;
  }>();

  const xAxisLabels = computed(() => props.data.dailyStats.map((d) => formatDateShort(d.date)));
  const chartData = computed(() => props.data.dailyStats.map((d) => d.count));

  /** 底部统计指标（前端配置 label，后端提供 value） */
  const list = computed(() => [
    { name: '总数', num: String(props.data.totalCount) },
    { name: '今日新增', num: String(props.data.todayCount) },
    { name: '日均评论', num: String(props.data.dailyAvg) },
    { name: '周同比', num: props.data.weekOverWeek }
  ]);
</script>
