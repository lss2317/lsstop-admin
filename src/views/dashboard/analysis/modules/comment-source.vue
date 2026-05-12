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
  import type { CommentSourceItem } from '@/apis/dashboard/types';

  /** 评论目标类型 → 展示文案 */
  const TARGET_TYPE_LABEL: Record<CommentSourceItem['targetType'], string> = {
    1: '文章评论',
    2: '友链评论',
    3: '说说评论'
  };

  /** 评论来源分布（按目标类型统计） */
  const props = withDefaults(
    defineProps<{
      sources?: CommentSourceItem[];
    }>(),
    {
      sources: () => [
        { targetType: 1, value: 156 },
        { targetType: 2, value: 32 },
        { targetType: 3, value: 48 }
      ]
    }
  );

  /** 将 CommentSourceItem[] 转换为图表所需的 { name, value }[] */
  const chartData = computed(() =>
    props.sources.map((item) => ({
      name: TARGET_TYPE_LABEL[item.targetType] ?? '未知',
      value: item.value
    }))
  );
</script>
