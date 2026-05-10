<template>
  <ElRow :gutter="20" class="flex">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="art-card relative flex flex-col justify-center h-35 px-5 mb-5 max-sm:mb-4">
        <span class="text-g-700 text-sm">{{ item.des }}</span>
        <ArtCountTo class="text-[26px] font-medium mt-2" :target="item.num" :duration="1300" />
        <div
          class="absolute top-0 bottom-0 right-5 m-auto size-12.5 rounded-xl flex-cc bg-theme/10"
        >
          <ArtSvgIcon :icon="item.icon" class="text-xl text-theme" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  import type { StatCardItem } from '@/apis/dashboard/types';

  /** 前端固定配置（图标、描述，按 key 索引） */
  const cardMetaMap: Record<string, { des: string; icon: string }> = {
    totalVisits: { des: '总访问量', icon: 'ri:line-chart-line' },
    totalUsers: { des: '总用户数', icon: 'ri:user-line' },
    totalComments: { des: '总评论数', icon: 'ri:chat-3-line' },
    totalMessages: { des: '总留言数', icon: 'ri:message-2-line' }
  };

  /** 后端返回的数据（模拟） */
  const statCards: StatCardItem[] = [
    { key: 'totalVisits', num: 9120 },
    { key: 'totalUsers', num: 182 },
    { key: 'totalComments', num: 9520 },
    { key: 'totalMessages', num: 156 }
  ];

  /** 按 key 匹配合并前端配置 + 后端数据 */
  const dataList = statCards.map((item) => ({
    ...item,
    ...cardMetaMap[item.key]
  }));
</script>
