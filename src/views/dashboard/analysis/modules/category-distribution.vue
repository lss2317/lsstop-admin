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

  /** 聚合小分类、截断过长名称，避免图例溢出 */
  const chartData = computed(() => {
    const truncate = (s: string, max = 10) => (s.length > max ? s.slice(0, max) + '…' : s);

    const list =
      props.categories.length <= 6
        ? props.categories
        : (() => {
            const sorted = [...props.categories].sort((a, b) => b.value - a.value);
            const top5 = sorted.slice(0, 5);
            const otherValue = sorted.slice(5).reduce((sum, c) => sum + c.value, 0);
            return otherValue > 0 ? [...top5, { name: '其他', value: otherValue }] : top5;
          })();

    return list.map((c) => ({ ...c, name: truncate(c.name) }));
  });
</script>
