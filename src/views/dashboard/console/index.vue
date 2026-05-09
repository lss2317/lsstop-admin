<!-- 控制台页面 -->
<template>
  <div>
    <StatCards />

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="12" :lg="10">
        <CommentStat />
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="14">
        <VisitOverview />
      </ElCol>
    </ElRow>

    <div class="flex gap-5 max-md:flex-col">
      <div class="flex flex-col w-[58%] max-md:w-full">
        <RecentComments class="flex-1" />
      </div>
      <div class="flex flex-col w-[42%] max-md:w-full">
        <PendingReview />
        <ContentOverview class="flex-1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import StatCards from './modules/stat-cards.vue';
  import CommentStat from './modules/comment-stat.vue';
  import VisitOverview from './modules/visit-overview.vue';
  import RecentComments from './modules/recent-comments.vue';
  import PendingReview from './modules/pending-review.vue';
  import ContentOverview from './modules/content-overview.vue';

  defineOptions({ name: 'Console' });
</script>
