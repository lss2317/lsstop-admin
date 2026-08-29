<!-- 控制台页面 -->
<template>
  <div v-if="consoleData" class="grid gap-5 pb-5 max-sm:gap-4 max-sm:pb-4">
    <StatCards :data="consoleData.statCards" />

    <div class="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-5 max-xl:grid-cols-1 max-sm:gap-4">
      <CommentStat :data="consoleData.commentStat" />
      <VisitOverview :data="consoleData.visitOverview" />
    </div>

    <div class="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-5 max-xl:grid-cols-1 max-sm:gap-4">
      <RecentComments :data="consoleData.recentComments" />
      <div class="grid min-w-0 gap-5 max-sm:gap-4">
        <PendingReview :data="consoleData.pendingReview" />
        <ContentOverview :data="consoleData.contentOverview" />
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

  async function loadData() {
    consoleData.value = await fetchConsoleData();
  }

  onMounted(() => {
    loadData();
  });
</script>
