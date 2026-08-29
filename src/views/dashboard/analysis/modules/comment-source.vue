<template>
  <div class="art-card min-w-0 h-100 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>评论来源分布</h4>
        <p>已通过审核的评论来源</p>
      </div>
    </div>
    <ArtRingChart
      v-if="hasChartData"
      height="calc(100% - 40px)"
      :data="chartData"
      :showLegend="true"
      legendPosition="bottom"
      :centerText="totalCount.toLocaleString()"
      centerSubText="评论"
    />
    <div v-else class="flex h-[calc(100%_-_40px)] min-h-[180px] items-center justify-center">
      <ElEmpty description="暂无评论来源数据" :image-size="80" />
    </div>
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
  const props = defineProps<{
    sources: CommentSourceItem[];
  }>();

  /** 将 CommentSourceItem[] 转换为图表所需的 { name, value }[] */
  const chartData = computed(() =>
    (Array.isArray(props.sources) ? props.sources : [])
      .filter((item) => Number.isFinite(item.value) && item.value > 0)
      .map((item) => ({
        name: TARGET_TYPE_LABEL[item.targetType] ?? '未知',
        value: item.value
      }))
  );
  const hasChartData = computed(() => chartData.value.length > 0);
  const totalCount = computed(() => chartData.value.reduce((sum, item) => sum + item.value, 0));
</script>
