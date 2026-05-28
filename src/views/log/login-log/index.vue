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
  import { formatDateTime } from '@/utils/format';
  defineOptions({ name: 'LoginLog' });

  // ==================== Mock 数据 ====================
  const mockData: LoginLogItem[] = [
    {
      logNumber: 'LG20260519103000001',
      userId: '1001',
      nickname: '风清扬',
      loginType: 1,
      loginTime: '2026-05-19T10:30:00.000Z',
      ipAddress: '183.227.175.119',
      ipRegion: '广东省',
      browser: 'Chrome 148.0.0.0',
      os: 'OSX 10_15_7',
      type: 1,
      state: 0,
      actionType: 1,
      loginIdentifier: 'admin@example.com',
      message: '登录成功'
    },
    {
      logNumber: 'LG20260519091500002',
      userId: '1002',
      nickname: '令狐冲',
      loginType: 2,
      loginTime: '2026-05-19T09:15:00.000Z',
      ipAddress: '120.237.243.189',
      ipRegion: '北京市',
      browser: 'Edge 148.0.0.0',
      os: 'Windows 10_0_19045',
      type: 1,
      state: 0,
      actionType: 1,
      loginIdentifier: 'openid_qq_123456',
      message: '登录成功'
    },
    {
      logNumber: 'LG20260519084500003',
      userId: '1003',
      nickname: '任盈盈',
      loginType: 3,
      loginTime: '2026-05-19T08:45:00.000Z',
      ipAddress: '27.211.97.216',
      ipRegion: '上海市',
      browser: 'Safari 17.5.0.0',
      os: 'OSX 10_15_7',
      type: 0,
      state: 0,
      actionType: 1,
      loginIdentifier: 'weibo_uid_789',
      message: '登录成功'
    },
    {
      logNumber: 'LG20260518182000004',
      userId: '',
      nickname: '',
      loginType: 1,
      loginTime: '2026-05-18T18:20:00.000Z',
      ipAddress: '60.209.250.73',
      ipRegion: '山东省',
      browser: 'Chrome 148.0.0.0',
      os: 'OSX 10_15_7',
      type: 0,
      state: 0,
      actionType: 1,
      loginIdentifier: 'user@blog.com',
      message: '登录成功'
    },
    {
      logNumber: 'LG20260518151000005',
      userId: '1004',
      nickname: '东方不败',
      loginType: 2,
      loginTime: '2026-05-18T15:10:00.000Z',
      ipAddress: '113.87.90.237',
      ipRegion: '浙江省',
      browser: 'Firefox 148.0.0.0',
      os: 'Windows 11_0_22631',
      type: 2,
      state: 1,
      actionType: 1,
      loginIdentifier: 'openid_qq_654321',
      message: '账号已被锁定'
    },
    {
      logNumber: 'LG20260518102000006',
      userId: '1002',
      nickname: '令狐冲',
      loginType: undefined,
      loginTime: '2026-05-18T10:20:00.000Z',
      ipAddress: '120.237.243.189',
      ipRegion: '北京市',
      browser: 'Edge 148.0.0.0',
      os: 'Windows 10_0_19045',
      type: 0,
      state: 0,
      actionType: 2,
      loginIdentifier: undefined,
      message: '退出登录'
    },
    {
      logNumber: 'LG20260518093000007',
      userId: '1002',
      nickname: '令狐冲',
      loginType: undefined,
      loginTime: '2026-05-18T09:30:00.000Z',
      ipAddress: '120.237.243.189',
      ipRegion: '北京市',
      browser: 'Edge 148.0.0.0',
      os: 'Windows 10_0_19045',
      type: 1,
      state: 1,
      actionType: 2,
      loginIdentifier: undefined,
      message: '退出登录'
    },
    {
      logNumber: 'LG20260518081500008',
      userId: '1005',
      nickname: '岳不群',
      loginType: 1,
      loginTime: '2026-05-18T08:15:00.000Z',
      ipAddress: '202.96.128.68',
      ipRegion: '上海市',
      browser: 'Chrome 148.0.0.0',
      os: 'OSX 10_15_7',
      type: 1,
      state: 0,
      actionType: 3,
      loginIdentifier: 'yue@example.com',
      message: '注册成功'
    },
    {
      logNumber: 'LG20260517220000009',
      userId: '1006',
      nickname: '林平之',
      loginType: 1,
      loginTime: '2026-05-17T22:00:00.000Z',
      ipAddress: '14.145.63.91',
      ipRegion: '广东省',
      browser: 'Safari 17.5.0.0',
      os: 'OSX 10_15_7',
      type: 0,
      state: 1,
      actionType: 3,
      loginIdentifier: 'lin@example.com',
      message: '邮箱已被注册'
    },
    {
      logNumber: 'LG20260517153000010',
      userId: '1001',
      nickname: '风清扬',
      loginType: 1,
      loginTime: '2026-05-17T15:30:00.000Z',
      ipAddress: '223.104.145.212',
      ipRegion: '广东省',
      browser: 'Chrome 148.0.0.0',
      os: 'OSX 10_15_7',
      type: 1,
      state: 1,
      actionType: 1,
      loginIdentifier: 'admin@example.com',
      message: '密码错误'
    }
  ];

  const fetchLoginLogList = async (
    params: any
  ): Promise<Api.Common.PaginatedResponse<LoginLogItem>> => {
    const { current = 1, size = 10 } = params || {};
    let filtered = [...mockData];
    if (params.nickname) {
      filtered = filtered.filter((item) => item.nickname.includes(params.nickname));
    }
    const start = (current - 1) * size;
    return {
      records: filtered.slice(start, start + size),
      current,
      size,
      total: filtered.length
    };
  };
  const fetchLoginLogDetail = async (row: LoginLogItem) => {
    return row;
  };
  const fetchDeleteLoginLog = async (_logNumber: string) => {
    ElMessage.success('Mock: 删除成功');
  };
  // ==================== Mock 数据 ====================

  const detailVisible = ref(false);
  const detailRow = ref<LoginLogItem | null>(null);
  const selectedRows = ref<LoginLogItem[]>([]);

  const createDefaultSearchForm = () => ({
    nickname: undefined as string | undefined
  });

  const searchForm = reactive(createDefaultSearchForm());

  const searchItems = computed(() => [
    {
      label: '用户昵称',
      key: 'nickname',
      type: 'input',
      props: { clearable: true, placeholder: '搜索用户昵称' }
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

  const openDetailDrawer = async (row: LoginLogItem) => {
    detailRow.value = await fetchLoginLogDetail(row);
    detailVisible.value = true;
  };

  const handleDelete = async (row: LoginLogItem) => {
    await ElMessageBox.confirm(`确认删除"${row.logNumber}"吗？`, '删除确认', { type: 'warning' });
    await fetchDeleteLoginLog(row.logNumber);
    await refreshRemove();
  };

  const handleSelectionChange = (selection: LoginLogItem[]) => {
    selectedRows.value = selection;
  };

  const fetchBatchDeleteLoginLog = async (_logNumbers: string[]) => {
    ElMessage.success('Mock: 批量删除成功');
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
    await fetchBatchDeleteLoginLog(selectedRows.value.map((row) => row.logNumber));
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
