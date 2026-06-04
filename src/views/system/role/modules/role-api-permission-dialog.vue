<template>
  <ElDialog
    v-model="visible"
    title="接口权限"
    width="700px"
    align-center
    class="el-dialog-border"
    @close="handleClose"
  >
    <ElScrollbar height="70vh" v-loading="loading">
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
  import type { RoleItem, ApiPermissionNode } from '@/apis/role/types';
  import {
    fetchApiPermissionTree,
    fetchRoleApiPermission,
    fetchSaveApiPermission
  } from '@/apis/role';

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
  const loading = ref(false);

  /**
   * 接口权限树数据
   */
  const apiPermissionList = ref<ApiPermissionNode[]>([]);

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
   * 监听弹窗打开，加载接口权限数据
   */
  watch(
    () => props.modelValue,
    async (newVal) => {
      if (newVal && props.roleData) {
        loading.value = true;
        try {
          const [tree, permission] = await Promise.all([
            fetchApiPermissionTree(),
            fetchRoleApiPermission(props.roleData.id)
          ]);
          apiPermissionList.value = tree;
          await nextTick();
          treeRef.value?.setCheckedKeys(permission);
        } finally {
          loading.value = false;
        }
      }
    }
  );

  /**
   * 获取HTTP方法标签样式
   */
  const getMethodTagType = (
    method: string
  ): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
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
   * 获取所有叶子节点的 key
   */
  const getAllLeafKeys = (nodes: ApiPermissionNode[]): number[] => {
    const keys: number[] = [];
    const traverse = (nodeList: ApiPermissionNode[]): void => {
      nodeList.forEach((node) => {
        if (node.children?.length) {
          traverse(node.children);
        } else {
          keys.push(node.id);
        }
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
   * 关闭弹窗并清空选中状态
   */
  const handleClose = () => {
    visible.value = false;
    apiPermissionList.value = [];
    treeRef.value?.setCheckedKeys([]);
    isSelectAll.value = false;
  };

  /**
   * 保存接口权限配置
   */
  const savePermission = async () => {
    if (!props.roleData) return;

    const apiIds: number[] = treeRef.value?.getCheckedKeys() ?? [];

    await fetchSaveApiPermission({
      roleId: props.roleData.id,
      apiIds
    });
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
