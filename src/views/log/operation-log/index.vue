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
        <ElDescriptions v-if="detailRow" :column="2" border>
          <ElDescriptionsItem label="日志编号">{{ detailRow.logNo }}</ElDescriptionsItem>
          <ElDescriptionsItem label="系统模块">{{ detailRow.module }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作类型"
            ><ElTag type="info">{{ detailRow.operationType }}</ElTag></ElDescriptionsItem
          >
          <ElDescriptionsItem label="操作人员">{{ detailRow.username }}</ElDescriptionsItem>
          <ElDescriptionsItem label="请求方式">{{ detailRow.method }}</ElDescriptionsItem>
          <ElDescriptionsItem label="请求地址">{{ detailRow.path }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作IP">{{ detailRow.ip }}</ElDescriptionsItem>
          <ElDescriptionsItem label="响应码">{{ detailRow.responseCode }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="detailRow.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ detailRow.status === 'SUCCESS' ? '成功' : '失败' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="消耗时间">{{ detailRow.durationMs }} 毫秒</ElDescriptionsItem>
          <ElDescriptionsItem label="操作时间">{{
            formatDateTime(detailRow.createdAt)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作描述">{{
            detailRow.description || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="错误信息" :span="2">{{
            detailRow.errorMessage || '-'
          }}</ElDescriptionsItem>
        </ElDescriptions>
        <div v-if="detailRow" style="margin-top: 16px">
          <div class="detail-json-section">
            <div class="detail-json-title">请求参数</div>
            <pre class="detail-json-content">{{ formatJson(detailRow.requestParams) }}</pre>
          </div>
          <div class="detail-json-section" style="margin-top: 16px">
            <div class="detail-json-title">返回参数</div>
            <pre class="detail-json-content">{{ formatJson(detailRow.responseParams) }}</pre>
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
  import { formatDateTime, formatJson } from '@/utils/format';
  defineOptions({ name: 'OperationLog' });

  /** 操作日志列表项（匹配后端实际字段） */
  interface OperationLogItem {
    id: number;
    logNo: string;
    module: string;
    operationType: string;
    description: string;
    method: string;
    path: string;
    username: string;
    ip: string;
    status: string;
    responseCode: number;
    durationMs: number;
    createdAt: string;
    requestParams: string;
    responseParams: string;
    errorMessage?: string;
  }

  // ==================== Mock 数据 ====================
  const mockData: OperationLogItem[] = [
    {
      id: 854,
      logNo: 'OP1778926133104623835',
      module: '审批待办',
      operationType: '通过',
      description: '审批通过流程任务',
      method: 'POST',
      path: '/api/v1/workflows/tasks/31/approve',
      username: 'Super',
      ip: '183.227.175.119',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 14,
      createdAt: '2026-05-16T10:08:53.105Z',
      requestParams:
        '{"taskId":31,"action":"approve","comment":"同意","attachments":["审批附件1.pdf","审批附件2.pdf"],"ccUserIds":[1001,1002],"priority":"high","deadline":"2026-05-18T18:00:00.000Z"}',
      responseParams:
        '{"code":0,"msg":"success","data":{"taskId":31,"status":"approved","approvedBy":"Super","approvedAt":"2026-05-16T10:08:53.105Z","nextTaskId":32,"nextAssignee":"Finance","workflowStatus":"in_progress","history":[{"step":"提交申请","operator":"张三","time":"2026-05-15T09:00:00.000Z"},{"step":"部门审批","operator":"Super","time":"2026-05-16T10:08:53.105Z"},{"step":"财务审批","operator":null,"time":null}]}}'
    },
    {
      id: 853,
      logNo: 'OP1778926128553970788',
      module: '审批待办',
      operationType: '通过',
      description: '审批通过流程任务',
      method: 'POST',
      path: '/api/v1/workflows/tasks/30/approve',
      username: 'Super',
      ip: '183.227.175.119',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 17,
      createdAt: '2026-05-16T10:08:48.554Z',
      requestParams: '{"taskId":30,"comment":"同意"}',
      responseParams: '{"code":0,"msg":"success"}'
    },
    {
      id: 852,
      logNo: 'OP1778926081558381842',
      module: '审批中心',
      operationType: '发起',
      description: '发起工作流审批实例',
      method: 'POST',
      path: '/api/v1/workflows/instances',
      username: 'Super',
      ip: '183.227.175.119',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 19,
      createdAt: '2026-05-16T10:08:01.558Z',
      requestParams: '{"workflowId":1,"title":"请假申请"}',
      responseParams: '{"code":0,"msg":"success","data":{"instanceId":42}}'
    },
    {
      id: 851,
      logNo: 'OP1778924791678701984',
      module: '反馈中心',
      operationType: '提交',
      description: '提交用户反馈',
      method: 'POST',
      path: '/api/v1/feedback',
      username: 'Super',
      ip: '27.211.97.216',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 5,
      createdAt: '2026-05-16T09:46:31.678Z',
      requestParams: '{"type":"bug","content":"页面加载慢"}',
      responseParams: '{"code":0,"msg":"success"}'
    },
    {
      id: 850,
      logNo: 'OP1778924749570431935',
      module: '反馈中心',
      operationType: '提交',
      description: '提交用户反馈',
      method: 'POST',
      path: '/api/v1/feedback',
      username: 'Super',
      ip: '27.211.97.216',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 8,
      createdAt: '2026-05-16T09:45:49.570Z',
      requestParams: '{"type":"feature","content":"希望增加导出功能"}',
      responseParams: '{"code":0,"msg":"success"}'
    },
    {
      id: 849,
      logNo: 'OP1778917167276785453',
      module: '审批中心',
      operationType: '发起',
      description: '发起工作流审批实例',
      method: 'POST',
      path: '/api/v1/workflows/instances',
      username: 'Super',
      ip: '60.209.250.73',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 18,
      createdAt: '2026-05-16T07:39:27.277Z',
      requestParams: '{"workflowId":2,"title":"报销申请"}',
      responseParams: '{"code":0,"msg":"success","data":{"instanceId":43}}'
    },
    {
      id: 848,
      logNo: 'OP1778902575770074994',
      module: '商城商品',
      operationType: '复制',
      description: '复制商品',
      method: 'POST',
      path: '/api/v1/mall/products/19/copy',
      username: 'Super',
      ip: '120.237.243.189',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 13,
      createdAt: '2026-05-16T03:36:15.771Z',
      requestParams: '{}',
      responseParams: '{"code":0,"msg":"success","data":{"id":20}}'
    },
    {
      id: 847,
      logNo: 'OP1778901048916659075',
      module: '内容管理',
      operationType: '下线',
      description: '下线内容',
      method: 'PATCH',
      path: '/api/v1/contents/8/offline',
      username: 'Super',
      ip: '27.226.12.19',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 3,
      createdAt: '2026-05-16T03:10:48.916Z',
      requestParams: '{}',
      responseParams: '{"code":0,"msg":"success"}'
    },
    {
      id: 846,
      logNo: 'OP1778901040870791921',
      module: '内容管理',
      operationType: '发布',
      description: '发布内容',
      method: 'PATCH',
      path: '/api/v1/contents/8/publish',
      username: 'Super',
      ip: '27.226.12.19',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 4,
      createdAt: '2026-05-16T03:10:40.871Z',
      requestParams: '{}',
      responseParams: '{"code":0,"msg":"success"}'
    },
    {
      id: 845,
      logNo: 'OP1778896310844978658',
      module: '个人中心',
      operationType: '编辑',
      description: '更新个人资料',
      method: 'PATCH',
      path: '/api/v1/user/profile/me',
      username: 'Super',
      ip: '60.177.36.242',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 38,
      createdAt: '2026-05-16T01:51:50.845Z',
      requestParams: '{"nickname":"Admin","avatar":"xxx.png"}',
      responseParams: '{"code":0,"msg":"success"}'
    },
    {
      id: 838,
      logNo: 'OP1778766927791898372',
      module: '反馈中心',
      operationType: '提交',
      description: '提交用户反馈',
      method: 'POST',
      path: '/api/v1/feedback',
      username: 'Super',
      ip: '124.238.79.236',
      status: 'FAIL',
      responseCode: 400,
      durationMs: 1,
      createdAt: '2026-05-14T13:55:27.791Z',
      requestParams: '{"type":"bug","content":""}',
      responseParams: '{"code":400,"msg":"内容不能为空"}',
      errorMessage: 'Bad Request Exception'
    },
    {
      id: 835,
      logNo: 'OP1778766503887830603',
      module: '商城分类',
      operationType: '删除',
      description: '删除商品分类',
      method: 'DELETE',
      path: '/api/v1/mall/categories/7',
      username: 'admin',
      ip: '113.87.90.237',
      status: 'SUCCESS',
      responseCode: 200,
      durationMs: 4,
      createdAt: '2026-05-14T13:48:23.887Z',
      requestParams: '{}',
      responseParams: '{"code":0,"msg":"success"}'
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
  const fetchOperationLogDetail = async (id: number) => {
    return mockData.find((item) => item.id === id) || null;
  };
  const fetchDeleteOperationLog = async (_id: number) => {
    ElMessage.success('Mock: 删除成功');
  };
  const fetchBatchDeleteOperationLog = async (_ids: number[]) => {
    ElMessage.success('Mock: 批量删除成功');
  };
  // ==================== Mock 数据 ====================

  const detailVisible = ref(false);
  const detailRow = ref<OperationLogItem | null>(null);
  const selectedRows = ref<OperationLogItem[]>([]);

  const createDefaultSearchForm = () => ({
    module: undefined as string | undefined,
    operationType: undefined as string | undefined,
    username: undefined as string | undefined
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
      key: 'username',
      type: 'input',
      props: { clearable: true, placeholder: '搜索操作人员' }
    }
  ]);

  const renderOperationActions = (row: OperationLogItem) =>
    h('div', { class: 'generated-operation-actions' }, [
      h(ArtButtonTable, { type: 'view', onClick: () => openDetailDrawer(row) }),
      h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
    ]);

  const createColumns = (): ColumnOption<OperationLogItem>[] => [
    { type: 'selection' },
    { prop: 'logNo', label: '日志编号', minWidth: 160, showOverflowTooltip: true },
    { prop: 'module', label: '系统模块', minWidth: 100 },
    {
      prop: 'operationType',
      label: '操作类型',
      minWidth: 80,
      formatter: (row: OperationLogItem) => h(ElTag, { type: 'info' }, row.operationType)
    },
    { prop: 'username', label: '操作人员', minWidth: 100 },
    { prop: 'ip', label: '操作地址', minWidth: 135 },
    {
      prop: 'status',
      label: '状态',
      minWidth: 80,
      formatter: (row: OperationLogItem) =>
        h(
          ElTag,
          { type: row.status === 'SUCCESS' ? 'success' : 'danger' },
          row.status === 'SUCCESS' ? '成功' : '失败'
        )
    },
    {
      prop: 'createdAt',
      label: '操作日期',
      minWidth: 170,
      formatter: (row: OperationLogItem) => formatDateTime(row.createdAt)
    },
    {
      prop: 'durationMs',
      label: '消耗时间',
      minWidth: 100,
      formatter: (row: OperationLogItem) => `${row.durationMs}ms`
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
    detailRow.value = await fetchOperationLogDetail(row.id);
    detailVisible.value = true;
  };

  const handleDelete = async (row: OperationLogItem) => {
    await ElMessageBox.confirm(`确认删除"${row.logNo}"吗？`, '删除确认', { type: 'warning' });
    await fetchDeleteOperationLog(row.id);
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
    await fetchBatchDeleteOperationLog(selectedRows.value.map((row) => row.id));
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
