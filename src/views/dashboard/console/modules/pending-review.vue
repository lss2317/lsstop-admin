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
        <span class="text-2xl font-semibold" :class="item.numColor">{{ item.num }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface PendingItem {
    title: string;
    desc: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    num: number;
    numColor: string;
  }

  /**
   * 待处理事项（对应 blog_comment.review=1 和 blog_message.review=1）
   */
  const pendingItems: PendingItem[] = [
    {
      title: '待审核评论',
      desc: '需要审核的用户评论',
      icon: 'ri:chat-check-line',
      iconBg: 'bg-theme/10',
      iconColor: 'text-theme',
      num: 12,
      numColor: 'text-theme'
    },
    {
      title: '待审核留言',
      desc: '需要审核的用户留言',
      icon: 'ri:message-3-line',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      num: 5,
      numColor: 'text-warning'
    }
  ];
</script>
