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

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="14" :lg="14">
        <RecentComments />
      </ElCol>
      <ElCol :sm="24" :md="10" :lg="10">
        <PendingReview />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import CardList from './modules/card-list.vue';
  import ActiveUser from './modules/active-user.vue';
  import SalesOverview from './modules/sales-overview.vue';
  import RecentComments from './modules/recent-comments.vue';
  import PendingReview from './modules/pending-review.vue';

  defineOptions({ name: 'Console' });
</script>
