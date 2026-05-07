<template>
  <div class="art-card p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>待办事项</h4>
        <p>需要处理的内容</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
      <div
        v-for="(item, index) in todoList"
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
        <span class="text-lg font-semibold" :class="item.numColor">{{ item.num }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TodoItem {
    title: string;
    desc: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    num: number;
    numColor: string;
  }

  /**
   * 待办事项列表（对应 blog_comment.review 和 blog_message.review）
   */
  const todoList: TodoItem[] = [
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
    },
    {
      title: '草稿文章',
      desc: '未发布的文章草稿',
      icon: 'ri:draft-line',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      num: 3,
      numColor: 'text-success'
    },
    {
      title: '今日新用户',
      desc: '今日注册的新用户',
      icon: 'ri:user-add-line',
      iconBg: 'bg-danger/10',
      iconColor: 'text-danger',
      num: 8,
      numColor: 'text-danger'
    }
  ];
</script>
