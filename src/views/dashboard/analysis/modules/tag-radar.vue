<template>
  <div class="art-card min-w-0 h-82 p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>热门标签排行</h4>
        <p>按公开文章数量排序</p>
      </div>
    </div>
    <ArtHBarChart
      v-if="hasChartData"
      height="calc(100% - 40px)"
      :data="chartData"
      :xAxisData="tagNames"
      :showAxisLine="false"
      :showDataLabel="true"
      barWidth="42%"
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
      .sort((a, b) => b.value - a.value)
  );
  const hasChartData = computed(() => validTags.value.length > 0);

  /** 水平柱状图从下往上排列，反转后最高热度显示在顶部 */
  const reversedTags = computed(() => [...validTags.value].reverse());

  const tagNames = computed(() =>
    reversedTags.value.map((tag) =>
      tag.name.length > 10 ? `${tag.name.slice(0, 10)}...` : tag.name
    )
  );
  const chartData = computed(() => reversedTags.value.map((tag) => tag.value));
</script>
