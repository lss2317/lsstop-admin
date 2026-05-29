<template>
  <div class="art-full-height">
    <ArtSearchBar
      v-model="searchForm"
      :items="searchItems"
      label-width="76px"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="art-table-card" shadow="never" style="margin-top: 12px">
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        :data="data"
        :selected-data="selectedRows"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton
              type="danger"
              plain
              :disabled="!selectedRows.length"
              @click="handleBatchDelete"
            >
              删除
            </ElButton>
            <ElButton type="primary" plain @click="handleExport">导出</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
      <ElDrawer v-model="detailVisible" title="认证日志详情" size="min(800px, calc(100vw - 32px))">
        <ElDescriptions v-if="detailRow" :column="2" border label-width="85px">
          <ElDescriptionsItem label="日志编号">{{ detailRow.logNumber }}</ElDescriptionsItem>
          <ElDescriptionsItem label="用户ID">{{ detailRow.userId || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="用户昵称">{{
            detailRow.nickname || '未知用户'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="登录方式">
            <ElTag :type="loginTypeTagType(detailRow.loginType)">{{
              loginTypeLabel(detailRow.loginType)
            }}</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="操作标识">{{
            detailRow.loginIdentifier || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="detailRow.state === 0 ? 'success' : 'danger'">
              {{ detailRow.state === 0 ? '成功' : '失败' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="操作类型">
            <ElTag :type="actionTypeTagType(detailRow.actionType)">{{
              actionTypeLabel(detailRow.actionType)
            }}</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="操作来源">
            <ElTag>{{ sourceTypeLabel(detailRow.type) }}</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="登录IP">{{ detailRow.ipAddress || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="IP所在地">{{ detailRow.ipRegion || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作系统">{{ detailRow.os || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="浏览器">{{ detailRow.browser || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作时间">{{
            formatDateTime(detailRow.loginTime)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作信息" :span="2">{{
            detailRow.message || '-'
          }}</ElDescriptionsItem>
        </ElDescriptions>
      </ElDrawer>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus';
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue';
  import { useTable } from '@/hooks/core/useTable';
  import type { ColumnOption } from '@/types/component';
  import type { LoginLogItem } from '@/apis/login-log/types';
  import { fetchLoginLogList, fetchDeleteLoginLog } from '@/apis/login-log';
  import { formatDateTime } from '@/utils/format';
  defineOptions({ name: 'LoginLog' });

  const detailVisible = ref(false);
  const detailRow = ref<LoginLogItem | null>(null);
  const selectedRows = ref<LoginLogItem[]>([]);

  const createDefaultSearchForm = () => ({
    userId: undefined as string | undefined,
    actionType: undefined as number | undefined,
    state: undefined as number | undefined,
    type: undefined as number | undefined,
    loginType: undefined as number | undefined,
    noUserId: undefined as boolean | undefined
  });

  const searchForm = reactive(createDefaultSearchForm());

  const searchItems = computed(() => [
    {
      label: '用户ID',
      key: 'userId',
      type: 'input',
      props: { clearable: true, placeholder: '搜索用户ID', maxlength: 16 }
    },
    {
      label: '操作类型',
      key: 'actionType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '选择操作类型',
        options: [
          { label: '登录', value: 1 },
          { label: '退出', value: 2 },
          { label: '注册', value: 3 }
        ]
      }
    },
    {
      label: '状态',
      key: 'state',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '选择状态',
        options: [
          { label: '成功', value: 0 },
          { label: '失败', value: 1 }
        ]
      }
    },
    {
      label: '操作来源',
      key: 'type',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '选择操作来源',
        options: [
          { label: '前台', value: 0 },
          { label: '后台', value: 1 },
          { label: '非法', value: 2 }
        ]
      }
    },
    {
      label: '登录方式',
      key: 'loginType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '选择登录方式',
        options: [
          { label: '邮箱', value: 1 },
          { label: 'QQ', value: 2 },
          { label: '微博', value: 3 }
        ]
      }
    },
    {
      label: '未知用户',
      key: 'noUserId',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '筛选未知用户',
        options: [{ label: '仅看未知用户', value: true }]
      }
    }
  ]);

  const renderOperationActions = (row: LoginLogItem) =>
    h('div', { class: 'generated-operation-actions' }, [
      h(ArtButtonTable, { type: 'view', onClick: () => openDetailDrawer(row) }),
      h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
    ]);

  const createColumns = (): ColumnOption<LoginLogItem>[] => [
    { type: 'selection' },
    {
      prop: 'logNumber',
      label: '日志编号',
      minWidth: 160,
      showOverflowTooltip: true,
      align: 'center'
    },
    {
      prop: 'userId',
      label: '用户ID',
      minWidth: 160,
      showOverflowTooltip: true,
      align: 'center',
      formatter: (row: LoginLogItem) => row.userId || '-'
    },
    {
      prop: 'nickname',
      label: '用户昵称',
      minWidth: 160,
      showOverflowTooltip: true,
      align: 'center',
      formatter: (row: LoginLogItem) => row.nickname || '未知用户'
    },
    { prop: 'message', label: '操作信息', minWidth: 140, align: 'center' },
    {
      prop: 'loginType',
      label: '登录方式',
      minWidth: 80,
      align: 'center',
      formatter: (row: LoginLogItem) =>
        h(ElTag, { type: loginTypeTagType(row.loginType) }, loginTypeLabel(row.loginType))
    },
    {
      prop: 'state',
      label: '状态',
      minWidth: 80,
      align: 'center',
      formatter: (row: LoginLogItem) =>
        h(
          ElTag,
          { type: row.state === 0 ? 'success' : 'danger' },
          row.state === 0 ? '成功' : '失败'
        )
    },
    { prop: 'ipAddress', label: '登录IP', minWidth: 135, align: 'center' },
    { prop: 'ipRegion', label: 'IP所在地', minWidth: 120, align: 'center' },
    {
      prop: 'actionType',
      label: '操作类型',
      minWidth: 80,
      align: 'center',
      formatter: (row: LoginLogItem) =>
        h(ElTag, { type: actionTypeTagType(row.actionType) }, actionTypeLabel(row.actionType))
    },
    {
      prop: 'type',
      label: '操作来源',
      minWidth: 80,
      align: 'center',
      formatter: (row: LoginLogItem) =>
        h(
          ElTag,
          { type: row.type === 2 ? 'danger' : row.type === 1 ? 'primary' : 'info' },
          sourceTypeLabel(row.type)
        )
    },
    {
      prop: 'loginTime',
      label: '操作时间',
      minWidth: 170,
      align: 'center',
      formatter: (row: LoginLogItem) => formatDateTime(row.loginTime)
    },
    {
      prop: 'operation',
      label: '操作',
      width: 120,
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
    refreshRemove,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchLoginLogList,
      apiParams: { current: 1, size: 10 },
      columnsFactory: createColumns
    }
  });

  const buildSearchParams = (): Record<string, unknown> => {
    const params: Record<string, unknown> = {};
    if (searchForm.userId) params.userId = searchForm.userId;
    if (searchForm.actionType !== undefined) params.actionType = searchForm.actionType;
    if (searchForm.state !== undefined) params.state = searchForm.state;
    if (searchForm.type !== undefined) params.type = searchForm.type;
    if (searchForm.loginType !== undefined) params.loginType = searchForm.loginType;
    if (searchForm.noUserId !== undefined) params.noUserId = searchForm.noUserId;
    return params;
  };

  const handleSearch = () => {
    replaceSearchParams(buildSearchParams());
    void getData();
  };

  const handleReset = async () => {
    Object.assign(searchForm, createDefaultSearchForm());
    await resetSearchParams();
  };

  const actionTypeLabel = (type: number): string => {
    switch (type) {
      case 1:
        return '登录';
      case 2:
        return '退出';
      case 3:
        return '注册';
      default:
        return '未知';
    }
  };

  const actionTypeTagType = (type: number): 'success' | 'warning' | 'primary' | 'info' => {
    switch (type) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'primary';
      default:
        return 'info';
    }
  };

  const loginTypeLabel = (type: number | undefined): string => {
    switch (type) {
      case 1:
        return '邮箱';
      case 2:
        return 'QQ';
      case 3:
        return '微博';
      default:
        return '未知';
    }
  };

  const loginTypeTagType = (
    type: number | undefined
  ): 'primary' | 'success' | 'danger' | 'info' => {
    switch (type) {
      case 1:
        return 'primary';
      case 2:
        return 'success';
      case 3:
        return 'danger';
      default:
        return 'info';
    }
  };

  const sourceTypeLabel = (type: number): string => {
    switch (type) {
      case 0:
        return '前台';
      case 1:
        return '后台';
      case 2:
        return '非法';
      default:
        return '未知';
    }
  };

  const openDetailDrawer = (row: LoginLogItem) => {
    detailRow.value = row;
    detailVisible.value = true;
  };

  const handleDelete = async (row: LoginLogItem) => {
    await ElMessageBox.confirm(`确认删除"${row.logNumber}"吗？`, '删除确认', { type: 'warning' });
    await fetchDeleteLoginLog({ logNumbers: [row.logNumber] });
    ElMessage.success('删除成功');
    await refreshRemove();
  };

  const handleSelectionChange = (selection: LoginLogItem[]) => {
    selectedRows.value = selection;
  };

  const handleBatchDelete = async () => {
    if (!selectedRows.value.length) {
      ElMessage.warning('请先选择需要删除的数据');
      return;
    }
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 条认证日志吗？`,
      '批量删除确认',
      {
        type: 'warning'
      }
    );
    await fetchDeleteLoginLog({
      logNumbers: selectedRows.value.map((row) => row.logNumber)
    });
    ElMessage.success('删除成功');
    selectedRows.value = [];
    await refreshRemove();
  };

  const handleExport = () => {
    ElMessage.success('Mock: 导出成功');
  };
</script>

<style scoped>
  :deep(.generated-operation-actions) {
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 8px;
    white-space: nowrap;
  }

  :deep(.generated-operation-actions .art-button-table) {
    margin-right: 0;
  }

  :deep(.generated-operation-actions .el-button) {
    flex: 0 0 auto;
  }

  :deep(.el-descriptions__body .el-descriptions__table) {
    table-layout: fixed;
  }

  .detail-json-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 10px;
    color: var(--el-text-color-primary);
  }

  .detail-json-content {
    margin: 0;
    padding: 16px;
    background-color: var(--el-fill-color-light, #f5f7fa);
    border-radius: 6px;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
  }
</style>
