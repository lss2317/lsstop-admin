<!-- 控制台页面 -->
<template>
  <div v-loading="loading" class="min-h-72">
    <div v-if="consoleData" class="grid gap-5 pb-5 max-sm:gap-4 max-sm:pb-4">
      <StatCards :data="consoleData.statCards" />

      <div
        class="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-5 max-xl:grid-cols-1 max-sm:gap-4"
      >
        <CommentStat :data="consoleData.commentStat" />
        <VisitOverview :data="consoleData.visitOverview" />
      </div>

      <div
        class="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-5 max-xl:grid-cols-1 max-sm:gap-4"
      >
        <RecentComments :data="consoleData.recentComments" />
        <div class="grid min-w-0 gap-5 max-sm:gap-4">
          <PendingReview :data="consoleData.pendingReview" />
          <ContentOverview :data="consoleData.contentOverview" />
        </div>
      </div>
    </div>

    <div v-else-if="loadError" class="art-card flex min-h-72 flex-col items-center justify-center">
      <ArtSvgIcon icon="ri:error-warning-line" class="mb-3 text-4xl text-warning" />
      <p class="text-base font-medium text-g-800">控制台数据加载失败</p>
      <p class="mt-1 text-sm text-g-500">请检查网络连接后重新加载</p>
      <ElButton type="primary" class="mt-4" @click="loadData">重新加载</ElButton>
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
  const loadError = ref(false);

  async function loadData() {
    loading.value = true;
    loadError.value = false;
    try {
      consoleData.value = await fetchConsoleData();
    } catch {
      loadError.value = true;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadData();
  });
</script>
