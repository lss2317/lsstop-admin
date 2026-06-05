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
          <ElButton @click="handleAddMenu" v-ripple> 添加菜单 </ElButton>
          <ElButton @click="toggleExpand" v-ripple>
            {{ isExpanded ? '收起' : '展开' }}
          </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        rowKey="path"
        :loading="loading"
        :columns="columns"
        :data="filteredTableData"
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
  import type { AppRouteRecord } from '@/types/router';
  import MenuDialog from './modules/menu-dialog.vue';
  import { mockGetMenuTree } from '@/apis/menu/mock';
  import { ElTag, ElMessageBox } from 'element-plus';

  import MenuSearch from './modules/menu-search.vue';

  defineOptions({ name: 'Menu' });

  // 状态管理
  const loading = ref(false);
  const isExpanded = ref(false);
  const tableRef = ref();
  const showSearchBar = ref(false);

  // 抽屉相关
  const dialogVisible = ref(false);
  const dialogType = ref<'menu' | 'button'>('menu');
  const editData = ref<AppRouteRecord | any>(null);

  // 搜索相关
  interface SearchForm {
    keyword?: string;
    menuType?: string;
    status?: string;
  }

  const searchForm = reactive<SearchForm>({
    keyword: undefined,
    menuType: undefined,
    status: undefined
  });

  const appliedFilters = reactive<SearchForm>({
    keyword: undefined,
    menuType: undefined,
    status: undefined
  });

  onMounted(() => {
    getMenuList();
  });

  /**
   * 获取菜单列表数据（mock）
   */
  const getMenuList = async (): Promise<void> => {
    loading.value = true;

    try {
      const list = await mockGetMenuTree();
      tableData.value = list;
    } catch (error) {
      throw error instanceof Error ? error : new Error('获取菜单失败');
    } finally {
      loading.value = false;
    }
  };

  /**
   * 判断是否为目录（children中有非按钮节点才算目录）
   */
  const isDirectory = (row: AppRouteRecord): boolean => {
    return !!row.children?.some((child) => !child.meta?.isAuthButton);
  };

  const getMenuTypeTag = (
    row: AppRouteRecord
  ): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    if (row.meta?.isAuthButton) return 'danger';
    if (isDirectory(row)) return 'info';
    if (row.meta?.link && row.meta?.isIframe) return 'success';
    if (row.path) return 'primary';
    if (row.meta?.link) return 'warning';
    return 'info';
  };

  const getMenuTypeText = (row: AppRouteRecord): string => {
    if (row.meta?.isAuthButton) return '按钮';
    if (isDirectory(row)) return '目录';
    if (row.meta?.link && row.meta?.isIframe) return '内嵌';
    if (row.path) return '菜单';
    if (row.meta?.link) return '外链';
    return '未知';
  };

  // 表格列配置
  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'meta.title',
      label: '菜单名称',
      minWidth: 160,
      formatter: (row: AppRouteRecord) => formatMenuTitle(row.meta?.title)
    },
    {
      prop: 'type',
      label: '菜单类型',
      formatter: (row: AppRouteRecord) => {
        return h(ElTag, { type: getMenuTypeTag(row) }, () => getMenuTypeText(row));
      }
    },
    {
      prop: 'path',
      label: '路由',
      formatter: (row: AppRouteRecord) => {
        if (row.meta?.isAuthButton) return '';
        return row.meta?.link || row.path || '';
      }
    },
    {
      prop: 'meta.authList',
      label: '权限标识',
      formatter: (row: AppRouteRecord) => {
        if (row.meta?.isAuthButton) {
          return row.meta?.authMark || '';
        }
        const authCount = row.children?.filter((c) => c.meta?.isAuthButton).length || 0;
        if (authCount === 0) return '';
        return `${authCount} 个权限标识`;
      }
    },
    {
      prop: 'sort',
      label: '排序',
      width: 80,
      align: 'center',
      formatter: (row: AppRouteRecord) => row.meta?.sort ?? ''
    },
    {
      prop: 'date',
      label: '编辑时间',
      formatter: () => '2025-04-01 10:00:00'
    },
    {
      prop: 'status',
      label: '状态',
      formatter: () => h(ElTag, { type: 'success' }, () => '启用')
    },
    {
      prop: 'operation',
      label: '操作',
      width: 180,
      align: 'right',
      formatter: (row: AppRouteRecord) => {
        const buttonStyle = { style: 'text-align: right' };

        if (row.meta?.isAuthButton) {
          return h('div', buttonStyle, [
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => handleEditAuth(row)
            }),
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => handleDeleteAuth()
            })
          ]);
        }

        return h('div', buttonStyle, [
          h(ArtButtonTable, {
            type: 'add',
            onClick: () => handleAddAuth(),
            title: '新增权限'
          }),
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEditMenu(row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDeleteMenu()
          })
        ]);
      }
    }
  ]);

  // 数据相关
  const tableData = ref<AppRouteRecord[]>([]);

  /**
   * 重置搜索条件
   */
  const handleReset = (): void => {
    Object.assign(searchForm, { keyword: undefined, menuType: undefined, status: undefined });
    Object.assign(appliedFilters, { keyword: undefined, menuType: undefined, status: undefined });
    getMenuList();
  };

  const handleSearch = (params: SearchForm): void => {
    Object.assign(appliedFilters, { ...params });
    getMenuList();
  };

  /**
   * 刷新菜单列表
   */
  const handleRefresh = (): void => {
    getMenuList();
  };

  /**
   * 搜索菜单
   */
  const searchMenu = (items: AppRouteRecord[]): AppRouteRecord[] => {
    const results: AppRouteRecord[] = [];
    const keyword = appliedFilters.keyword?.toLowerCase().trim() || '';
    const menuType = appliedFilters.menuType;
    const status = appliedFilters.status;

    for (const item of items) {
      // 关键词匹配：名称、路由、权限标识
      const menuTitle = formatMenuTitle(item.meta?.title || '').toLowerCase();
      const menuPath = (item.path || '').toLowerCase();
      const menuAuthMark = (item.meta?.authMark || '').toLowerCase();
      const keywordMatch =
        !keyword ||
        menuTitle.includes(keyword) ||
        menuPath.includes(keyword) ||
        menuAuthMark.includes(keyword);

      // 类型匹配
      let typeMatch = !menuType;
      if (menuType) {
        if (menuType === 'button') typeMatch = !!item.meta?.isAuthButton;
        else if (menuType === 'directory') typeMatch = isDirectory(item);
        else if (menuType === 'iframe') typeMatch = !!item.meta?.link && !!item.meta?.isIframe;
        else if (menuType === 'link') typeMatch = !!item.meta?.link && !item.meta?.isIframe;
        else if (menuType === 'menu')
          typeMatch = !!item.path && !isDirectory(item) && !item.meta?.isAuthButton;
      }

      // 状态匹配
      let statusMatch = !status;
      if (status === 'enabled') statusMatch = item.meta?.isEnable !== false;
      if (status === 'disabled') statusMatch = item.meta?.isEnable === false;

      if (item.children?.length) {
        const matchedChildren = searchMenu(item.children);
        if (matchedChildren.length > 0) {
          const clonedItem = { ...item, children: matchedChildren };
          results.push(clonedItem);
          continue;
        }
      }

      if (keywordMatch && typeMatch && statusMatch) {
        results.push(item);
      }
    }

    return results;
  };

  // 过滤后的表格数据
  const filteredTableData = computed(() => {
    return searchMenu(tableData.value);
  });

  /**
   * 添加菜单
   */
  const handleAddMenu = (): void => {
    dialogType.value = 'menu';
    editData.value = null;
    dialogVisible.value = true;
  };

  /**
   * 添加权限按钮
   */
  const handleAddAuth = (): void => {
    dialogType.value = 'menu';
    editData.value = null;
    dialogVisible.value = true;
  };

  /**
   * 编辑菜单
   */
  const handleEditMenu = (row: AppRouteRecord): void => {
    dialogType.value = 'menu';
    editData.value = row;
    dialogVisible.value = true;
  };

  /**
   * 编辑权限按钮
   */
  const handleEditAuth = (row: AppRouteRecord): void => {
    dialogType.value = 'button';
    editData.value = {
      title: row.meta?.title,
      authMark: row.meta?.authMark
    };
    dialogVisible.value = true;
  };

  interface MenuFormData {
    name: string;
    path: string;
    component?: string;
    icon?: string;
    roles?: string[];
    sort?: number;
    [key: string]: any;
  }

  /**
   * 提交表单数据（mock）
   */
  const handleSubmit = (formData: MenuFormData): void => {
    console.log('提交数据:', formData);
    getMenuList();
  };

  /**
   * 删除菜单
   */
  const handleDeleteMenu = async (): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      ElMessage.success('删除成功');
      getMenuList();
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败');
      }
    }
  };

  /**
   * 删除权限按钮
   */
  const handleDeleteAuth = async (): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该权限吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      ElMessage.success('删除成功');
      getMenuList();
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败');
      }
    }
  };

  /**
   * 切换展开/收起所有菜单
   */
  const toggleExpand = (): void => {
    isExpanded.value = !isExpanded.value;
    nextTick(() => {
      if (tableRef.value?.elTableRef && filteredTableData.value) {
        const processRows = (rows: AppRouteRecord[]) => {
          rows.forEach((row) => {
            if (row.children?.length) {
              tableRef.value.elTableRef.toggleRowExpansion(row, isExpanded.value);
              processRows(row.children);
            }
          });
        };
        processRows(filteredTableData.value);
      }
    });
  };
</script>
