<template>
  <div class="art-card p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>待处理</h4>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="(item, index) in pendingItems"
        :key="index"
        class="flex items-center justify-between p-4 rounded-xl border border-g-300/85 hover:border-theme/50 transition-colors cursor-pointer"
      >
        <div class="flex items-center">
          <div class="size-10 rounded-lg flex-cc" :class="item.iconBg">
            <ArtSvgIcon :icon="item.icon" class="text-lg" :class="item.iconColor" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-g-800 font-medium">{{ item.title }}</p>
            <p class="text-xs text-g-500 mt-0.5">{{ item.desc }}</p>
          </div>
        </div>
        <span v-if="item.num > 0" class="text-2xl font-semibold" :class="item.numColor">{{
          item.num
        }}</span>
        <span v-else class="text-xs text-g-400">无待处理</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { PendingReview } from '@/apis/dashboard/types';

  const props = defineProps<{
    data: PendingReview;
  }>();

  interface PendingMeta {
    key: keyof PendingReview;
    title: string;
    desc: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    numColor: string;
  }

  /** 前端固定配置（图标、描述、颜色等纯展示信息） */
  const pendingMeta: PendingMeta[] = [
    {
      key: 'commentCount',
      title: '待审核评论',
      desc: '需要审核的用户评论',
      icon: 'ri:chat-check-line',
      iconBg: 'bg-theme/10',
      iconColor: 'text-theme',
      numColor: 'text-theme'
    },
    {
      key: 'messageCount',
      title: '待审核留言',
      desc: '需要审核的用户留言',
      icon: 'ri:message-3-line',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      numColor: 'text-warning'
    }
  ];

  /** 合并前端配置 + 后端数据 */
  const pendingItems = computed(() =>
    pendingMeta.map((meta) => ({
      ...meta,
      num: props.data[meta.key]
    }))
  );
</script>
