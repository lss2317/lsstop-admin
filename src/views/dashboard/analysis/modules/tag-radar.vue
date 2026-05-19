<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>标签热度分析</h4>
        <p>热门标签文章数量对比</p>
      </div>
    </div>
    <ArtRadarChart height="calc(100% - 40px)" :indicator="indicator" :data="radarData" />
  </div>
</template>

<script setup lang="ts">
  import type { TagRadarItem } from '@/apis/dashboard/types';

  /** 标签热度 */
  const props = defineProps<{
    tags: TagRadarItem[];
  }>();

  /** 截断过长标签名 */
  const truncate = (str: string, maxLen = 10) =>
    str.length > maxLen ? str.slice(0, maxLen) + '...' : str;

  /** 雷达图维度指标：从数据中推导 max 值，name 过长则截断 */
  const indicator = computed(() => {
    const maxVal = Math.max(...props.tags.map((t) => t.value));
    return props.tags.map((t) => ({ name: truncate(t.name), max: maxVal }));
  });

  /** 雷达图数据系列 */
  const radarData = computed(() => [
    {
      name: '文章数量',
      value: props.tags.map((t) => t.value)
    }
  ]);
</script>
