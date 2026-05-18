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
  const props = defineProps<{
    categories: CategoryItem[];
  }>();

  /** 截断过长分类名 */
  const truncate = (str: string, maxLen = 10) =>
    str.length > maxLen ? str.slice(0, maxLen) + '...' : str;

  /** CategoryItem 与 PieDataItem 结构兼容，name 过长则截断 */
  const chartData = computed(() => props.categories.map((c) => ({ ...c, name: truncate(c.name) })));
</script>
