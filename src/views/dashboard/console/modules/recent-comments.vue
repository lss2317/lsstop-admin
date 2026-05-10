<template>
  <div class="art-card p-5 mb-5 max-sm:mb-4 flex flex-col">
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
  import { formatTimeAgo, parseEmoji } from '@/utils/format';

  defineProps<{
    data: RecentCommentItem[];
  }>();
</script>

<style scoped>
  .comment-content :deep(.comment-emoji) {
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    vertical-align: text-bottom;
    margin: 0 1px;
  }
</style>
