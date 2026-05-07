<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>互动趋势对比</h4>
        <p>近7天评论、留言、点赞变化</p>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showLegend="true"
      :showAxisLine="false"
      :showSplitLine="true"
    />
  </div>
</template>

<script setup lang="ts">
  import type { LineDataItem } from '@/types/component/chart';

  /**
   * 动态生成近 7 天日期标签（M/D 格式，不含今天）
   */
  const xAxisData = (() => {
    const days: string[] = [];
    const now = new Date();
    for (let i = 7; i >= 1; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return days;
  })();

  /**
   * 互动数据对比（对应 blog_comment、blog_message、blog_like_record）
   */
  const chartData = computed<LineDataItem[]>(() => [
    {
      name: '评论',
      data: [18, 25, 12, 30, 22, 35, 28]
    },
    {
      name: '留言',
      data: [8, 12, 6, 15, 10, 18, 14]
    },
    {
      name: '点赞',
      data: [32, 45, 28, 52, 38, 60, 48]
    }
  ]);
</script>
