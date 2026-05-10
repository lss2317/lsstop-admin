<template>
  <ElRow :gutter="20" class="flex">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="art-card h-32 flex items-center px-5 mb-5 max-sm:mb-4">
        <div class="mr-4 size-12.5 flex-cc rounded-xl text-xl text-theme bg-theme/10">
          <ArtSvgIcon :icon="item.icon" />
        </div>
        <div class="flex-1">
          <ArtCountTo class="text-[28px] font-semibold text-g-900" :target="item.num" :duration="1300" />
          <p class="mt-1.5 text-sm text-g-500">{{ item.des }}</p>
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { StatCardItem } from '@/apis/dashboard/types';

  const props = defineProps<{
    data: StatCardItem[];
  }>();

  /** 前端固定配置（图标、描述，按 key 索引） */
  const cardMetaMap: Record<string, { des: string; icon: string }> = {
    totalVisits: { des: '总访问量', icon: 'ri:line-chart-line' },
    totalUsers: { des: '总用户数', icon: 'ri:user-line' },
    totalComments: { des: '总评论数', icon: 'ri:chat-3-line' },
    totalMessages: { des: '总留言数', icon: 'ri:message-2-line' }
  };

  /** 按 key 匹配合并前端配置 + 后端数据 */
  const dataList = computed(() =>
    props.data.map((item) => ({
      ...item,
      ...cardMetaMap[item.key]
    }))
  );
</script>
