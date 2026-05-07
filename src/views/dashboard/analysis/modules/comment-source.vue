<template>
  <div class="art-card h-100 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>评论来源分布</h4>
        <p>按评论目标类型统计</p>
      </div>
    </div>
    <ArtRingChart
      height="calc(100% - 40px)"
      :data="chartData"
      :showLegend="true"
      legendPosition="bottom"
      centerText="评论"
    />
  </div>
</template>

<script setup lang="ts">
  /**
   * 评论来源分布数据（对应 blog_comment.target_type）
   * target_type: 1文章 2友链 3说说
   */
  const chartData = [
    { name: '文章评论', value: 156 },
    { name: '友链评论', value: 32 },
    { name: '说说评论', value: 48 }
  ];
</script>
