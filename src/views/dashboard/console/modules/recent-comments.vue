<template>
  <div class="art-card p-5 mb-5 max-sm:mb-4 flex flex-col">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>最近评论</h4>
        <p v-if="comments.length > 0">最近{{ comments.length }}条评论</p>
      </div>
    </div>

    <div v-if="comments.length === 0" class="flex-cc flex-col flex-1 text-g-400">
      <ArtSvgIcon icon="ri:chat-3-line" class="text-3xl mb-2" />
      <span class="text-sm">暂无评论</span>
    </div>
    <div v-else class="divide-y divide-g-200/60">
      <div
        v-for="(item, index) in comments"
        :key="index"
        class="flex items-start p-3 hover:bg-g-100/50 transition-colors"
      >
        <img
          :src="item.avatar"
          :alt="item.nickname"
          class="size-9 rounded-full shrink-0 object-cover"
        />
        <div class="ml-3 flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-g-800">{{ item.nickname }}</span>
            <span class="text-xs text-g-400">{{ formatTimeAgo(item.createdAt) }}</span>
          </div>
          <p class="text-xs text-g-500 mt-1 truncate">{{ item.content }}</p>
          <p class="text-xs text-g-400 mt-0.5 flex items-center min-w-0">
            <ArtSvgIcon
              :icon="
                item.targetType === 1
                  ? 'ri:article-line'
                  : item.targetType === 2
                    ? 'ri:link'
                    : 'ri:chat-smile-2-line'
              "
              class="mr-1 text-sm shrink-0"
              :class="[
                item.targetType === 1
                  ? 'text-blue-500'
                  : item.targetType === 2
                    ? 'text-green-500'
                    : 'text-orange-500'
              ]"
            />
            <span class="truncate">
              <template v-if="item.targetType === 1">评论了《{{ item.targetName }}》</template>
              <template v-else-if="item.targetType === 2">评论了友链</template>
              <template v-else>评论了说说「{{ item.targetName }}」</template>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { RecentCommentItem } from '@/apis/dashboard/types';
  import { formatTimeAgo } from '@/utils/format';

  /** 最近评论列表（模拟） */
  const comments: RecentCommentItem[] = [
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      nickname: '前端小白',
      content: '写得很详细，终于搞懂了组合式API的用法！',
      targetType: 1,
      targetName: 'Vue3组合式API实战',
      createdAt: '2026-05-07T10:25:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      nickname: 'DevOps工程师',
      content: '请问Docker Compose的配置能详细讲讲吗？',
      targetType: 1,
      targetName: 'Docker部署实战',
      createdAt: '2026-05-07T10:07:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      nickname: '全栈学习者',
      content: '这友链不错啊，我也要交换一下',
      targetType: 2,
      targetName: '',
      createdAt: '2026-05-07T09:30:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      nickname: '后端萌新',
      content: '感谢分享，正好项目用得上！',
      targetType: 1,
      targetName: 'Nest.js入门指南',
      createdAt: '2026-05-07T08:30:00'
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      nickname: 'DBA学徒',
      content: '这条说说很有意思，点赞',
      targetType: 3,
      targetName: '今天天气真好',
      createdAt: '2026-05-07T07:30:00'
    }
  ];
</script>
