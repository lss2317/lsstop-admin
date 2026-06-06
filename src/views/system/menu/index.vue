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
  import type { BackendMenuItem } from '@/apis/menu/types';
  import MenuDialog from './modules/menu-dialog.vue';
  import { mockGetMenuAdminList } from '@/apis/menu/mock';
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
  const editData = ref<BackendMenuItem | any>(null);

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
      const list = await mockGetMenuAdminList();
      tableData.value = list;
    } catch (error) {
      throw error instanceof Error ? error : new Error('获取菜单失败');
    } finally {
      loading.value = false;
    }
  };

  const getMenuTypeTag = (
    row: BackendMenuItem
  ): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    if (row.menuType === 3) return 'danger';
    if (row.menuType === 1) return 'info';
    if (row.link && row.isIframe) return 'success';
    if (row.link) return 'warning';
    return 'primary';
  };

  const getMenuTypeText = (row: BackendMenuItem): string => {
    if (row.menuType === 3) return '按钮';
    if (row.menuType === 1) return '目录';
    if (row.link && row.isIframe) return '内嵌';
    if (row.link) return '外链';
    return '菜单';
  };

  // 表格列配置
  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'title',
      label: '菜单名称',
      width: 280,
      formatter: (row: BackendMenuItem) =>
        h(
          'span',
          { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
          [
          h(
            'button',
            {
              type: 'button',
              disabled: true,
              'aria-label': '拖拽排序',
              title: '拖拽排序',
              style: {
                width: '26px',
                height: '26px',
                color: 'var(--el-text-color-placeholder)',
                background: 'var(--el-fill-color-blank)',
                border: '1px solid var(--el-border-color)',
                borderRadius: '6px',
                flex: 'none',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0',
                cursor: 'not-allowed'
              }
            },
            [
              h(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  'aria-hidden': 'true',
                  width: '1em',
                  height: '1em',
                  viewBox: '0 0 24 24'
                },
                [
                  h('path', {
                    fill: 'currentColor',
                    d: 'M8.5 7a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m0 6.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m1.5 5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M15.5 7a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m1.5 5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-1.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3'
                  })
                ]
              )
            ]
          ),
          h('span', formatMenuTitle(row.title))
        ])
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
      label: '编辑时间',
      formatter: (row: BackendMenuItem) => row.updateTime || ''
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
      align: 'right',
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
  const searchMenu = (items: BackendMenuItem[]): BackendMenuItem[] => {
    const results: BackendMenuItem[] = [];
    const keyword = appliedFilters.keyword?.toLowerCase().trim() || '';
    const menuType = appliedFilters.menuType;
    const status = appliedFilters.status;

    for (const item of items) {
      // 关键词匹配：名称、路由、权限标识
      const menuTitle = formatMenuTitle(item.title || '').toLowerCase();
      const menuPath = (item.path || '').toLowerCase();
      const menuAuthMark = (item.authMark || '').toLowerCase();
      const keywordMatch =
        !keyword ||
        menuTitle.includes(keyword) ||
        menuPath.includes(keyword) ||
        menuAuthMark.includes(keyword);

      // 类型匹配
      let typeMatch = !menuType;
      if (menuType) {
        if (menuType === 'button') typeMatch = item.menuType === 3;
        else if (menuType === 'directory') typeMatch = item.menuType === 1;
        else if (menuType === 'iframe') typeMatch = !!item.link && item.isIframe;
        else if (menuType === 'link') typeMatch = !!item.link && !item.isIframe;
        else if (menuType === 'menu') typeMatch = item.menuType === 2 && !item.link;
      }

      // 状态匹配
      let statusMatch = !status;
      if (status === 'enabled') statusMatch = item.isEnabled === 1;
      if (status === 'disabled') statusMatch = item.isEnabled === 0;

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
   * 提交表单数据（mock）
   */
  const handleSubmit = (formData: MenuFormData): void => {
    console.log('提交数据:', formData);
    getMenuList();
  };

  /**
   * 删除菜单
   * TODO: 对接删除接口，传入菜单 id
   */
  const handleDeleteMenu = async (id: number): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      // TODO: await deleteMenu(id)
      ElMessage.success('删除成功');
      await getMenuList();
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败');
      }
    }
  };

  /**
   * 删除权限按钮
   * TODO: 对接删除接口，传入权限按钮 id
   */
  const handleDeleteAuth = async (id: number): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该权限吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      // TODO: await deleteMenu(id)
      ElMessage.success('删除成功');
      await getMenuList();
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
        const processRows = (rows: BackendMenuItem[]) => {
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
