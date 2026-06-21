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
        :default-expand-all="isExpandAll"
        :props="defaultProps"
        @check="handleTreeCheck"
      >
        <template #default="{ data }">
          <span>{{ data.title }}</span>
        </template>
      </ElTree>
    </ElScrollbar>
    <template #footer>
      <ElButton @click="toggleExpandAll">{{ isExpandAll ? '全部收起' : '全部展开' }}</ElButton>
      <ElButton @click="toggleSelectAll" style="margin-left: 8px">{{ selectAllLabel }}</ElButton>
      <ElButton type="primary" :loading="saving" @click="savePermission" style="margin-left: 8px"
        >保存</ElButton
      >
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus';
  import type { UserListItem } from '@/apis/user';
  import type { MenuPermissionNode } from '@/apis/role/types';
  import { fetchMenuPermissionTree } from '@/apis/role';
  import { fetchUserMenuPermission, fetchSaveUserMenuPermission } from '@/apis/user';

  interface Props {
    modelValue: boolean;
    userData?: UserListItem;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'success'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    userData: undefined
  });

  const emit = defineEmits<Emits>();

  const treeRef = ref();
  const isExpandAll = ref(true);
  const selectState = ref<'none' | 'partial' | 'all'>('none');
  /** 全选按钮文案 */
  const selectAllLabel = computed(() => {
    if (selectState.value === 'all') return '取消全选';
    if (selectState.value === 'partial') return '全选';
    return '全部选择';
  });

  const loading = ref(false);
  const saving = ref(false);

  /** 菜单权限树数据 */
  const menuTree = ref<MenuPermissionNode[]>([]);

  /** 弹窗显示状态双向绑定 */
  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  /** 树形组件配置 */
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
      if (newVal && props.userData) {
        loading.value = true;
        try {
          const [tree, permission] = await Promise.all([
            fetchMenuPermissionTree(),
            fetchUserMenuPermission(props.userData.userId)
          ]);
          menuTree.value = tree;
          await nextTick();
          const leafKeys = getAllLeafKeys(tree);
          treeRef.value?.setCheckedKeys(permission.filter((id) => leafKeys.includes(id)));
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
    selectState.value = 'none';
  };

  /**
   * 保存菜单权限
   */
  const savePermission = async () => {
    if (!props.userData || saving.value) return;

    try {
      saving.value = true;

      const checkedKeys: number[] = treeRef.value?.getCheckedKeys() ?? [];
      const leafKeys = getAllLeafKeys(menuTree.value);
      const menuIds = checkedKeys.filter((id) => leafKeys.includes(id));

      await fetchSaveUserMenuPermission({ userId: props.userData.userId, menuIds });
      ElMessage.success('菜单权限保存成功');
      emit('success');
      handleClose();
    } finally {
      saving.value = false;
    }
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

    if (selectState.value === 'all') {
      tree.setCheckedKeys([]);
    } else {
      tree.setCheckedKeys(getAllLeafKeys(menuTree.value));
    }
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

    if (checkedKeys.length === 0) {
      selectState.value = 'none';
    } else if (allKeys.length > 0 && checkedKeys.length === allKeys.length) {
      selectState.value = 'all';
    } else {
      selectState.value = 'partial';
    }
  };
</script>
