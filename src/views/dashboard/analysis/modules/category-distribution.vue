<template>
  <div class="art-card min-w-0 h-100 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>文章分类占比</h4>
      </div>
    </div>
    <ArtRingChart
      v-if="hasChartData"
      height="calc(100% - 30px)"
      :data="chartData"
      :showLegend="true"
      legendPosition="bottom"
      :showLabel="false"
    />
    <div v-else class="flex h-[calc(100%_-_40px)] min-h-[180px] items-center justify-center">
      <ElEmpty description="暂无分类分布数据" :image-size="80" />
    </div>
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

    const categories = (Array.isArray(props.categories) ? props.categories : [])
      .filter(
        (category) =>
          typeof category.name === 'string' &&
          category.name.trim().length > 0 &&
          Number.isFinite(category.value) &&
          category.value > 0
      )
      .map((category) => ({ ...category, name: category.name.trim() }));

    const list =
      categories.length <= 6
        ? categories
        : (() => {
            const sorted = [...categories].sort((a, b) => b.value - a.value);
            const top5 = sorted.slice(0, 5);
            const otherValue = sorted.slice(5).reduce((sum, c) => sum + c.value, 0);
            return otherValue > 0 ? [...top5, { name: '其他', value: otherValue }] : top5;
          })();

    return list.map((c) => ({ ...c, name: truncate(c.name) }));
  });

  const hasChartData = computed(() => chartData.value.length > 0);
</script>
