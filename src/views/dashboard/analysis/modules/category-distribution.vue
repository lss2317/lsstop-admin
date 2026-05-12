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
      :showLabel="false"
    />
  </div>
</template>

<script setup lang="ts">
  import type { CategoryItem } from '@/apis/dashboard/types';

  /** 文章分类分布 */
  const props = withDefaults(
    defineProps<{
      categories?: CategoryItem[];
    }>(),
    {
      categories: () => [
        { name: '前端开发', value: 45 },
        { name: '后端技术', value: 32 },
        { name: '数据库', value: 18 },
        { name: '运维部署', value: 12 },
        { name: '工具效率', value: 8 },
        { name: '其他', value: 5 }
      ]
    }
  );

  /** CategoryItem 与 PieDataItem 结构兼容，直接透传 */
  const chartData = computed(() => props.categories);
</script>
