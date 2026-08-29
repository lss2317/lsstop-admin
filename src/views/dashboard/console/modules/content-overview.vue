<template>
  <div class="art-card min-w-0 p-5 flex flex-col">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>内容概览</h4>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="(item, index) in overviewItems"
        :key="index"
        class="flex items-center p-3 rounded-xl border border-g-300/85"
      >
        <div class="size-9 rounded-lg flex-cc shrink-0" :class="item.iconBg">
          <ArtSvgIcon :icon="item.icon" class="text-base" :class="item.iconColor" />
        </div>
        <div v-if="item.count > 0" class="ml-2.5 flex items-baseline gap-1">
          <span class="text-lg font-semibold" :class="item.numColor">{{ item.count }}</span>
          <span class="text-xs text-g-500">{{ item.label }}</span>
        </div>
        <div v-else class="ml-2.5">
          <span class="text-xs text-g-400">暂无{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { ContentOverview } from '@/apis/dashboard/types';

  const props = defineProps<{
    data: ContentOverview;
  }>();

  interface OverviewMeta {
    key: keyof ContentOverview;
    label: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    numColor: string;
  }

  /** 前端固定配置（图标、颜色等纯展示信息） */
  const overviewMeta: OverviewMeta[] = [
    {
      key: 'articleCount',
      label: '文章',
      icon: 'ri:article-line',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      numColor: 'text-blue-500'
    },
    {
      key: 'categoryCount',
      label: '分类',
      icon: 'ri:folder-line',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      numColor: 'text-green-500'
    },
    {
      key: 'tagCount',
      label: '标签',
      icon: 'ri:price-tag-3-line',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      numColor: 'text-orange-500'
    },
    {
      key: 'friendLinkCount',
      label: '友链',
      icon: 'ri:links-line',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      numColor: 'text-purple-500'
    }
  ];

  /** 合并前端配置 + 后端数据 */
  const overviewItems = computed(() =>
    overviewMeta.map((meta) => ({
      ...meta,
      count: Number.isFinite(props.data[meta.key]) ? Math.max(0, props.data[meta.key]) : 0
    }))
  );
</script>
