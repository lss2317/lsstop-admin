<template>
  <div class="art-card p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>最近评论</h4>
        <p>最近5条评论</p>
      </div>
    </div>

    <div class="space-y-4 max-h-80 overflow-y-auto">
      <div
        v-for="(item, index) in comments"
        :key="index"
        class="flex items-start p-3 rounded-lg hover:bg-g-100/50 transition-colors"
      >
        <img :src="item.avatar" class="size-9 rounded-full shrink-0" />
        <div class="ml-3 flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-g-800">{{ item.nickname }}</span>
            <span class="text-xs text-g-400">{{ formatTimeAgo(item.createdAt) }}</span>
          </div>
          <p class="text-xs text-g-500 mt-1 truncate">{{ item.content }}</p>
          <p class="text-xs text-g-400 mt-0.5"> 评论了《{{ item.article }}》 </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatTimeAgo } from '@/utils/format';

  interface CommentItem {
    avatar: string;
    nickname: string;
    content: string;
    article: string;
    createdAt: string;
  }

  /**
   * 最近评论列表（模拟数据，对应 blog_comment 表）
   */
  const comments: CommentItem[] = [
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      nickname: '前端小白',
      content: '写得很详细，终于搞懂了组合式API的用法！',
      article: 'Vue3组合式API实战',
      createdAt: '2026-05-07T10:25:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      nickname: 'DevOps工程师',
      content: '请问Docker Compose的配置能详细讲讲吗？',
      article: 'Docker部署实战',
      createdAt: '2026-05-07T10:07:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      nickname: '全栈学习者',
      content: '这个Redis缓存方案在高并发下表现如何？',
      article: 'Redis缓存策略',
      createdAt: '2026-05-07T09:30:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      nickname: '后端萌新',
      content: '感谢分享，正好项目用得上！',
      article: 'Nest.js入门指南',
      createdAt: '2026-05-07T08:30:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      nickname: 'DBA学徒',
      content: '索引优化那部分讲得太好了，收藏了',
      article: 'MySQL优化指南',
      createdAt: '2026-05-07T07:30:00'
    }
  ];
</script>
