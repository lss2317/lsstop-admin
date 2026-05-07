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
  interface ArticleStatItem {
    name: string;
    num: string;
  }

  /**
   * 动态生成近 7 天日期标签（M/D 格式，不含今天）
   */
  const xAxisLabels = (() => {
    const days: string[] = [];
    const now = new Date();
    for (let i = 7; i >= 1; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return days;
  })();

  // 近七天每日评论数（模拟）
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
