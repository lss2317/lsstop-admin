<template>
  <div class="art-card h-105 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>近十天访问量</h4>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 56px)"
      :data="data"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
  </div>
</template>

<script setup lang="ts">
  /**
   * 近十天访问量数据（模拟）
   */
  const data = [50, 25, 40, 20, 70, 35, 65, 30, 35, 20];

  /**
   * 动态生成近十天日期标签（M/D 格式，不含今天）
   */
  const xAxisData = (() => {
    const days: string[] = [];
    const now = new Date();
    for (let i = 10; i >= 1; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return days;
  })();
</script>
