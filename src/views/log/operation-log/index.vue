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
            <ElButton
              type="primary"
              plain
              :loading="exportLoading"
              :disabled="!data.length"
              @click="handleExport"
            >
              导出
            </ElButton>
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
            ><ElTag :type="operationTagType(detailRow.operationType)">{{
              detailRow.operationType
            }}</ElTag></ElDescriptionsItem
          >
          <ElDescriptionsItem label="用户ID">{{ detailRow.userId }}</ElDescriptionsItem>
          <ElDescriptionsItem label="IP地址">{{ detailRow.ipAddress }}</ElDescriptionsItem>
          <ElDescriptionsItem label="请求地址">{{ detailRow.requestUrl }}</ElDescriptionsItem>
          <ElDescriptionsItem label="IP归属地">{{ detailRow.ipRegion || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="detailRow.state === 0 ? 'success' : 'danger'">
              {{ detailRow.state === 0 ? '成功' : '失败' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="浏览器">{{ detailRow.browser || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作系统">{{ detailRow.os || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="消耗时间">{{ detailRow.costTime }} 毫秒</ElDescriptionsItem>
          <ElDescriptionsItem label="操作时间">{{
            formatDateTime(detailRow.createTime)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作描述">{{
            detailRow.description || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作人员">{{ detailRow.nickname }}</ElDescriptionsItem>
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
  import {
    fetchOperationLogList,
    fetchDeleteOperationLog,
    fetchOperationLogExport
  } from '@/apis/operation-log';
  import FileSaver from 'file-saver';
  import { formatDateTime, formatJson } from '@/utils/format';
  defineOptions({ name: 'OperationLog' });

  const detailVisible = ref(false);
  const detailRow = ref<OperationLogItem | null>(null);
  const selectedRows = ref<OperationLogItem[]>([]);
  const exportLoading = ref(false);

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
      props: { clearable: true, placeholder: '搜索系统模块', maxlength: 10 }
    },
    {
      label: '操作类型',
      key: 'operationType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '选择操作类型',
        options: [
          { label: '新增', value: '新增' },
          { label: '编辑', value: '编辑' },
          { label: '删除', value: '删除' }
        ]
      }
    },
    {
      label: '用户ID',
      key: 'userId',
      type: 'input',
      props: { clearable: true, placeholder: '搜索用户ID', maxlength: 16 }
    }
  ]);

  const renderOperationActions = (row: OperationLogItem) =>
    h('div', { class: 'generated-operation-actions' }, [
      h(ArtButtonTable, { type: 'view', onClick: () => openDetailDrawer(row) }),
      h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
    ]);

  const createColumns = (): ColumnOption<OperationLogItem>[] => [
    { type: 'selection' },
    {
      prop: 'logNumber',
      label: '日志编号',
      minWidth: 160,
      showOverflowTooltip: true,
      align: 'center'
    },
    { prop: 'module', label: '系统模块', minWidth: 110, align: 'center' },
    {
      prop: 'operationType',
      label: '操作类型',
      minWidth: 80,
      align: 'center',
      formatter: (row: OperationLogItem) =>
        h(ElTag, { type: operationTagType(row.operationType) }, row.operationType)
    },
    { prop: 'userId', label: '用户ID', minWidth: 160, showOverflowTooltip: true, align: 'center' },
    {
      prop: 'nickname',
      label: '操作人员',
      minWidth: 160,
      showOverflowTooltip: true,
      align: 'center'
    },
    { prop: 'ipAddress', label: 'IP地址', minWidth: 135, align: 'center' },
    { prop: 'ipRegion', label: 'IP归属地', minWidth: 120, align: 'center' },
    {
      prop: 'state',
      label: '状态',
      minWidth: 80,
      align: 'center',
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
      align: 'center',
      formatter: (row: OperationLogItem) => formatDateTime(row.createTime)
    },
    {
      prop: 'costTime',
      label: '消耗时间',
      minWidth: 100,
      align: 'center',
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

  const openDetailDrawer = (row: OperationLogItem) => {
    detailRow.value = row;
    detailVisible.value = true;
  };

  const operationTagType = (type: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (type) {
      case '新增':
        return 'success';
      case '编辑':
        return 'warning';
      case '删除':
        return 'danger';
      default:
        return 'info';
    }
  };

  const handleDelete = async (row: OperationLogItem) => {
    await ElMessageBox.confirm(`确认删除"${row.logNumber}"吗？`, '删除确认', { type: 'warning' });
    await fetchDeleteOperationLog({ logNumbers: [row.logNumber] });
    ElMessage.success('删除成功');
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
    await fetchDeleteOperationLog({
      logNumbers: selectedRows.value.map((row) => row.logNumber)
    });
    selectedRows.value = [];
    ElMessage.success('删除成功');
    await refreshRemove();
  };

  const handleExport = async () => {
    if (exportLoading.value) return;
    try {
      await ElMessageBox.confirm('确认导出当前筛选条件下的所有操作日志吗？', '导出确认', {
        type: 'success'
      });
      exportLoading.value = true;
      const exportParams = Object.fromEntries(
        Object.entries(searchForm).filter(([, v]) => v !== undefined && v !== '')
      ) as Record<string, string>;
      const blob = await fetchOperationLogExport(exportParams);
      const filename = `操作日志_${new Date().toISOString().slice(0, 10)}.xlsx`;
      FileSaver.saveAs(blob, filename);
      ElMessage.success('导出成功');
    } catch (error) {
      if (error !== 'cancel') {
        console.error('导出失败:', error);
        ElMessage.error('导出失败');
      }
    } finally {
      exportLoading.value = false;
    }
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
