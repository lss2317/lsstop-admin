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

      <ElDrawer v-model="detailVisible" title="登录日志详情" size="min(800px, calc(100vw - 32px))">
        <ElDescriptions v-if="detailRow" :column="2" border>
          <ElDescriptionsItem label="日志编号">{{ detailRow.accessId }}</ElDescriptionsItem>
          <ElDescriptionsItem label="用户名称">{{ detailRow.userName }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作IP">{{ detailRow.address || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="ip所在地">{{
            detailRow.loginLocation || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作系统">{{ detailRow.os || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="浏览器">{{ detailRow.browser || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="detailRow.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ detailRow.status === 'SUCCESS' ? '成功' : '失败' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="时间">{{
            formatDateTime(detailRow.loginTime)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="登录信息" :span="2">{{
            detailRow.description || '-'
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
  import { formatDateTime } from '@/utils/format';
  defineOptions({ name: 'LoginLog' });

  /** 登录日志列表项 */
  interface LoginLogItem {
    id: number;
    accessId: string;
    userId: string;
    userName: string;
    address: string;
    loginLocation: string;
    os: string;
    browser: string;
    status: string;
    description: string;
    loginTime: string;
    createdAt: string;
    updatedAt: string;
  }

  // ==================== Mock 数据 ====================
  const mockData: LoginLogItem[] = [
    {
      id: 1,
      accessId: 'LG20260519103000001abcdef1234567',
      userId: '1001',
      userName: 'Super',
      address: '183.227.175.119',
      loginLocation: '广东省',
      os: 'OSX 10_15_7',
      browser: 'Chrome 148.0.0.0',
      status: 'SUCCESS',
      description: '登录成功',
      loginTime: '2026-05-19T10:30:00.000Z',
      createdAt: '2026-05-19T10:30:00.000Z',
      updatedAt: '2026-05-19T10:30:00.000Z'
    },
    {
      id: 2,
      accessId: 'LG20260519091500002abcdef1234567',
      userId: '1002',
      userName: 'admin',
      address: '120.237.243.189',
      loginLocation: '北京市',
      os: 'Windows 10_0_19045',
      browser: 'Edge 148.0.0.0',
      status: 'SUCCESS',
      description: '登录成功',
      loginTime: '2026-05-19T09:15:00.000Z',
      createdAt: '2026-05-19T09:15:00.000Z',
      updatedAt: '2026-05-19T09:15:00.000Z'
    },
    {
      id: 3,
      accessId: 'LG20260519084500003abcdef1234567',
      userId: '1003',
      userName: 'zhangsan',
      address: '27.211.97.216',
      loginLocation: '上海市',
      os: 'OSX 10_15_7',
      browser: 'Safari 17.5.0.0',
      status: 'FAIL',
      description: '密码错误',
      loginTime: '2026-05-19T08:45:00.000Z',
      createdAt: '2026-05-19T08:45:00.000Z',
      updatedAt: '2026-05-19T08:45:00.000Z'
    },
    {
      id: 4,
      accessId: 'LG20260518182000004abcdef1234567',
      userId: '1001',
      userName: 'Super',
      address: '60.209.250.73',
      loginLocation: '山东省',
      os: 'OSX 10_15_7',
      browser: 'Chrome 148.0.0.0',
      status: 'SUCCESS',
      description: '登录成功',
      loginTime: '2026-05-18T18:20:00.000Z',
      createdAt: '2026-05-18T18:20:00.000Z',
      updatedAt: '2026-05-18T18:20:00.000Z'
    },
    {
      id: 5,
      accessId: 'LG20260518151000005abcdef1234567',
      userId: '1004',
      userName: 'lisi',
      address: '113.87.90.237',
      loginLocation: '浙江省',
      os: 'Windows 11_0_22631',
      browser: 'Firefox 148.0.0.0',
      status: 'FAIL',
      description: '账号已被锁定',
      loginTime: '2026-05-18T15:10:00.000Z',
      createdAt: '2026-05-18T15:10:00.000Z',
      updatedAt: '2026-05-18T15:10:00.000Z'
    }
  ];

  const fetchLoginLogList = async (
    params: any
  ): Promise<Api.Common.PaginatedResponse<LoginLogItem>> => {
    const { current = 1, size = 10 } = params || {};
    let filtered = [...mockData];
    if (params.userName) {
      filtered = filtered.filter((item) => item.userName.includes(params.userName));
    }
    const start = (current - 1) * size;
    return {
      records: filtered.slice(start, start + size),
      current,
      size,
      total: filtered.length
    };
  };
  const fetchLoginLogDetail = async (id: number) => {
    return mockData.find((item) => item.id === id) || null;
  };
  const fetchDeleteLoginLog = async (_id: number) => {
    ElMessage.success('Mock: 删除成功');
  };
  // ==================== Mock 数据 ====================

  const detailVisible = ref(false);
  const detailRow = ref<LoginLogItem | null>(null);
  const selectedRows = ref<LoginLogItem[]>([]);

  const createDefaultSearchForm = () => ({
    userName: undefined as string | undefined
  });

  const searchForm = reactive(createDefaultSearchForm());

  const searchItems = computed(() => [
    {
      label: '用户名称',
      key: 'userName',
      type: 'input',
      props: { clearable: true, placeholder: '搜索用户名称' }
    }
  ]);

  const renderOperationActions = (row: LoginLogItem) =>
    h('div', { class: 'generated-operation-actions' }, [
      h(ArtButtonTable, { type: 'view', onClick: () => openDetailDrawer(row) }),
      h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
    ]);

  const createColumns = (): ColumnOption<LoginLogItem>[] => [
    { type: 'selection' },
    { prop: 'accessId', label: '日志编号', minWidth: 160, showOverflowTooltip: true },
    { prop: 'userName', label: '用户名称', minWidth: 100 },
    { prop: 'address', label: '操作IP', minWidth: 140 },
    { prop: 'loginLocation', label: 'ip所在地', minWidth: 140 },
    { prop: 'os', label: '操作系统', minWidth: 110 },
    { prop: 'browser', label: '浏览器', minWidth: 120 },
    {
      prop: 'status',
      label: '状态',
      minWidth: 80,
      formatter: (row: LoginLogItem) =>
        h(
          ElTag,
          { type: row.status === 'SUCCESS' ? 'success' : 'danger' },
          row.status === 'SUCCESS' ? '成功' : '失败'
        )
    },
    { prop: 'description', label: '登录信息', minWidth: 140 },
    {
      prop: 'loginTime',
      label: '时间',
      minWidth: 170,
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

  const buildSearchParams = (): Record<string, unknown> => ({
    ...searchForm
  });

  const handleSearch = () => {
    replaceSearchParams(buildSearchParams());
    void getData();
  };

  const handleReset = async () => {
    Object.assign(searchForm, createDefaultSearchForm());
    await resetSearchParams();
  };

  const openDetailDrawer = async (row: LoginLogItem) => {
    detailRow.value = await fetchLoginLogDetail(row.id);
    detailVisible.value = true;
  };

  const handleDelete = async (row: LoginLogItem) => {
    await ElMessageBox.confirm(`确认删除"${row.accessId}"吗？`, '删除确认', { type: 'warning' });
    await fetchDeleteLoginLog(row.id);
    await refreshRemove();
  };

  const handleSelectionChange = (selection: LoginLogItem[]) => {
    selectedRows.value = selection;
  };

  const fetchBatchDeleteLoginLog = async (_ids: number[]) => {
    ElMessage.success('Mock: 批量删除成功');
  };

  const handleBatchDelete = async () => {
    if (!selectedRows.value.length) {
      ElMessage.warning('请先选择需要删除的数据');
      return;
    }
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 条登录日志吗？`,
      '批量删除确认',
      {
        type: 'warning'
      }
    );
    await fetchBatchDeleteLoginLog(selectedRows.value.map((row) => row.id));
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
