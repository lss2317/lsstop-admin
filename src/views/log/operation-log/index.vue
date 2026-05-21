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

      <ElDrawer v-model="detailVisible" title="操作日志详情" size="min(800px, calc(100vw - 32px))">
        <ElDescriptions v-if="detailRow" :column="2" border label-width="85px">
          <ElDescriptionsItem label="日志编号">{{ detailRow.logNumber }}</ElDescriptionsItem>
          <ElDescriptionsItem label="系统模块">{{ detailRow.module }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作类型"
            ><ElTag type="info">{{ detailRow.operationType }}</ElTag></ElDescriptionsItem
          >
          <ElDescriptionsItem label="操作人员">{{ detailRow.userId }}</ElDescriptionsItem>
          <ElDescriptionsItem label="请求地址">{{ detailRow.requestUrl }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作IP">{{ detailRow.ipAddress }}</ElDescriptionsItem>
          <ElDescriptionsItem label="IP归属地">{{ detailRow.ipRegion || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="浏览器">{{ detailRow.browser || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作系统">{{ detailRow.os || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="detailRow.state === 0 ? 'success' : 'danger'">
              {{ detailRow.state === 0 ? '成功' : '失败' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="消耗时间">{{ detailRow.costTime }} 毫秒</ElDescriptionsItem>
          <ElDescriptionsItem label="操作时间">{{
            formatDateTime(detailRow.createTime)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作描述">{{
            detailRow.description || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="错误信息" :span="2">{{
            detailRow.errorMsg || '-'
          }}</ElDescriptionsItem>
        </ElDescriptions>
        <div v-if="detailRow" style="margin-top: 16px">
          <div class="detail-json-section">
            <div class="detail-json-title">请求参数</div>
            <pre class="detail-json-content">{{ formatJson(detailRow.requestParam) }}</pre>
          </div>
          <div class="detail-json-section" style="margin-top: 16px">
            <div class="detail-json-title">返回参数</div>
            <pre class="detail-json-content">{{ formatJson(detailRow.responseParam) }}</pre>
          </div>
        </div>
      </ElDrawer>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus';
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue';
  import { useTable } from '@/hooks/core/useTable';
  import type { ColumnOption } from '@/types/component';
  import type { OperationLogItem } from '@/apis/operation-log/types';
  import { formatDateTime, formatJson } from '@/utils/format';
  defineOptions({ name: 'OperationLog' });

  // ==================== Mock 数据 ====================
  const mockData: OperationLogItem[] = [
    {
      logNumber: 'OP17789261331046238350482765910',
      module: '审批待办',
      operationType: '通过',
      description: '审批通过流程任务',
      requestUrl: '/api/v1/workflows/tasks/31/approve',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '183.227.175.119',
      ipRegion: '重庆市',
      browser: 'Chrome 125.0.0.0',
      os: 'Windows 10.0.0.0',
      state: 0,
      costTime: 14,
      createTime: '2026-05-16T10:08:53.105Z',
      requestParam:
        '{"taskId":31,"action":"approve","comment":"同意","attachments":["审批附件1.pdf","审批附件2.pdf"],"ccUserIds":[1001,1002],"priority":"high","deadline":"2026-05-18T18:00:00.000Z"}',
      responseParam:
        '{"code":0,"msg":"success","data":{"taskId":31,"status":"approved","approvedBy":"Super","approvedAt":"2026-05-16T10:08:53.105Z","nextTaskId":32,"nextAssignee":"Finance","workflowStatus":"in_progress","history":[{"step":"提交申请","operator":"张三","time":"2026-05-15T09:00:00.000Z"},{"step":"部门审批","operator":"Super","time":"2026-05-16T10:08:53.105Z"},{"step":"财务审批","operator":null,"time":null}]}}'
    },
    {
      logNumber: 'OP17789261285539707880937251476',
      module: '审批待办',
      operationType: '通过',
      description: '审批通过流程任务',
      requestUrl: '/api/v1/workflows/tasks/30/approve',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '183.227.175.119',
      ipRegion: '重庆市',
      browser: 'Chrome 125.0.0.0',
      os: 'Windows 10.0.0.0',
      state: 0,
      costTime: 17,
      createTime: '2026-05-16T10:08:48.554Z',
      requestParam: '{"taskId":30,"comment":"同意"}',
      responseParam: '{"code":0,"msg":"success"}'
    },
    {
      logNumber: 'OP17789260815583818426109438527',
      module: '审批中心',
      operationType: '发起',
      description: '发起工作流审批实例',
      requestUrl: '/api/v1/workflows/instances',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '183.227.175.119',
      ipRegion: '重庆市',
      browser: 'Chrome 125.0.0.0',
      os: 'Windows 10.0.0.0',
      state: 0,
      costTime: 19,
      createTime: '2026-05-16T10:08:01.558Z',
      requestParam: '{"workflowId":1,"title":"请假申请"}',
      responseParam: '{"code":0,"msg":"success","data":{"instanceId":42}}'
    },
    {
      logNumber: 'OP17789247916787019847204859637',
      module: '反馈中心',
      operationType: '提交',
      description: '提交用户反馈',
      requestUrl: '/api/v1/feedback',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '27.211.97.216',
      ipRegion: '山东省青岛市',
      browser: 'Edge 125.0.0.0',
      os: 'OSX 10_15_7',
      state: 0,
      costTime: 5,
      createTime: '2026-05-16T09:46:31.678Z',
      requestParam: '{"type":"bug","content":"页面加载慢"}',
      responseParam: '{"code":0,"msg":"success"}'
    },
    {
      logNumber: 'OP17789247495704319351938462571',
      module: '反馈中心',
      operationType: '提交',
      description: '提交用户反馈',
      requestUrl: '/api/v1/feedback',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '27.211.97.216',
      ipRegion: '山东省青岛市',
      browser: 'Edge 125.0.0.0',
      os: 'OSX 10_15_7',
      state: 0,
      costTime: 8,
      createTime: '2026-05-16T09:45:49.570Z',
      requestParam: '{"type":"feature","content":"希望增加导出功能"}',
      responseParam: '{"code":0,"msg":"success"}'
    },
    {
      logNumber: 'OP17789171672767854530627495183',
      module: '审批中心',
      operationType: '发起',
      description: '发起工作流审批实例',
      requestUrl: '/api/v1/workflows/instances',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '60.209.250.73',
      ipRegion: '山东省青岛市',
      browser: 'Chrome 124.0.0.0',
      os: 'Windows 11.0.0.0',
      state: 0,
      costTime: 18,
      createTime: '2026-05-16T07:39:27.277Z',
      requestParam: '{"workflowId":2,"title":"报销申请"}',
      responseParam: '{"code":0,"msg":"success","data":{"instanceId":43}}'
    },
    {
      logNumber: 'OP17789025757700749948295163720',
      module: '商城商品',
      operationType: '复制',
      description: '复制商品',
      requestUrl: '/api/v1/mall/products/19/copy',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '120.237.243.189',
      ipRegion: '广东省深圳市',
      browser: 'Chrome 124.0.0.0',
      os: 'Windows 11.0.0.0',
      state: 0,
      costTime: 13,
      createTime: '2026-05-16T03:36:15.771Z',
      requestParam: '{}',
      responseParam: '{"code":0,"msg":"success","data":{"id":20}}'
    },
    {
      logNumber: 'OP17789010489166590753194725861',
      module: '内容管理',
      operationType: '下线',
      description: '下线内容',
      requestUrl: '/api/v1/contents/8/offline',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '27.226.12.19',
      ipRegion: '福建省厦门市',
      browser: 'Firefox 126.0.0.0',
      os: 'Ubuntu 22.0.4.0',
      state: 0,
      costTime: 3,
      createTime: '2026-05-16T03:10:48.916Z',
      requestParam: '{}',
      responseParam: '{"code":0,"msg":"success"}'
    },
    {
      logNumber: 'OP17789010408707919216820491763',
      module: '内容管理',
      operationType: '发布',
      description: '发布内容',
      requestUrl: '/api/v1/contents/8/publish',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '27.226.12.19',
      ipRegion: '福建省厦门市',
      browser: 'Firefox 126.0.0.0',
      os: 'Ubuntu 22.0.4.0',
      state: 0,
      costTime: 4,
      createTime: '2026-05-16T03:10:40.871Z',
      requestParam: '{}',
      responseParam: '{"code":0,"msg":"success"}'
    },
    {
      logNumber: 'OP17788963108449786583715049261',
      module: '个人中心',
      operationType: '编辑',
      description: '更新个人资料',
      requestUrl: '/api/v1/user/profile/me',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '60.177.36.242',
      ipRegion: '浙江省杭州市',
      browser: 'Safari 17.0.0.0',
      os: 'OSX 10_15_7',
      state: 0,
      costTime: 38,
      createTime: '2026-05-16T01:51:50.845Z',
      requestParam: '{"nickname":"Admin","avatar":"xxx.png"}',
      responseParam: '{"code":0,"msg":"success"}'
    },
    {
      logNumber: 'OP17787669277918983725839104726',
      module: '反馈中心',
      operationType: '提交',
      description: '提交用户反馈',
      requestUrl: '/api/v1/feedback',
      userId: 'U0a1b2c3d4e5f6g7',
      ipAddress: '124.238.79.236',
      ipRegion: '河北省廊坊市',
      browser: 'Chrome 124.0.0.0',
      os: 'Windows 10.0.0.0',
      state: 1,
      costTime: 1,
      createTime: '2026-05-14T13:55:27.791Z',
      requestParam: '{"type":"bug","content":""}',
      responseParam: '{"code":400,"msg":"内容不能为空"}',
      errorMsg: 'Bad Request Exception'
    },
    {
      logNumber: 'OP17787665038878306036482915730',
      module: '商城分类',
      operationType: '删除',
      description: '删除商品分类',
      requestUrl: '/api/v1/mall/categories/7',
      userId: 'U1x2y3z4w5v6u7t8',
      ipAddress: '113.87.90.237',
      ipRegion: '广东省深圳市',
      browser: 'Chrome 125.0.0.0',
      os: 'OSX 10_15_7',
      state: 0,
      costTime: 4,
      createTime: '2026-05-14T13:48:23.887Z',
      requestParam: '{}',
      responseParam: '{"code":0,"msg":"success"}'
    }
  ];

  const fetchOperationLogList = async (
    params: any
  ): Promise<Api.Common.PaginatedResponse<OperationLogItem>> => {
    const { current = 1, size = 10 } = params || {};
    const start = (current - 1) * size;
    return {
      records: mockData.slice(start, start + size),
      current,
      size,
      total: mockData.length
    };
  };
  const fetchOperationLogDetail = async (logNumber: string) => {
    return mockData.find((item) => item.logNumber === logNumber) || null;
  };
  const fetchDeleteOperationLog = async (_logNumber: string) => {
    ElMessage.success('Mock: 删除成功');
  };
  const fetchBatchDeleteOperationLog = async (_logNumbers: string[]) => {
    ElMessage.success('Mock: 批量删除成功');
  };
  // ==================== Mock 数据 ====================

  const detailVisible = ref(false);
  const detailRow = ref<OperationLogItem | null>(null);
  const selectedRows = ref<OperationLogItem[]>([]);

  const createDefaultSearchForm = () => ({
    module: undefined as string | undefined,
    operationType: undefined as string | undefined,
    userId: undefined as string | undefined
  });

  const searchForm = reactive(createDefaultSearchForm());

  const searchItems = computed(() => [
    {
      label: '系统模块',
      key: 'module',
      type: 'input',
      props: { clearable: true, placeholder: '搜索系统模块' }
    },
    {
      label: '操作类型',
      key: 'operationType',
      type: 'input',
      props: { clearable: true, placeholder: '搜索操作类型' }
    },
    {
      label: '操作人员',
      key: 'userId',
      type: 'input',
      props: { clearable: true, placeholder: '搜索用户ID' }
    }
  ]);

  const renderOperationActions = (row: OperationLogItem) =>
    h('div', { class: 'generated-operation-actions' }, [
      h(ArtButtonTable, { type: 'view', onClick: () => openDetailDrawer(row) }),
      h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
    ]);

  const createColumns = (): ColumnOption<OperationLogItem>[] => [
    { type: 'selection' },
    { prop: 'logNumber', label: '日志编号', minWidth: 160, showOverflowTooltip: true },
    { prop: 'module', label: '系统模块', minWidth: 100 },
    {
      prop: 'operationType',
      label: '操作类型',
      minWidth: 80,
      formatter: (row: OperationLogItem) => h(ElTag, { type: 'info' }, row.operationType)
    },
    { prop: 'userId', label: '操作人员', minWidth: 160, showOverflowTooltip: true },
    { prop: 'ipAddress', label: '操作地址', minWidth: 135 },
    { prop: 'ipRegion', label: 'IP归属地', minWidth: 120 },
    {
      prop: 'state',
      label: '状态',
      minWidth: 80,
      formatter: (row: OperationLogItem) =>
        h(
          ElTag,
          { type: row.state === 0 ? 'success' : 'danger' },
          row.state === 0 ? '成功' : '失败'
        )
    },
    {
      prop: 'createTime',
      label: '操作日期',
      minWidth: 170,
      formatter: (row: OperationLogItem) => formatDateTime(row.createTime)
    },
    {
      prop: 'costTime',
      label: '消耗时间',
      minWidth: 100,
      formatter: (row: OperationLogItem) => `${row.costTime}ms`
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
      apiFn: fetchOperationLogList,
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

  const openDetailDrawer = async (row: OperationLogItem) => {
    detailRow.value = await fetchOperationLogDetail(row.logNumber);
    detailVisible.value = true;
  };

  const handleDelete = async (row: OperationLogItem) => {
    await ElMessageBox.confirm(`确认删除"${row.logNumber}"吗？`, '删除确认', { type: 'warning' });
    await fetchDeleteOperationLog(row.logNumber);
    await refreshRemove();
  };

  const handleSelectionChange = (selection: OperationLogItem[]) => {
    selectedRows.value = selection;
  };

  const handleBatchDelete = async () => {
    if (!selectedRows.value.length) {
      ElMessage.warning('请先选择需要删除的数据');
      return;
    }
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 条操作日志吗？`,
      '批量删除确认',
      {
        type: 'warning'
      }
    );
    await fetchBatchDeleteOperationLog(selectedRows.value.map((row) => row.logNumber));
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
