<template>
  <div class="art-card h-100 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>文章分类占比</h4>
      </div>
    </div>
    <ArtRingChart
      height="calc(100% - 30px)"
      :data="chartData"
      :showLegend="true"
      legendPosition="bottom"
      :showLabel="true"
    />
  </div>
</template>

<script setup lang="ts">
  /**
   * 文章分类分布数据（对应 blog_category + blog_article）
   */
  const chartData = [
    { name: '前端开发', value: 45 },
    { name: '后端技术', value: 32 },
    { name: '数据库', value: 18 },
    { name: '运维部署', value: 12 },
    { name: '工具效率', value: 8 },
    { name: '其他', value: 5 }
  ];
</script>
