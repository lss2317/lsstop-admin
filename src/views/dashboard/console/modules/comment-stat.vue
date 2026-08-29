<template>
  <div class="art-card min-w-0 h-105 p-5 box-border">
    <div class="art-card-header mb-2">
      <div class="title">
        <h4>近七天评论统计</h4>
        <p>仅统计已通过审核的评论</p>
      </div>
    </div>
    <ArtBarChart
      v-if="hasChartData"
      class="box-border p-2"
      barWidth="50%"
      height="16rem"
      :showAxisLine="false"
      :data="chartData"
      :xAxisData="xAxisLabels"
    />
    <div v-else class="flex h-64 items-center justify-center">
      <ElEmpty description="暂无评论趋势数据" :image-size="80" />
    </div>

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

  const dailyStats = computed(() =>
    (Array.isArray(props.data.dailyStats) ? props.data.dailyStats : []).filter(
      (item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(item.count)
    )
  );
  const hasChartData = computed(() => dailyStats.value.length > 0);
  const xAxisLabels = computed(() => dailyStats.value.map((d) => formatDateShort(d.date)));
  const chartData = computed(() => dailyStats.value.map((d) => Math.max(0, d.count)));

  /** 底部统计指标（前端配置 label，后端提供 value） */
  const list = computed(() => [
    { name: '近7天评论', num: Math.max(0, props.data.totalCount || 0) },
    { name: '今日评论', num: Math.max(0, props.data.todayCount || 0) },
    { name: '日均评论', num: Math.max(0, props.data.dailyAvg || 0) },
    { name: '较上周', num: props.data.weekOverWeek || '+0%' }
  ]);
</script>
