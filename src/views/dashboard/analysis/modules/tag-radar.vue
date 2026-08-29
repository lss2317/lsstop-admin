<template>
  <div class="art-card min-w-0 h-82 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>标签热度分析</h4>
        <p>热门标签文章数量对比</p>
      </div>
    </div>
    <ArtRadarChart
      v-if="hasChartData"
      height="calc(100% - 40px)"
      :indicator="indicator"
      :data="radarData"
    />
    <div v-else class="flex h-[calc(100%_-_40px)] min-h-[180px] items-center justify-center">
      <ElEmpty description="暂无标签热度数据" :image-size="80" />
    </div>
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

  const validTags = computed(() =>
    (Array.isArray(props.tags) ? props.tags : [])
      .filter(
        (tag) =>
          typeof tag.name === 'string' &&
          tag.name.trim().length > 0 &&
          Number.isFinite(tag.value) &&
          tag.value > 0
      )
      .map((tag) => ({ ...tag, name: tag.name.trim() }))
  );
  const hasChartData = computed(() => validTags.value.length > 0);

  /** 雷达图维度指标：从数据中推导 max 值，name 过长则截断 */
  const indicator = computed(() => {
    const maxVal = Math.max(1, ...validTags.value.map((t) => t.value));
    return validTags.value.map((t) => ({ name: truncate(t.name), max: maxVal }));
  });

  /** 雷达图数据系列 */
  const radarData = computed(() => [
    {
      name: '文章数量',
      value: validTags.value.map((t) => t.value)
    }
  ]);
</script>
