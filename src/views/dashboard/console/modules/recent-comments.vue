<template>
  <div class="art-card min-w-0 p-5 flex flex-col">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>最近评论</h4>
        <p v-if="data.length > 0">最近{{ data.length }}条评论</p>
      </div>
    </div>

    <div v-if="data.length === 0" class="flex-cc flex-col flex-1 text-g-400">
      <ArtSvgIcon icon="ri:chat-3-line" class="text-3xl mb-2" />
      <span class="text-sm">暂无评论</span>
    </div>
    <div v-else class="divide-y divide-g-200/60">
      <div
        v-for="(item, index) in data"
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
          <p
            class="text-xs text-g-500 mt-1 truncate comment-content"
            v-html="parseEmoji(item.content)"
          ></p>
          <p class="text-xs text-g-400 mt-0.5 flex items-center min-w-0">
            <ArtSvgIcon
              :icon="getTargetMeta(item.targetType).icon"
              class="mr-1 text-sm shrink-0"
              :class="getTargetMeta(item.targetType).color"
            />
            <span class="truncate">{{
              getTargetMeta(item.targetType).format(item.targetName)
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { RecentCommentItem } from '@/apis/dashboard/types';
  import { formatTimeAgo, parseEmoji } from '@/utils/format';

  defineProps<{
    data: RecentCommentItem[];
  }>();

  /** 评论目标类型 → 图标、颜色、文案格式 */
  const TARGET_META: Record<
    RecentCommentItem['targetType'],
    { icon: string; color: string; format: (name: string) => string }
  > = {
    1: { icon: 'ri:article-line', color: 'text-blue-500', format: (n) => `评论了《${n}》` },
    2: { icon: 'ri:link', color: 'text-green-500', format: () => '评论了友链' },
    3: {
      icon: 'ri:chat-smile-2-line',
      color: 'text-orange-500',
      format: (n) => `评论了说说「${n}」`
    }
  };

  const UNKNOWN_TARGET_META: {
    icon: string;
    color: string;
    format: (name: string) => string;
  } = {
    icon: 'ri:question-line',
    color: 'text-g-400',
    format: () => '评论了未知内容'
  };

  const getTargetMeta = (targetType: RecentCommentItem['targetType']) =>
    TARGET_META[targetType] ?? UNKNOWN_TARGET_META;
</script>

<style scoped>
  .comment-content :deep(.comment-emoji) {
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    margin: 0 1px;
    vertical-align: text-bottom;
  }
</style>
