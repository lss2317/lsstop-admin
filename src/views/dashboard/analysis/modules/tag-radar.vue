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
  import type { TagRadarItem } from '@/apis/dashboard/types';

  /** 标签热度 */
  const props = withDefaults(
    defineProps<{
      tags?: TagRadarItem[];
    }>(),
    {
      tags: () => [
        { name: 'Vue', value: 22 },
        { name: 'React', value: 12 },
        { name: 'Node.js', value: 18 },
        { name: 'TypeScript', value: 25 },
        { name: 'Docker', value: 8 },
        { name: 'MySQL', value: 15 }
      ]
    }
  );

  /** 雷达图维度指标：从数据中推导 max 值 */
  const indicator = computed(() => {
    const maxVal = Math.max(...props.tags.map((t) => t.value));
    return props.tags.map((t) => ({ name: t.name, max: maxVal }));
  });

  /** 雷达图数据系列 */
  const radarData = computed(() => [
    {
      name: '文章数量',
      value: props.tags.map((t) => t.value)
    }
  ]);
</script>
