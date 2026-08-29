<template>
  <div class="art-card min-w-0 p-5">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>待处理</h4>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in pendingItems"
        :key="item.key"
        class="flex items-center justify-between gap-3 p-4 rounded-xl border border-g-300/85 hover:border-theme/50 hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
        @click="handleReviewClick(item.type)"
      >
        <div class="flex min-w-0 items-center">
          <div class="size-10 shrink-0 rounded-lg flex-cc" :class="item.iconBg">
            <ArtSvgIcon :icon="item.icon" class="text-lg" :class="item.iconColor" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-sm text-g-800 font-medium">{{ item.title }}</p>
            <p class="truncate text-xs text-g-500 mt-0.5">
              {{ item.num > 0 ? item.desc : item.doneDesc }}
            </p>
          </div>
        </div>
        <div
          v-if="item.num > 0"
          class="flex shrink-0 items-center rounded-full px-3 py-1.5"
          :class="item.statusBg"
        >
          <span class="text-base leading-none font-semibold" :class="item.numColor">
            {{ item.num }}
          </span>
          <span class="ml-1 text-xs" :class="item.numColor">条待处理</span>
        </div>
        <div
          v-else
          class="flex shrink-0 items-center rounded-full bg-success/10 px-3 py-1.5 text-success"
        >
          <ArtSvgIcon icon="ri:checkbox-circle-line" class="mr-1 text-base" />
          <span class="text-xs font-medium">已处理完</span>
        </div>
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

  type ReviewType = 'comment' | 'message';

  interface PendingMeta {
    key: keyof PendingReview;
    type: ReviewType;
    title: string;
    desc: string;
    doneDesc: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    numColor: string;
    statusBg: string;
  }

  /** 前端固定配置（图标、描述、颜色等纯展示信息） */
  const pendingMeta: PendingMeta[] = [
    {
      key: 'commentCount',
      type: 'comment',
      title: '待审核评论',
      desc: '需要审核的用户评论',
      doneDesc: '暂无需要审核的评论',
      icon: 'ri:chat-check-line',
      iconBg: 'bg-theme/10',
      iconColor: 'text-theme',
      numColor: 'text-theme',
      statusBg: 'bg-theme/10'
    },
    {
      key: 'messageCount',
      type: 'message',
      title: '待审核留言',
      desc: '需要审核的用户留言',
      doneDesc: '暂无需要审核的留言',
      icon: 'ri:message-3-line',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      numColor: 'text-warning',
      statusBg: 'bg-warning/10'
    }
  ];

  /** 点击待审核项（对应管理页面完成后补充路由跳转） */
  const handleReviewClick = (type: ReviewType) => {
    // TODO: 根据 type 跳转至对应的评论审核或留言审核页面
    void type;
  };

  /** 合并前端配置 + 后端数据 */
  const pendingItems = computed(() =>
    pendingMeta.map((meta) => ({
      ...meta,
      num: Number.isFinite(props.data[meta.key]) ? Math.max(0, props.data[meta.key]) : 0
    }))
  );
</script>
