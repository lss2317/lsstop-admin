<!-- 控制台页面 -->
<template>
  <div v-if="consoleData">
    <StatCards :data="consoleData.statCards" />

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="12" :lg="10">
        <CommentStat :data="consoleData.commentStat" />
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="14">
        <VisitOverview :data="consoleData.visitOverview" />
      </ElCol>
    </ElRow>

    <div class="flex gap-5 max-md:flex-col">
      <div class="flex flex-col w-[58%] max-md:w-full">
        <RecentComments class="flex-1" :data="consoleData.recentComments" />
      </div>
      <div class="flex flex-col w-[42%] max-md:w-full">
        <PendingReview :data="consoleData.pendingReview" />
        <ContentOverview class="flex-1" :data="consoleData.contentOverview" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { fetchConsoleData } from '@/apis/dashboard';
  import type { ConsoleData } from '@/apis/dashboard/types';
  import StatCards from './modules/stat-cards.vue';
  import CommentStat from './modules/comment-stat.vue';
  import VisitOverview from './modules/visit-overview.vue';
  import RecentComments from './modules/recent-comments.vue';
  import PendingReview from './modules/pending-review.vue';
  import ContentOverview from './modules/content-overview.vue';

  defineOptions({ name: 'Console' });

  const consoleData = ref<ConsoleData | null>(null);
  const loading = ref(false);

  async function loadData() {
    loading.value = true;
    try {
      consoleData.value = await fetchConsoleData();
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadData();
  });
</script>
