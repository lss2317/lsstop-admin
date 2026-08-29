<!-- 公告管理页面 -->
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
          <ElButton type="primary" plain class="!rounded-lg" @click="handleAdd" v-ripple>
            新增公告
          </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />

      <NotificationDialog
        v-model="dialogVisible"
        :mode="dialogMode"
        :edit-data="currentAnnouncement"
        @submit="handleSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
  import { useTable } from '@/hooks/core/useTable';
  import { formatDateTime } from '@/utils/format';
  import type { ColumnOption } from '@/types/component';
  import type { AnnouncementItem } from '@/apis/announcement/types';
  import { fetchAnnouncementList } from '@/apis/announcement';
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue';
  import NotificationSearch, {
    type NotificationSearchForm
  } from './modules/notification-search.vue';
  import NotificationDialog from './modules/notification-dialog.vue';

  defineOptions({ name: 'NotificationManage' });

  const showSearchBar = ref(false);
  const dialogVisible = ref(false);
  const dialogMode = ref<'add' | 'edit' | 'view'>('add');
  const currentAnnouncement = ref<AnnouncementItem>();

  const searchForm = reactive<NotificationSearchForm>({
    keyword: undefined,
    type: undefined,
    isEnabled: undefined
  });

  const typeConfig = {
    1: { text: '弹窗公告', type: 'primary' as const },
    2: { text: '首页展示', type: 'success' as const },
    3: { text: '全部展示', type: 'warning' as const }
  };

  const renderOperationActions = (row: AnnouncementItem) =>
    h('div', { class: 'generated-operation-actions' }, [
      h(ArtButtonTable, {
        type: 'view',
        title: '查看公告',
        onClick: () => handleView(row)
      }),
      h(ArtButtonTable, {
        type: 'edit',
        title: '编辑公告',
        onClick: () => handleEdit(row)
      }),
      h(ArtButtonTable, {
        type: 'delete',
        title: '删除公告',
        onClick: () => handleDelete(row)
      })
    ]);

  const createColumns = (): ColumnOption<AnnouncementItem>[] => [
    { prop: 'title', label: '公告标题', minWidth: 220, showOverflowTooltip: true },
    {
      prop: 'type',
      label: '公告类型',
      width: 110,
      align: 'center',
      formatter: (row) => {
        const config = typeConfig[row.type as keyof typeof typeConfig];
        return h(ElTag, { type: config?.type || 'info' }, () => config?.text || '未知');
      }
    },
    { prop: 'priority', label: '优先级', width: 90, align: 'center' },
    {
      prop: 'startTime',
      label: '生效时间',
      width: 220,
      align: 'center',
      formatter: (row) => renderEffectiveTime(row)
    },
    {
      prop: 'isEnabled',
      label: '启用状态',
      width: 100,
      align: 'center',
      formatter: (row) =>
        h(ElTag, { type: row.isEnabled === 1 ? 'success' : 'info' }, () =>
          row.isEnabled === 1 ? '启用' : '禁用'
        )
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      width: 180,
      align: 'center',
      formatter: (row) => formatDateTime(row.updateTime)
    },
    {
      prop: 'operation',
      label: '操作',
      width: 160,
      fixed: 'right',
      align: 'center',
      formatter: renderOperationActions
    }
  ];

  const {
    columns,
    columnChecks,
    data: tableData,
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
      apiFn: fetchAnnouncementList,
      apiParams: { current: 1, size: 20 },
      columnsFactory: createColumns
    }
  });

  function renderEffectiveTime(row: AnnouncementItem) {
    if (!row.startTime && !row.endTime) return '长期有效';
    if (row.startTime && row.endTime) {
      return h('div', { class: 'effective-time-range' }, [
        h('span', formatDateTime(row.startTime)),
        h('span', { class: 'effective-time-range__end' }, `至 ${formatDateTime(row.endTime)}`)
      ]);
    }
    if (row.startTime) return `自 ${formatDateTime(row.startTime)} 起`;
    return `至 ${formatDateTime(row.endTime)}`;
  }

  const handleSearch = (params: NotificationSearchForm): void => {
    replaceSearchParams(params);
    getData();
  };

  const handleAdd = (): void => {
    dialogMode.value = 'add';
    currentAnnouncement.value = undefined;
    dialogVisible.value = true;
  };

  const handleView = (row: AnnouncementItem): void => {
    dialogMode.value = 'view';
    currentAnnouncement.value = row;
    dialogVisible.value = true;
  };

  const handleEdit = (row: AnnouncementItem): void => {
    dialogMode.value = 'edit';
    currentAnnouncement.value = row;
    dialogVisible.value = true;
  };

  const handleSubmit = (): void => {
    ElMessage.info('公告保存接口暂未接入');
    // TODO: 接入公告新增、编辑接口后，保存成功时关闭弹窗并刷新列表。
  };

  const handleDelete = async (row: AnnouncementItem): Promise<void> => {
    await ElMessageBox.confirm(`确定删除公告“${row.title}”吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    ElMessage.info('公告删除接口暂未接入');
    // TODO: 接入公告删除接口后，删除成功时刷新列表。
  };
</script>

<style scoped>
  :deep(.generated-operation-actions) {
    display: inline-flex;
    flex-wrap: nowrap;
    gap: 8px;
    align-items: center;
    white-space: nowrap;
  }

  :deep(.generated-operation-actions .art-button-table) {
    margin-right: 0;
  }

  :deep(.generated-operation-actions .el-button) {
    flex: 0 0 auto;
  }

  :deep(.effective-time-range) {
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
    line-height: 1.35;
    text-align: left;
  }

  :deep(.effective-time-range__end) {
    color: var(--art-gray-500);
  }
</style>
