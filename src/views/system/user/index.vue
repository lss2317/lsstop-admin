<!-- 用户管理页面 -->
<template>
  <div class="user-page art-full-height">
    <!-- 搜索栏 -->
    <UserSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></UserSearch>

    <ElCard class="art-table-card" :style="{ 'margin-top': showSearchBar ? '12px' : '0' }">
      <!-- 表格头部 -->
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElButton type="primary" plain class="!rounded-lg" @click="showDialog('add')" v-ripple>
            新增用户
          </ElButton>
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

      <!-- 用户弹窗 -->
      <UserDialog
        v-model="dialogVisible"
        :dialog-type="dialogType"
        :user-data="currentUserData"
        @success="refreshData"
      />
    </ElCard>

    <!-- 菜单权限弹窗 -->
    <UserMenuPermissionDialog
      v-model="menuPermissionDialog"
      :user-data="currentUserData"
      @success="refreshData"
    />

    <!-- 接口权限弹窗 -->
    <UserApiPermissionDialog
      v-model="apiPermissionDialog"
      :user-data="currentUserData"
      @success="refreshData"
    />

    <!-- 重置密码弹窗 -->
    <UserResetPasswordDialog v-model="resetPasswordDialog" :user-data="currentUserData" />
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/hooks/core/useTable';
  import type { ColumnOption } from '@/types/component';
  import type { UserListItem, UserSearchParams, RoleBrief } from '@/apis/user';
  import type { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue';
  import { fetchUserList, fetchDeleteUser } from '@/apis/user';
  import { ElTag, ElMessageBox, ElImage, ElPopover } from 'element-plus';
  import { formatDateTime } from '@/utils/format';
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue';
  import UserSearch from './modules/user-search.vue';
  import UserDialog from './modules/user-dialog.vue';
  import UserMenuPermissionDialog from './modules/user-menu-permission-dialog.vue';
  import UserApiPermissionDialog from './modules/user-api-permission-dialog.vue';
  import UserResetPasswordDialog from './modules/user-reset-password-dialog.vue';

  defineOptions({ name: 'User' });

  /** 弹窗相关 */
  const dialogType = ref<'add' | 'edit'>('add');
  const dialogVisible = ref(false);
  const menuPermissionDialog = ref(false);
  const apiPermissionDialog = ref(false);
  const resetPasswordDialog = ref(false);
  const currentUserData = ref<UserListItem | undefined>(undefined);

  /** 控制 */
  const showSearchBar = ref(false);

  /** 搜索表单 */
  const searchForm = reactive<UserSearchParams>({
    userId: undefined,
    nickname: undefined,
    email: undefined,
    status: undefined,
    current: 1,
    size: 20
  });

  /** 用户状态配置 */
  const USER_STATUS_CONFIG = {
    1: { type: 'success' as const, text: '启用' },
    0: { type: 'warning' as const, text: '禁用' }
  } as const;

  /**
   * 获取用户状态配置
   */
  const getUserStatusConfig = (status: number) => {
    return (
      USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    );
  };

  /**
   * 创建表格列配置
   */
  const createColumns = (): ColumnOption<UserListItem>[] => [
    {
      prop: 'userId',
      label: '用户ID',
      minWidth: 160,
      showOverflowTooltip: true
    },
    {
      prop: 'userInfo',
      label: '用户信息',
      minWidth: 240,
      formatter: (row) => {
        return h('div', { class: 'user flex-c' }, [
          h(ElImage, {
            class: 'size-9.5 rounded-md shrink-0',
            src: row.avatar,
            previewSrcList: [row.avatar],
            previewTeleported: true
          }),
          h('div', { class: 'ml-2 min-w-0' }, [
            h('p', { class: 'user-name truncate', title: row.nickname }, row.nickname),
            h(
              'p',
              { class: 'text-xs text-gray-400 truncate', title: row.email || '-' },
              row.email || '-'
            )
          ])
        ]);
      }
    },
    {
      prop: 'roles',
      label: '角色',
      minWidth: 150,
      formatter: (row) => {
        if (!row.roles || row.roles.length === 0) {
          return '-';
        }

        const MAX_SHOW = 2;
        const visible = row.roles.slice(0, MAX_SHOW);
        const overflow = row.roles.slice(MAX_SHOW);

        const roleTag = (role: RoleBrief) =>
          h(ElTag, { type: 'info', class: 'role-tag', title: role.roleName }, () => role.roleName);

        const tags = visible.map(roleTag);

        if (overflow.length > 0) {
          const overflowTag = h(
            ElPopover,
            {
              trigger: 'hover',
              placement: 'top',
              'show-arrow': false,
              'popper-style': { padding: '8px' }
            },
            {
              reference: () =>
                h(
                  ElTag,
                  { type: 'info', style: { cursor: 'pointer' } },
                  () => `+${overflow.length}`
                ),
              default: () => h('div', { class: 'flex flex-wrap gap-1' }, row.roles.map(roleTag))
            }
          );
          return h('div', { class: 'flex gap-1' }, [...tags, overflowTag]);
        }

        return h('div', { class: 'flex gap-1' }, tags);
      }
    },
    {
      prop: 'status',
      label: '状态',
      width: 80,
      align: 'center',
      formatter: (row) => {
        const statusConfig = getUserStatusConfig(row.status);
        return h(
          ElTag,
          { type: statusConfig.type as 'success' | 'warning' },
          () => statusConfig.text
        );
      }
    },
    {
      prop: 'lastLoginTime',
      label: '最近登录',
      width: 180,
      formatter: (row) => (row.lastLoginTime ? formatDateTime(row.lastLoginTime) : '-')
    },
    {
      prop: 'operation',
      label: '操作',
      width: 80,
      fixed: 'right',
      formatter: (row: UserListItem) =>
        h('div', [
          h(ArtButtonMore, {
            list: [
              {
                key: 'edit',
                label: '编辑用户',
                icon: 'ri:edit-2-line'
              },
              {
                key: 'menuPermission',
                label: '菜单权限',
                icon: 'ri:user-3-line'
              },
              {
                key: 'apiPermission',
                label: '接口权限',
                icon: 'ri:code-line'
              },
              {
                key: 'resetPassword',
                label: '重置密码',
                icon: 'ri:lock-password-line'
              },
              {
                key: 'delete',
                label: '删除用户',
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
      apiFn: fetchUserList,
      apiParams: {
        current: 1,
        size: 20
      },
      columnsFactory: createColumns
    }
  });

  /**
   * 操作列下拉菜单点击处理
   */
  const buttonMoreClick = (item: ButtonMoreItem, row: UserListItem) => {
    switch (item.key) {
      case 'edit':
        showDialog('edit', row);
        break;
      case 'menuPermission':
        showMenuPermissionDialog(row);
        break;
      case 'apiPermission':
        showApiPermissionDialog(row);
        break;
      case 'resetPassword':
        showResetPasswordDialog(row);
        break;
      case 'delete':
        deleteUser(row);
        break;
    }
  };

  /**
   * 搜索处理
   */
  const handleSearch = (params: UserSearchParams) => {
    replaceSearchParams(params as unknown as Record<string, unknown>);
    getData();
  };

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: 'add' | 'edit', row?: UserListItem): void => {
    dialogType.value = type;
    currentUserData.value = row;
    nextTick(() => {
      dialogVisible.value = true;
    });
  };

  /**
   * 显示菜单权限弹窗
   */
  const showMenuPermissionDialog = (row: UserListItem): void => {
    currentUserData.value = row;
    menuPermissionDialog.value = true;
  };

  /**
   * 显示接口权限弹窗
   */
  const showApiPermissionDialog = (row: UserListItem): void => {
    currentUserData.value = row;
    apiPermissionDialog.value = true;
  };

  /**
   * 显示重置密码弹窗
   */
  const showResetPasswordDialog = (row: UserListItem): void => {
    currentUserData.value = row;
    resetPasswordDialog.value = true;
  };

  /**
   * 删除用户
   */
  const deleteUser = (row: UserListItem): void => {
    ElMessageBox.confirm(`确定删除用户"${row.nickname}"吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        await fetchDeleteUser(row.userId);
        ElMessage.success('删除成功');
        await refreshData();
      })
      .catch(() => {
        // 用户取消删除，静默关闭
      });
  };
</script>

<style scoped>
  .text-xs {
    font-size: 12px;
  }

  .text-gray-400 {
    color: #9ca3af;
  }

  :deep(.role-tag) {
    max-width: 10em;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
