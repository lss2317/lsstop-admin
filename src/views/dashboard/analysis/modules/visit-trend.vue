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
  /**
   * 动态生成近 30 天日期标签（M/D 格式，不含今天）
   */
  const xAxisData = (() => {
    const days: string[] = [];
    const now = new Date();
    for (let i = 30; i >= 1; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return days;
  })();

  /**
   * 近30天每日访问量（模拟数据，对应 blog_unique_view 表）
   */
  const chartData = [
    42, 55, 38, 61, 48, 72, 65, 53, 44, 58, 67, 49, 73, 62, 51, 45, 69, 57, 83, 76, 64, 52, 47, 71,
    59, 88, 74, 63, 56, 81
  ];
</script>
