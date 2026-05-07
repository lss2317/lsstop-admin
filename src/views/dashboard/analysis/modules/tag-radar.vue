<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>标签热度分析</h4>
        <p>各标签下文章数量对比</p>
      </div>
    </div>
    <ArtRadarChart height="calc(100% - 40px)" :indicator="indicator" :data="radarData" />
  </div>
</template>

<script setup lang="ts">
  /**
   * 雷达图维度指标（对应 blog_tag 表中的热门标签）
   */
  const indicator = [
    { name: 'Vue', max: 30 },
    { name: 'React', max: 30 },
    { name: 'Node.js', max: 30 },
    { name: 'TypeScript', max: 30 },
    { name: 'Docker', max: 30 },
    { name: 'MySQL', max: 30 }
  ];

  /**
   * 标签对应的文章数量（对应 blog_article_tag 关联统计）
   */
  const radarData = [
    {
      name: '文章数量',
      value: [22, 12, 18, 25, 8, 15]
    }
  ];
</script>
