<!-- 工作台页面 -->
<template>
  <div>
    <CardList></CardList>

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="12" :lg="10">
        <ActiveUser />
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="14">
        <SalesOverview />
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
  import CardList from './modules/card-list.vue';
  import ActiveUser from './modules/active-user.vue';
  import SalesOverview from './modules/sales-overview.vue';
  import RecentComments from './modules/recent-comments.vue';
  import PendingReview from './modules/pending-review.vue';
  import ContentOverview from './modules/content-overview.vue';

  defineOptions({ name: 'Console' });
</script>
