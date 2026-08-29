<template>
  <div class="grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4">
    <div
      v-for="item in dataList"
      :key="item.key"
      class="art-card relative flex min-w-0 flex-col justify-center h-35 px-5"
    >
      <span class="text-g-700 text-sm">{{ item.des }}</span>
      <ArtCountTo
        class="text-[26px] font-medium mt-2"
        :target="item.num"
        :duration="1300"
        separator=","
      />
      <div class="flex-c mt-1">
        <span class="text-xs text-g-600">{{ item.todayLabel }}</span>
        <span
          class="ml-1 inline-flex items-center text-xs font-semibold"
          :class="item.todayCount > 0 ? 'text-success' : 'text-g-400'"
        >
          {{ item.todayCount }}
          <ArtSvgIcon v-if="item.todayCount > 0" icon="ri:arrow-up-line" class="ml-0.5 text-sm" />
        </span>
      </div>
      <div class="absolute top-0 bottom-0 right-5 m-auto size-12.5 rounded-xl flex-cc bg-theme/10">
        <ArtSvgIcon :icon="item.icon" class="text-xl text-theme" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { StatCardItem } from '@/apis/dashboard/types';

  const props = defineProps<{
    data: StatCardItem[];
  }>();

  /** 前端固定配置（图标、描述，按 key 索引） */
  const cardMetaMap: Record<
    StatCardItem['key'],
    { des: string; todayLabel: string; icon: string }
  > = {
    totalVisits: {
      des: '总访问量',
      todayLabel: '今日访问',
      icon: 'ri:line-chart-line'
    },
    totalUsers: { des: '总用户数', todayLabel: '今日新增', icon: 'ri:user-line' },
    totalComments: { des: '总评论数', todayLabel: '今日新增', icon: 'ri:chat-3-line' },
    totalMessages: { des: '总留言数', todayLabel: '今日新增', icon: 'ri:message-2-line' }
  };

  /** 按 key 匹配合并前端配置 + 后端数据 */
  const dataList = computed(() =>
    (Array.isArray(props.data) ? props.data : [])
      .filter((item) => Boolean(cardMetaMap[item.key]))
      .map((item) => ({
        ...item,
        num: Number.isFinite(item.num) ? Math.max(0, item.num) : 0,
        todayCount: Number.isFinite(item.todayCount) ? Math.max(0, item.todayCount) : 0,
        ...cardMetaMap[item.key]
      }))
  );
</script>
