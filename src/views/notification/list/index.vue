<template>
  <div class="art-full-height">
    <NotificationSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    />

    <ElCard class="art-table-card" :style="{ 'margin-top': showSearchBar ? '12px' : '0' }">
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElButton type="primary" plain @click="handleMarkAllRead"> 全部标为已读 </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />

      <ElDrawer
        v-model="detailVisible"
        title="通知详情"
        class="notification-detail-drawer"
        size="min(860px, calc(100vw - 32px))"
      >
        <div v-loading="detailLoading" class="notification-detail">
          <ElDescriptions
            v-if="detail"
            class="notification-detail__descriptions"
            :column="detailColumnCount"
            border
            label-width="105px"
          >
            <ElDescriptionsItem label="通知编号" :span="2">
              <span class="detail-code">{{ detail.notificationNo }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="通知分类">
              {{ categoryText(detail.category) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="通知级别">
              <ElTag :type="levelConfig(detail.level).type">
                {{ levelConfig(detail.level).text }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="事件类型">
              {{ eventTypeText(detail.eventType) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="阅读状态">
              <ElTag :type="detail.readTime ? 'info' : 'danger'">
                {{ detail.readTime ? '已读' : '未读' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="来源模块" :span="detail.occurrenceCount > 1 ? 1 : 2">
              {{ sourceTypeText(detail.sourceType) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="detail.occurrenceCount > 1" label="发生次数">
              5 分钟内累计 {{ detail.occurrenceCount }} 次
            </ElDescriptionsItem>
            <ElDescriptionsItem label="关联编号" :span="2">
              <span class="detail-code">{{ detail.sourceId || '-' }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="首次发生">
              {{ formatDateTime(detail.firstOccurredTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="最近发生">
              {{ formatDateTime(detail.lastOccurredTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="阅读时间">
              {{ formatDateTime(detail.readTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="创建时间">
              {{ formatDateTime(detail.createTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="标题" :span="2">
              <span class="detail-text">{{ detail.title }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="摘要" :span="2">
              <span class="detail-text">{{ detail.content }}</span>
            </ElDescriptionsItem>
          </ElDescriptions>

          <div v-if="detail" class="detail-extra">
            <div class="detail-extra__title">扩展诊断数据</div>
            <pre class="detail-extra__content">{{ formatJson(detail.extra || undefined) }}</pre>
          </div>
        </div>
      </ElDrawer>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
  import { useRoute } from 'vue-router';
  import { useWindowSize } from '@vueuse/core';
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue';
  import { useTable } from '@/hooks/core/useTable';
  import type { ColumnOption } from '@/types/component';
  import { formatDateTime, formatJson } from '@/utils/format';
  import { mittBus } from '@/utils/sys';
  import {
    fetchMarkAllNotificationsRead,
    fetchMarkNotificationRead,
    fetchNotificationDetail,
    fetchNotificationList
  } from '@/apis/notification';
  import type {
    NotificationCategory,
    NotificationDetail,
    NotificationLevel,
    NotificationListItem,
    NotificationListParams
  } from '@/apis/notification/types';
  import NotificationSearch, {
    type NotificationSearchForm
  } from './modules/notification-search.vue';

  defineOptions({ name: 'NotificationList' });

  const route = useRoute();
  const { width: viewportWidth } = useWindowSize();
  const showSearchBar = ref(false);
  const detailVisible = ref(false);
  const detailLoading = ref(false);
  const detail = ref<NotificationDetail | null>(null);
  const detailColumnCount = computed(() => (viewportWidth.value < 768 ? 1 : 2));

  const searchForm = reactive<NotificationSearchForm>({
    keyword: undefined,
    category: undefined,
    eventType: undefined,
    level: undefined,
    readStatus: undefined,
    sourceType: undefined,
    timeRange: undefined
  });

  const categoryMap: Record<NotificationCategory, string> = {
    1: '异常告警',
    2: '安全告警',
    3: '系统通知'
  };

  const levelMap: Record<NotificationLevel, { text: string; type: 'info' | 'warning' | 'danger' }> =
    {
      1: { text: '提示', type: 'info' },
      2: { text: '警告', type: 'warning' },
      3: { text: '错误', type: 'danger' },
      4: { text: '严重', type: 'danger' }
    };

  const eventTypeMap: Record<string, string> = {
    SYSTEM_EXCEPTION: '系统异常',
    SLOW_API: '接口响应过慢',
    LOGIN_RISK: '登录安全风险',
    TASK_FAILURE: '定时任务失败',
    MQ_FAILURE: '消息队列异常',
    DEPENDENCY_FAILURE: '依赖服务异常',
    SYSTEM_NOTICE: '系统通知'
  };

  const sourceTypeMap: Record<string, string> = {
    HTTP_REQUEST: '接口请求',
    LOGIN_LOG: '认证日志模块',
    TASK: '定时任务',
    MQ_CONSUMER: '消息队列消费',
    WEBSOCKET: '实时通信',
    SYSTEM: '系统内部'
  };

  const categoryText = (category: NotificationCategory): string => categoryMap[category] || '未知';
  const levelConfig = (level: NotificationLevel) => levelMap[level] || levelMap[1];
  const eventTypeText = (eventType: string): string => eventTypeMap[eventType] || eventType;
  const sourceTypeText = (sourceType: string | null): string =>
    sourceType ? sourceTypeMap[sourceType] || sourceType : '-';

  const renderOperationActions = (row: NotificationListItem) =>
    h('div', { class: 'generated-operation-actions' }, [
      h(ArtButtonTable, {
        type: 'view',
        onClick: () => openDetail(row.notificationNo, row)
      })
    ]);

  const createColumns = (): ColumnOption<NotificationListItem>[] => [
    {
      prop: 'readTime',
      label: '状态',
      width: 82,
      align: 'center',
      formatter: (row) =>
        h(
          ElTag,
          { type: row.readTime ? 'info' : 'danger', effect: row.readTime ? 'plain' : 'light' },
          () => (row.readTime ? '已读' : '未读')
        )
    },
    {
      prop: 'level',
      label: '通知级别',
      width: 82,
      align: 'center',
      formatter: (row) => {
        const config = levelConfig(row.level);
        return h(ElTag, { type: config.type }, () => config.text);
      }
    },
    {
      prop: 'category',
      label: '分类',
      width: 100,
      align: 'center',
      formatter: (row) => categoryText(row.category)
    },
    { prop: 'title', label: '通知标题', minWidth: 220, showOverflowTooltip: true },
    { prop: 'content', label: '内容摘要', minWidth: 260, showOverflowTooltip: true },
    {
      prop: 'eventType',
      label: '事件类型',
      minWidth: 130,
      align: 'center',
      formatter: (row) => eventTypeText(row.eventType)
    },
    {
      prop: 'sourceType',
      label: '来源模块',
      width: 130,
      align: 'center',
      formatter: (row) => sourceTypeText(row.sourceType)
    },
    {
      prop: 'lastOccurredTime',
      label: '最近发生时间',
      width: 180,
      align: 'center',
      formatter: (row) => formatDateTime(row.lastOccurredTime)
    },
    {
      prop: 'operation',
      label: '操作',
      width: 90,
      fixed: 'right',
      align: 'center',
      formatter: renderOperationActions
    }
  ];

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    getData,
    refreshData,
    handleSizeChange,
    handleCurrentChange
  } = useTable({
    core: {
      apiFn: fetchNotificationList,
      apiParams: { current: 1, size: 20 },
      columnsFactory: createColumns
    }
  });

  /** 将日期范围拆成后端需要的起止字段后重新查询。 */
  const handleSearch = (params: NotificationSearchForm): void => {
    const { timeRange, ...filters } = params;
    const query: Partial<NotificationListParams> = {
      ...filters,
      startTime: timeRange?.[0],
      endTime: timeRange?.[1]
    };
    replaceSearchParams(query);
    getData();
  };

  /**
   * 按通知编号打开详情；从列表点击时同时传入当前行，以便立即同步该行阅读状态。
   */
  const openDetail = async (notificationNo: string, row?: NotificationListItem): Promise<void> => {
    detailVisible.value = true;
    detailLoading.value = true;
    detail.value = null;
    try {
      detail.value = await fetchNotificationDetail(notificationNo);
      if (!detail.value.readTime) {
        await fetchMarkNotificationRead(notificationNo);
        const readTime = new Date().toISOString();
        detail.value.readTime = readTime;
        if (row) row.readTime = readTime;
        mittBus.emit('notificationReadChanged');
      }
    } finally {
      detailLoading.value = false;
    }
  };

  /** 全部标为已读后刷新当前分页，并通知顶部角标同步更新。 */
  const handleMarkAllRead = async (): Promise<void> => {
    await ElMessageBox.confirm('确定将全部未读通知标记为已读吗？', '操作确认', {
      type: 'warning'
    });
    await fetchMarkAllNotificationsRead();
    ElMessage.success('已全部标为已读');
    mittBus.emit('notificationReadChanged');
    await refreshData();
  };

  /**
   * 响应右上角通知携带的通知编号，进入页面后自动打开对应详情。
   * 在已经位于通知列表时点击顶部通知，同样会由查询参数变化触发。
   */
  watch(
    () => route.query.notificationNo,
    (notificationNo) => {
      if (typeof notificationNo === 'string' && notificationNo) {
        openDetail(notificationNo);
      }
    },
    { immediate: true }
  );
</script>

<style scoped>
  :deep(.generated-operation-actions) {
    display: inline-flex;
    justify-content: center;
  }

  :deep(.generated-operation-actions .art-button-table) {
    margin-right: 0;
  }

  :deep(.el-descriptions__body .el-descriptions__table) {
    table-layout: fixed;
  }

  :global(.notification-detail-drawer .el-drawer__body) {
    overflow-x: hidden;
  }

  :deep(.notification-detail__descriptions .el-descriptions__label) {
    width: 105px;
    min-width: 105px;
  }

  :deep(.notification-detail__descriptions .el-descriptions__content) {
    min-width: 0;
    line-height: 1.6;
    word-break: break-word;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .detail-code,
  .detail-text {
    display: block;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .detail-code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 13px;
    word-break: break-all;
  }

  .detail-extra {
    margin-top: 18px;
  }

  .detail-extra__title {
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .detail-extra__content {
    max-height: 420px;
    padding: 16px;
    margin: 0;
    overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
    word-break: break-all;
    white-space: pre-wrap;
    background: var(--el-fill-color-light);
    border-radius: 6px;
  }
</style>
