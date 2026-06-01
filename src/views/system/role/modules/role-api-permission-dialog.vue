<template>
  <ElDialog
    v-model="visible"
    title="接口权限"
    width="700px"
    align-center
    class="el-dialog-border"
    @close="handleClose"
  >
    <ElScrollbar height="70vh">
      <ElTree
        ref="treeRef"
        :data="apiPermissionList"
        show-checkbox
        node-key="id"
        :default-expand-all="isExpandAll"
        :props="treeProps"
        @check="handleTreeCheck"
      >
        <template #default="{ data }">
          <div class="api-node">
            <ElTag v-if="data.method" :type="getMethodTagType(data.method)" size="small">
              {{ data.method }}
            </ElTag>
            <span class="api-name">{{ data.name }}</span>
            <span v-if="data.path" class="api-path">{{ data.path }}</span>
          </div>
        </template>
      </ElTree>
    </ElScrollbar>
    <template #footer>
      <ElButton @click="toggleExpandAll">{{ isExpandAll ? '全部收起' : '全部展开' }}</ElButton>
      <ElButton @click="toggleSelectAll" style="margin-left: 8px">{{
        isSelectAll ? '取消全选' : '全部选择'
      }}</ElButton>
      <ElButton type="primary" @click="savePermission" style="margin-left: 8px">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { RoleItem } from '@/apis/role/types';

  interface Props {
    modelValue: boolean;
    roleData?: RoleItem;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'success'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    roleData: undefined
  });

  const emit = defineEmits<Emits>();

  const treeRef = ref();
  const isExpandAll = ref(true);
  const isSelectAll = ref(false);

  /**
   * 弹窗显示状态双向绑定
   */
  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  /**
   * 树形组件配置
   */
  const treeProps = {
    children: 'children',
    label: 'name'
  };

  /**
   * 示例接口权限数据
   */
  const apiPermissionList = ref([
    {
      id: 'api_1',
      name: '用户管理',
      children: [
        { id: 'api_1_1', name: '查询用户列表', path: '/api/user/list', method: 'GET' },
        { id: 'api_1_2', name: '新增用户', path: '/api/user/add', method: 'POST' },
        { id: 'api_1_3', name: '编辑用户', path: '/api/user/edit', method: 'PUT' },
        { id: 'api_1_4', name: '删除用户', path: '/api/user/delete', method: 'DELETE' }
      ]
    },
    {
      id: 'api_2',
      name: '角色管理',
      children: [
        { id: 'api_2_1', name: '查询角色列表', path: '/api/role/list', method: 'GET' },
        { id: 'api_2_2', name: '新增角色', path: '/api/role/add', method: 'POST' },
        { id: 'api_2_3', name: '编辑角色', path: '/api/role/edit', method: 'PUT' },
        { id: 'api_2_4', name: '删除角色', path: '/api/role/delete', method: 'DELETE' }
      ]
    },
    {
      id: 'api_3',
      name: '菜单管理',
      children: [
        { id: 'api_3_1', name: '查询菜单列表', path: '/api/menu/list', method: 'GET' },
        { id: 'api_3_2', name: '新增菜单', path: '/api/menu/add', method: 'POST' },
        { id: 'api_3_3', name: '编辑菜单', path: '/api/menu/edit', method: 'PUT' },
        { id: 'api_3_4', name: '删除菜单', path: '/api/menu/delete', method: 'DELETE' }
      ]
    },
    {
      id: 'api_4',
      name: '日志管理',
      children: [
        { id: 'api_4_1', name: '查询操作日志', path: '/api/log/operation/list', method: 'GET' },
        { id: 'api_4_2', name: '查询登录日志', path: '/api/log/login/list', method: 'GET' },
        { id: 'api_4_3', name: '导出操作日志', path: '/api/log/operation/export', method: 'POST' },
        { id: 'api_4_4', name: '导出登录日志', path: '/api/log/login/export', method: 'POST' }
      ]
    }
  ]);

  /**
   * 获取HTTP方法标签样式
   */
  const getMethodTagType = (method: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'success';
      case 'POST':
        return 'primary';
      case 'PUT':
        return 'warning';
      case 'DELETE':
        return 'danger';
      default:
        return 'info';
    }
  };

  /**
   * 获取所有叶子节点key
   */
  const getAllLeafKeys = (nodes: any[]): string[] => {
    const keys: string[] = [];
    const traverse = (nodeList: any[]): void => {
      nodeList.forEach((node) => {
        if (node.id && !node.children) keys.push(node.id);
        if (node.children?.length) traverse(node.children);
      });
    };
    traverse(nodes);
    return keys;
  };

  /**
   * 切换全部展开/收起状态
   */
  const toggleExpandAll = () => {
    const tree = treeRef.value;
    if (!tree) return;

    const nodes = tree.store.nodesMap;
    Object.values(nodes).forEach((node: any) => {
      node.expanded = !isExpandAll.value;
    });

    isExpandAll.value = !isExpandAll.value;
  };

  /**
   * 切换全选/取消全选状态
   */
  const toggleSelectAll = () => {
    const tree = treeRef.value;
    if (!tree) return;

    if (!isSelectAll.value) {
      const allKeys = getAllLeafKeys(apiPermissionList.value);
      tree.setCheckedKeys(allKeys);
    } else {
      tree.setCheckedKeys([]);
    }

    isSelectAll.value = !isSelectAll.value;
  };

  /**
   * 处理树节点选中状态变化
   */
  const handleTreeCheck = () => {
    const tree = treeRef.value;
    if (!tree) return;

    const checkedKeys = tree.getCheckedKeys();
    const allKeys = getAllLeafKeys(apiPermissionList.value);

    isSelectAll.value = checkedKeys.length === allKeys.length && allKeys.length > 0;
  };

  /**
   * 监听弹窗打开，初始化权限数据
   */
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal && props.roleData) {
        console.log('设置接口权限:', props.roleData);
      }
    }
  );

  /**
   * 关闭弹窗并清空选中状态
   */
  const handleClose = () => {
    visible.value = false;
    treeRef.value?.setCheckedKeys([]);
  };

  /**
   * 保存接口权限配置
   */
  const savePermission = () => {
    // TODO: 调用保存接口权限接口
    ElMessage.success('接口权限保存成功');
    emit('success');
    handleClose();
  };
</script>

<style scoped lang="scss">
.api-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.api-name {
  font-weight: 500;
  color: #303133;
}

.api-path {
  color: #909399;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}
</style>
