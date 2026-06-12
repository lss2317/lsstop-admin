<!-- 接口权限管理页面 -->
<template>
  <div class="art-full-height">
    <ApiPermissionSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="art-table-card" :style="{ 'margin-top': showSearchBar ? '12px' : '0' }">
      <ArtTableHeader
        :showZebra="false"
        :loading="loading"
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        @refresh="handleRefresh"
      >
        <template #left>
          <ElButton type="primary" plain class="!rounded-lg" @click="handleAdd" v-ripple>
            新增权限
          </ElButton>
          <button
            class="ml-3 h-[var(--el-component-custom-height)] cursor-pointer rounded-[var(--el-border-radius-base)] border border-[var(--el-border-color)] bg-transparent px-4 text-sm text-[var(--el-text-color-regular)] transition-colors duration-200 hover:border-[var(--el-color-primary-light-3)] hover:bg-[var(--el-color-primary-light-9)] hover:text-[var(--el-color-primary)]"
            @click="toggleExpand"
          >
            {{ isExpanded ? '收起' : '展开' }}
          </button>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :data="tableData"
        :stripe="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="false"
      />

      <ApiPermissionDialog
        v-model:visible="dialogVisible"
        :editData="editData"
        :treeData="tableData"
        @submit="handleSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useTableColumns } from '@/hooks/core/useTableColumns';
  import { formatDateTime } from '@/utils/format';
  import type { ApiPermissionItem } from '@/apis/api-permission/types';
  import {
    fetchApiPermissionList,
    fetchAddApiPermission,
    fetchUpdateApiPermission,
    fetchDeleteApiPermission
  } from '@/apis/api-permission';
  import { ElMessageBox, ElTag } from 'element-plus';
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue';
  import ApiPermissionSearch from './modules/api-permission-search.vue';
  import ApiPermissionDialog from './modules/api-permission-dialog.vue';

  defineOptions({ name: 'ApiPermission' });

  const loading = ref(false);
  const isExpanded = ref(false);
  const tableRef = ref();
  const showSearchBar = ref(false);

  const dialogVisible = ref(false);
  const editData = ref<ApiPermissionItem | { _parentRow: ApiPermissionItem } | null>(null);

  interface SearchForm {
    keyword?: string;
    requestMethod?: string;
    isEnabled?: number;
  }

  const searchForm = reactive<SearchForm>({
    keyword: undefined,
    requestMethod: undefined,
    isEnabled: undefined
  });

  onMounted(() => {
    getList();
  });

  const getList = async (): Promise<void> => {
    loading.value = true;
    try {
      const params: Record<string, any> = {};
      if (searchForm.keyword) params.keyword = searchForm.keyword;
      if (searchForm.requestMethod) params.requestMethod = searchForm.requestMethod;
      if (searchForm.isEnabled !== undefined) params.isEnabled = searchForm.isEnabled;
      tableData.value = await fetchApiPermissionList(params);
    } catch {
      // 接口报错由全局拦截器展示
    } finally {
      loading.value = false;
    }
  };

  const getMethodTag = (method: string | null): 'success' | 'warning' | 'danger' | 'info' => {
    if (!method) return 'info';
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      GET: 'success',
      POST: 'warning',
      PUT: 'primary' as any,
      DELETE: 'danger'
    };
    return map[method] || 'info';
  };

  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'description',
      label: '权限描述',
      width: 200
    },
    {
      prop: 'requestMethod',
      label: '请求方法',
      width: 100,
      formatter: (row: ApiPermissionItem) => {
        if (!row.requestMethod) return h(ElTag, { type: 'info', size: 'small' }, () => '目录');
        return h(ElTag, { type: getMethodTag(row.requestMethod), size: 'small' }, () => row.requestMethod);
      }
    },
    {
      prop: 'requestUrl',
      label: '接口路径',
      width: 220,
      formatter: (row: ApiPermissionItem) => row.requestUrl || '-'
    },
    {
      prop: 'sort',
      label: '排序',
      width: 80,
      align: 'center',
      formatter: (row: ApiPermissionItem) => row.sort ?? ''
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      width: 110,
      formatter: (row: ApiPermissionItem) => formatDateTime(row.updateTime)
    },
    {
      prop: 'isEnabled',
      label: '状态',
      formatter: (row: ApiPermissionItem) =>
        h(ElTag, { type: row.isEnabled === 1 ? 'success' : 'info' }, () =>
          row.isEnabled === 1 ? '启用' : '禁用'
        )
    },
    {
      prop: 'operation',
      label: '操作',
      width: 160,
      align: 'center',
      formatter: (row: ApiPermissionItem) => {
        const buttonStyle = { style: 'text-align: right' };
        return h('div', buttonStyle, [
          h(ArtButtonTable, {
            type: 'add',
            onClick: () => handleAddChild(row),
            title: '新增子权限'
          }),
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEdit(row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDelete(row.id)
          })
        ]);
      }
    }
  ]);

  const tableData = ref<ApiPermissionItem[]>([]);

  const handleReset = (): void => {
    Object.assign(searchForm, { keyword: undefined, requestMethod: undefined, isEnabled: undefined });
    getList();
  };

  const handleSearch = (): void => {
    getList();
  };

  const handleRefresh = (): void => {
    getList();
  };

  const handleAdd = (): void => {
    editData.value = null;
    dialogVisible.value = true;
  };

  const handleAddChild = (row: ApiPermissionItem): void => {
    editData.value = { _parentRow: row };
    dialogVisible.value = true;
  };

  const handleEdit = (row: ApiPermissionItem): void => {
    editData.value = row;
    dialogVisible.value = true;
  };

  const handleSubmit = async (formData: Record<string, any>): Promise<void> => {
    const existingId = editData.value && 'id' in editData.value ? editData.value.id : undefined;
    if (existingId) {
      await fetchUpdateApiPermission({ ...formData, id: existingId });
    } else {
      await fetchAddApiPermission(formData);
    }
    ElMessage.success(`${existingId ? '编辑' : '新增'}成功`);
    dialogVisible.value = false;
    await getList();
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该接口权限吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      await fetchDeleteApiPermission(id);
      ElMessage.success('删除成功');
      await getList();
    } catch {
      // 取消或接口报错
    }
  };

  const toggleExpand = (): void => {
    isExpanded.value = !isExpanded.value;
    nextTick(() => {
      if (tableRef.value?.elTableRef && tableData.value) {
        const processRows = (rows: ApiPermissionItem[]) => {
          rows.forEach((row) => {
            if (row.children?.length) {
              tableRef.value.elTableRef.toggleRowExpansion(row, isExpanded.value);
              processRows(row.children);
            }
          });
        };
        processRows(tableData.value);
      }
    });
  };
</script>