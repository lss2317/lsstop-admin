<!-- 菜单管理页面 -->
<template>
  <div class="art-full-height">
    <MenuSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="art-table-card" :style="{ 'margin-top': showSearchBar ? '12px' : '0' }">
      <!-- 表格头部 -->
      <ArtTableHeader
        :showZebra="false"
        :loading="loading"
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        @refresh="handleRefresh"
      >
        <template #left>
          <ElButton type="primary" plain class="!rounded-lg" @click="handleAddMenu" v-ripple>
            新增菜单
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

      <!-- 菜单抽屉 -->
      <MenuDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :editData="editData"
        @submit="handleSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { formatMenuTitle } from '@/utils/router';
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue';
  import { useTableColumns } from '@/hooks/core/useTableColumns';
  import type { BackendMenuItem } from '@/apis/menu/types';
  import MenuDialog from './modules/menu-dialog.vue';
  import { fetchMenuAdminList, fetchAddMenu, fetchUpdateMenu, fetchDeleteMenu } from '@/apis/menu';
  import { ElMessageBox, ElTag } from 'element-plus';

  import MenuSearch from './modules/menu-search.vue';
  import { formatDateTime } from '@/utils';

  defineOptions({ name: 'Menu' });

  // 状态管理
  const loading = ref(false);
  const isExpanded = ref(false);
  const tableRef = ref();
  const showSearchBar = ref(false);

  // 抽屉相关
  const dialogVisible = ref(false);
  const dialogType = ref<'menu' | 'button'>('menu');
  const editData = ref<BackendMenuItem | { _parentRow: BackendMenuItem } | null>(null);

  // 搜索相关
  interface SearchForm {
    keyword?: string;
    menuType?: string;
    isEnabled?: number;
  }

  const searchForm = reactive<SearchForm>({
    keyword: undefined,
    menuType: undefined,
    isEnabled: undefined
  });

  onMounted(() => {
    getMenuList();
  });

  /**
   * 获取菜单列表数据
   */
  const getMenuList = async (): Promise<void> => {
    loading.value = true;

    try {
      const params: Record<string, any> = {};
      if (searchForm.keyword) params.keyword = searchForm.keyword;
      if (searchForm.menuType) params.menuType = searchForm.menuType;
      if (searchForm.isEnabled !== undefined) params.isEnabled = searchForm.isEnabled;
      tableData.value = await fetchMenuAdminList(params);
    } catch {
      // 接口报错由全局拦截器展示
    } finally {
      loading.value = false;
    }
  };

  const getMenuTypeTag = (
    row: BackendMenuItem
  ): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    if (row.menuType === 3) return 'danger';
    if (row.menuType === 1) return 'info';
    if (row.menuType === 4) return 'success';
    if (row.menuType === 5) return 'warning';
    return 'primary';
  };

  const getMenuTypeText = (row: BackendMenuItem): string => {
    if (row.menuType === 5) return '外链';
    if (row.menuType === 4) return '内嵌';
    if (row.menuType === 3) return '按钮';
    if (row.menuType === 1) return '目录';
    return '菜单';
  };

  // 表格列配置
  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'title',
      label: '菜单名称',
      minWidth: 150,
      formatter: (row: BackendMenuItem) => formatMenuTitle(row.title)
    },
    {
      prop: 'menuType',
      label: '菜单类型',
      formatter: (row: BackendMenuItem) => {
        return h(ElTag, { type: getMenuTypeTag(row) }, () => getMenuTypeText(row));
      }
    },
    {
      prop: 'path',
      label: '路由',
      width: 150,
      align: 'center',
      formatter: (row: BackendMenuItem) => {
        if (row.menuType === 3) return '';
        return row.link || row.path || '';
      }
    },
    {
      prop: 'authMark',
      label: '权限标识',
      formatter: (row: BackendMenuItem) => {
        if (row.menuType === 3) {
          return row.authMark || '';
        }
        const authCount = row.children?.filter((c) => c.menuType === 3).length || 0;
        if (authCount === 0) return '';
        return `${authCount} 个权限标识`;
      }
    },
    {
      prop: 'sort',
      label: '排序',
      width: 80,
      align: 'center',
      formatter: (row: BackendMenuItem) => row.sort ?? ''
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      width: 110,
      formatter: (row: BackendMenuItem) => formatDateTime(row.updateTime)
    },
    {
      prop: 'isEnabled',
      label: '状态',
      formatter: (row: BackendMenuItem) =>
        h(ElTag, { type: row.isEnabled === 1 ? 'success' : 'info' }, () =>
          row.isEnabled === 1 ? '启用' : '禁用'
        )
    },
    {
      prop: 'operation',
      label: '操作',
      width: 180,
      align: 'center',
      formatter: (row: BackendMenuItem) => {
        const buttonStyle = { style: 'text-align: right' };

        if (row.menuType === 3) {
          return h('div', buttonStyle, [
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => handleEditAuth(row)
            }),
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => handleDeleteAuth(row.id)
            })
          ]);
        }

        return h('div', buttonStyle, [
          h(ArtButtonTable, {
            type: 'add',
            onClick: () => handleAddAuth(row),
            title: '新增权限'
          }),
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEditMenu(row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDeleteMenu(row.id)
          })
        ]);
      }
    }
  ]);

  // 数据相关
  const tableData = ref<BackendMenuItem[]>([]);

  /**
   * 重置搜索条件
   */
  const handleReset = (): void => {
    Object.assign(searchForm, { keyword: undefined, menuType: undefined, isEnabled: undefined });
    getMenuList();
  };

  const handleSearch = (): void => {
    getMenuList();
  };

  /**
   * 刷新菜单列表
   */
  const handleRefresh = (): void => {
    getMenuList();
  };

  /**
   * 添加菜单
   */
  const handleAddMenu = (): void => {
    dialogType.value = 'menu';
    editData.value = null;
    dialogVisible.value = true;
  };

  /**
   * 添加权限按钮（在当前行下新增）
   */
  const handleAddAuth = (row: BackendMenuItem): void => {
    dialogType.value = 'menu';
    editData.value = { _parentRow: row };
    dialogVisible.value = true;
  };

  /**
   * 编辑菜单
   */
  const handleEditMenu = (row: BackendMenuItem): void => {
    dialogType.value = 'menu';
    editData.value = row;
    dialogVisible.value = true;
  };

  /**
   * 编辑权限按钮
   */
  const handleEditAuth = (row: BackendMenuItem): void => {
    dialogType.value = 'button';
    editData.value = row;
    dialogVisible.value = true;
  };

  interface MenuFormData {
    title: string;
    name: string;
    path: string;
    component?: string;
    icon?: string;
    sort?: number;
    [key: string]: any;
  }

  /**
   * 提交表单数据
   */
  const handleSubmit = async (formData: MenuFormData): Promise<void> => {
    const existingId = editData.value && 'id' in editData.value ? editData.value.id : undefined;
    if (existingId) {
      await fetchUpdateMenu({ ...formData, id: existingId });
    } else {
      await fetchAddMenu(formData);
    }
    ElMessage.success(`${existingId ? '编辑' : '新增'}成功`);
    dialogVisible.value = false;
    await getMenuList();
  };

  /**
   * 删除菜单
   */
  const handleDeleteMenu = async (id: number): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      await fetchDeleteMenu(id);
      ElMessage.success('删除成功');
      await getMenuList();
    } catch {
      // 取消或接口报错（接口报错由全局拦截器展示）
    }
  };

  /**
   * 删除权限按钮
   */
  const handleDeleteAuth = async (id: number): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该权限吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      await fetchDeleteMenu(id);
      ElMessage.success('删除成功');
      await getMenuList();
    } catch {
      // 取消或接口报错（接口报错由全局拦截器展示）
    }
  };

  /**
   * 切换展开/收起所有菜单
   */
  const toggleExpand = (): void => {
    isExpanded.value = !isExpanded.value;
    nextTick(() => {
      if (tableRef.value?.elTableRef && tableData.value) {
        const processRows = (rows: BackendMenuItem[]) => {
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
