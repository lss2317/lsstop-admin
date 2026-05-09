<template>
  <div class="art-card p-5 mb-5 max-sm:mb-4 flex flex-col">
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
  interface OverviewItem {
    label: string;
    count: number;
    icon: string;
    iconBg: string;
    iconColor: string;
    numColor: string;
  }

  /** 内容概览（模拟） */
  const overviewItems: OverviewItem[] = [
    {
      label: '文章',
      count: 12,
      icon: 'ri:article-line',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      numColor: 'text-blue-500'
    },
    {
      label: '分类',
      count: 8,
      icon: 'ri:folder-line',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      numColor: 'text-green-500'
    },
    {
      label: '标签',
      count: 16,
      icon: 'ri:price-tag-3-line',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      numColor: 'text-orange-500'
    },
    {
      label: '友链',
      count: 0,
      icon: 'ri:links-line',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      numColor: 'text-purple-500'
    }
  ];
</script>
