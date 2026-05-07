<template>
  <div class="art-card h-100 p-5 mb-5 overflow-hidden max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>热门文章 Top7</h4>
        <p>按浏览量排序</p>
      </div>
    </div>
    <ArtHBarChart
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="articleNames"
      :showAxisLine="false"
      barWidth="45%"
    />
  </div>
</template>

<script setup lang="ts">
  /**
   * 热门文章数据（对应 blog_article.view_count）
   */
  const articleNames = [
    'Docker部署实战',
    'TypeScript进阶',
    'Vue3组合式API',
    'Nest.js入门',
    'Redis缓存策略',
    'MySQL优化指南',
    'Git工作流'
  ];

  const chartData = [320, 480, 560, 620, 750, 890, 1200];
</script>
