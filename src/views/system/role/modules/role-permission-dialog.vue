<template>
  <ElDialog
    v-model="visible"
    title="菜单权限"
    width="700px"
    align-center
    class="el-dialog-border"
    @close="handleClose"
  >
    <ElScrollbar height="70vh" v-loading="loading">
      <ElTree
        ref="treeRef"
        :data="menuTree"
        show-checkbox
        node-key="id"
        check-strictly
        :default-expand-all="isExpandAll"
        :props="defaultProps"
        @check="handleCascadeCheck"
      >
        <template #default="{ data }">
          <span>{{ data.title }}</span>
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
  import type { RoleItem, MenuPermissionNode } from '@/apis/role/types';
  import {
    fetchMenuPermissionTree,
    fetchRoleMenuPermission,
    fetchSaveMenuPermission
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
   * 菜单权限树数据
   */
  const menuTree = ref<MenuPermissionNode[]>([]);

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
  const defaultProps = {
    children: 'children',
    label: 'title'
  };

  /**
   * 监听弹窗打开，加载菜单权限数据
   */
  watch(
    () => props.modelValue,
    async (newVal) => {
      if (newVal && props.roleData) {
        loading.value = true;
        try {
          const [tree, permission] = await Promise.all([
            fetchMenuPermissionTree(),
            fetchRoleMenuPermission(props.roleData.id)
          ]);
          menuTree.value = tree;
          await nextTick();
          treeRef.value?.setCheckedKeys(permission);
        } finally {
          loading.value = false;
        }
      }
    }
  );

  /**
   * 关闭弹窗并清空选中状态
   */
  const handleClose = () => {
    visible.value = false;
    menuTree.value = [];
    treeRef.value?.setCheckedKeys([]);
    isSelectAll.value = false;
  };

  /**
   * 保存菜单权限
   */
  const savePermission = async () => {
    if (!props.roleData) return;

    const menuIds: number[] = treeRef.value?.getCheckedKeys() ?? [];

    await fetchSaveMenuPermission({
      roleId: props.roleData.id,
      menuIds
    });
    ElMessage.success('菜单权限保存成功');
    emit('success');
    handleClose();
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
      const allKeys = getAllLeafKeys(menuTree.value);
      tree.setCheckedKeys(allKeys);
    } else {
      tree.setCheckedKeys([]);
    }

    isSelectAll.value = !isSelectAll.value;
  };

  /**
   * 递归获取所有叶子节点的 key
   */
  const getAllLeafKeys = (nodes: MenuPermissionNode[]): number[] => {
    const keys: number[] = [];
    const traverse = (nodeList: MenuPermissionNode[]): void => {
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
   * 处理树节点选中状态变化
   * 同步更新全选按钮状态
   */
  const handleTreeCheck = () => {
    const tree = treeRef.value;
    if (!tree) return;

    const checkedKeys = tree.getCheckedKeys();
    const allKeys = getAllLeafKeys(menuTree.value);

    isSelectAll.value = checkedKeys.length === allKeys.length && allKeys.length > 0;
  };

  /** 防止 handleCascadeCheck 中 setCheckedKeys 触发递归 */
  let isCascading = false;

  /**
   * 收集节点的所有子孙 ID（含自身不重复）
   */
  const collectAllDescendantIds = (treeNode: any): number[] => {
    const ids: number[] = [];
    const stack = [treeNode];
    while (stack.length) {
      const node = stack.pop()!;
      ids.push(node.data.id);
      if (node.childNodes?.length) {
        stack.push(...node.childNodes);
      }
    }
    return ids;
  };

  /**
   * 级联勾选：勾选父节点时自动勾选/取消所有子孙
   * 子节点单独操作不影响父节点
   */
  const handleCascadeCheck = (data: MenuPermissionNode, { checkedKeys }: { checkedKeys: number[] }) => {
    if (isCascading) return;
    const tree = treeRef.value;
    if (!tree) return;

    const treeNode = tree.getNode(data.id);
    if (!treeNode?.childNodes?.length) {
      handleTreeCheck();
      return;
    }

    const isChecked = checkedKeys.includes(data.id);
    const descendantIds = collectAllDescendantIds(treeNode).filter((id) => id !== data.id);

    isCascading = true;
    if (isChecked) {
      tree.setCheckedKeys([...new Set([...checkedKeys, ...descendantIds])]);
    } else {
      const descendantSet = new Set(descendantIds);
      tree.setCheckedKeys(checkedKeys.filter((k: number) => !descendantSet.has(k)));
    }
    isCascading = false;

    handleTreeCheck();
  };
</script>
