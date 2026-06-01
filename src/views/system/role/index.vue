<template>
  <div class="art-full-height">
    <RoleSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></RoleSearch>

    <ElCard class="art-table-card" :style="{ 'margin-top': showSearchBar ? '12px' : '0' }">
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增角色</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>

    <!-- 角色编辑弹窗 -->
    <RoleEditDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :role-data="currentRoleData"
      @success="refreshData"
    />

    <!-- 菜单权限弹窗 -->
    <RolePermissionDialog
      v-model="permissionDialog"
      :role-data="currentRoleData"
      @success="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue';
  import { useTable } from '@/hooks/core/useTable';
  import type { ColumnOption } from '@/types/component';
  import type { RoleItem } from '@/apis/role/types';
  import { fetchRoleList } from '@/apis/role';
  import { ElTag, ElMessageBox } from 'element-plus';
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue';
  import RoleSearch from './modules/role-search.vue';
  import RoleEditDialog from './modules/role-edit-dialog.vue';
  import RolePermissionDialog from './modules/role-permission-dialog.vue';

  defineOptions({ name: 'Role' });

  const dialogVisible = ref(false);
  const permissionDialog = ref(false);
  const dialogType = ref<'add' | 'edit'>('add');
  const currentRoleData = ref<RoleItem | undefined>(undefined);
  const showSearchBar = ref(false);

  interface SearchForm {
    name?: string;
    code?: string;
    status?: number;
  }

  const searchForm = reactive<SearchForm>({
    name: undefined,
    code: undefined,
    status: undefined
  });

  const createColumns = (): ColumnOption<RoleItem>[] => [
    {
      prop: 'name',
      label: '角色名称',
      minWidth: 120
    },
    {
      prop: 'code',
      label: '角色编码',
      minWidth: 120
    },
    {
      prop: 'description',
      label: '角色描述',
      minWidth: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'status',
      label: '角色状态',
      width: 100,
      formatter: (row: RoleItem) => {
        const statusConfig =
          row.status === 1 ? { type: 'success', text: '启用' } : { type: 'warning', text: '禁用' };
        return h(
          ElTag,
          { type: statusConfig.type as 'success' | 'warning' },
          () => statusConfig.text
        );
      }
    },
    {
      prop: 'createTime',
      label: '创建日期',
      width: 180,
      sortable: true
    },
    {
      prop: 'operation',
      label: '操作',
      width: 80,
      fixed: 'right',
      formatter: (row: RoleItem) =>
        h('div', [
          h(ArtButtonMore, {
            list: [
              {
                key: 'permission',
                label: '菜单权限',
                icon: 'ri:user-3-line'
              },
              {
                key: 'edit',
                label: '编辑角色',
                icon: 'ri:edit-2-line'
              },
              {
                key: 'delete',
                label: '删除角色',
                icon: 'ri:delete-bin-4-line',
                color: '#f56c6c'
              }
            ],
            onClick: (item: ButtonMoreItem) => buttonMoreClick(item, row)
          })
        ])
    }
  ];

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchRoleList,
      apiParams: {
        current: 1,
        size: 20
      },
      columnsFactory: createColumns
    }
  });

  /**
   * 搜索处理
   * @param params 搜索参数
   */
  const handleSearch = (params: SearchForm) => {
    replaceSearchParams(params as Record<string, unknown>);
    getData();
  };

  const showDialog = (type: 'add' | 'edit', row?: RoleItem) => {
    dialogVisible.value = true;
    dialogType.value = type;
    currentRoleData.value = row;
  };

  const buttonMoreClick = (item: ButtonMoreItem, row: RoleItem) => {
    switch (item.key) {
      case 'permission':
        showPermissionDialog(row);
        break;
      case 'edit':
        showDialog('edit', row);
        break;
      case 'delete':
        deleteRole(row);
        break;
    }
  };

  const showPermissionDialog = (row?: RoleItem) => {
    permissionDialog.value = true;
    currentRoleData.value = row;
  };

  const deleteRole = (row: RoleItem) => {
    ElMessageBox.confirm(`确定删除角色"${row.name}"吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          const { fetchDeleteRole } = await import('@/apis/role');
          await fetchDeleteRole({ ids: [row.id] });
          ElMessage.success('删除成功');
          refreshData();
        } catch (error) {
          console.error('删除失败:', error);
        }
      })
      .catch(() => {
        ElMessage.info('已取消删除');
      });
  };
</script>
