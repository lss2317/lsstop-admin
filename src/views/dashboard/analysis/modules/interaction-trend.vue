<template>
  <div class="art-card min-w-0 h-82 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>互动趋势对比</h4>
        <p>近7天评论、留言、点赞变化</p>
      </div>
    </div>
    <ArtLineChart
      v-if="hasChartData"
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showLegend="true"
      :showAxisLine="false"
      :showSplitLine="true"
    />
    <div v-else class="flex h-[calc(100%_-_40px)] min-h-[180px] items-center justify-center">
      <ElEmpty description="暂无互动趋势数据" :image-size="80" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { InteractionTrend } from '@/apis/dashboard/types';
  import { formatDateShort } from '@/utils/format';

  /** 互动趋势（近7天评论、留言、点赞变化） */
  const props = defineProps<{
    trend: InteractionTrend;
  }>();

  const dailyData = computed(() =>
    (Array.isArray(props.trend?.dailyData) ? props.trend.dailyData : [])
      .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date))
      .map((item) => ({
        ...item,
        comment: Number.isFinite(item.comment) ? Math.max(0, item.comment) : 0,
        message: Number.isFinite(item.message) ? Math.max(0, item.message) : 0,
        like: Number.isFinite(item.like) ? Math.max(0, item.like) : 0
      }))
  );
  const hasChartData = computed(() => dailyData.value.length > 0);
  const xAxisData = computed(() => dailyData.value.map((d) => formatDateShort(d.date)));
  const chartData = computed(() => [
    { name: '评论', data: dailyData.value.map((d) => d.comment) },
    { name: '留言', data: dailyData.value.map((d) => d.message) },
    { name: '点赞', data: dailyData.value.map((d) => d.like) }
  ]);
</script>
