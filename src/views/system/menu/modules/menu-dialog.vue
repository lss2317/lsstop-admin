<template>
  <ElDrawer
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    size="min(820px, calc(100vw - 48px))"
    @closed="handleClosed"
  >
    <ElScrollbar height="calc(100vh - 132px)" wrap-class="pr-2">
      <ArtForm
        ref="formRef"
        v-model="form"
        :items="formItems"
        :rules="rules"
        :span="width > 640 ? 12 : 24"
        :gutter="20"
        label-width="100px"
        :show-reset="false"
        :show-submit="false"
      >
        <template #menuType>
          <ElRadioGroup v-model="form.menuType" :disabled="disableMenuType">
            <ElRadioButton value="directory">目录</ElRadioButton>
            <ElRadioButton value="menu">菜单</ElRadioButton>
            <ElRadioButton value="button">按钮</ElRadioButton>
            <ElRadioButton value="iframe">内嵌</ElRadioButton>
            <ElRadioButton value="link">外链</ElRadioButton>
          </ElRadioGroup>
        </template>

        <template #icon>
          <div class="icon-field">
            <div v-if="form.icon" class="icon-preview">
              <ArtSvgIcon :icon="form.icon" />
            </div>
            <span v-if="form.icon" class="icon-name">{{ form.icon }}</span>
            <span v-else class="icon-placeholder">如：ri:user-line</span>
            <ElButton size="small" @click="showIconPicker = true">选择图标</ElButton>
          </div>
        </template>
      </ArtForm>

      <IconPickerDialog
        v-model="showIconPicker"
        :default-value="form.icon"
        @confirm="handleIconConfirm"
      />
    </ElScrollbar>

    <template #footer>
      <div class="drawer-footer">
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确 定</ElButton>
      </div>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus';
  import { ElIcon, ElTooltip } from 'element-plus';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import IconPickerDialog from './icon-picker-dialog.vue';
  import { QuestionFilled } from '@element-plus/icons-vue';
  import { formatMenuTitle } from '@/utils/router';
  import type { AppRouteRecord } from '@/types/router';
  import type { FormItem } from '@/components/core/forms/art-form/index.vue';
  import ArtForm from '@/components/core/forms/art-form/index.vue';
  import { useWindowSize } from '@vueuse/core';
  import { mockGetMenuTree } from '@/apis/menu/mock';

  const { width } = useWindowSize();

  type MenuType = 'directory' | 'menu' | 'button' | 'iframe' | 'link';

  const createLabelTooltip = (label: string, tooltip: string) => {
    return () =>
      h('span', { class: 'flex items-center' }, [
        h('span', label),
        h(ElTooltip, { content: tooltip, placement: 'top' }, () =>
          h(ElIcon, { class: 'ml-0.5 cursor-help' }, () => h(QuestionFilled))
        )
      ]);
  };

  interface MenuFormData {
    id: number;
    parentId: number;
    name: string;
    path: string;
    label: string;
    component: string;
    icon: string;
    isEnable: boolean;
    sort: number;
    keepAlive: boolean;
    isHide: boolean;
    isHideTab: boolean;
    link: string;
    showBadge: boolean;
    showTextBadge: string;
    fixedTab: boolean;
    activePath: string;
    roles: string[];
    isFullPage: boolean;
    authName: string;
    authLabel: string;
    authSort: number;
  }

  interface Props {
    visible: boolean;
    editData?: AppRouteRecord | any;
    type?: 'menu' | 'button';
    lockType?: boolean;
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: MenuFormData): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'menu',
    lockType: false
  });

  const emit = defineEmits<Emits>();

  const formRef = ref();
  const isEdit = ref(false);
  const showIconPicker = ref(false);

  const handleIconConfirm = (icon: string) => {
    form.icon = icon;
  };

  /** 上级菜单选项 */
  const parentMenuOptions = ref<Array<{ label: string; value: number }>>([]);

  const form = reactive<MenuFormData & { menuType: MenuType }>({
    menuType: 'directory',
    id: 0,
    parentId: 0,
    name: '',
    path: '',
    label: '',
    component: '',
    icon: '',
    isEnable: true,
    sort: 1,
    keepAlive: true,
    isHide: false,
    isHideTab: false,
    link: '',
    showBadge: false,
    showTextBadge: '',
    fixedTab: false,
    activePath: '',
    roles: [],
    isFullPage: false,
    authName: '',
    authLabel: '',
    authSort: 1
  });

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    label: [{ required: true, message: '输入权限标识', trigger: 'blur' }],
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authLabel: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
  });

  /** Switch 公共配置 */
  const switchSpan = computed(() => (width.value < 640 ? 12 : 6));

  const switchItems = (): FormItem[] => [
    { label: '是否启用', key: 'isEnable', type: 'switch', span: switchSpan.value },
    { label: '显示徽章', key: 'showBadge', type: 'switch', span: switchSpan.value },
    { label: '隐藏菜单', key: 'isHide', type: 'switch', span: switchSpan.value },
    { label: '新标签打开', key: 'isHideTab', type: 'switch', span: switchSpan.value }
  ];

  const formItems = computed<FormItem[]>(() => {
    const baseItems: FormItem[] = [{ label: '菜单类型', key: 'menuType', span: 24 }];

    // 上级菜单（按钮类型不显示）
    const parentItem: FormItem = {
      label: '上级菜单',
      key: 'parentId',
      type: 'select',
      props: {
        class: 'w-full',
        clearable: true,
        placeholder: '无（顶级菜单）',
        options: parentMenuOptions.value
      }
    };

    switch (form.menuType) {
      case 'directory':
        return [
          ...baseItems,
          parentItem,
          {
            label: createLabelTooltip('目录名称', '目录的显示名称'),
            key: 'name',
            type: 'input',
            props: { placeholder: '目录名称' }
          },
          {
            label: createLabelTooltip(
              '路由地址',
              '一级菜单：以 / 开头的绝对路径（如 /dashboard）\n二级及以下：相对路径（如 system）'
            ),
            key: 'path',
            type: 'input',
            props: { placeholder: '如：/system' }
          },
          { label: '权限标识', key: 'label', type: 'input', props: { placeholder: '如：System' } },
          { label: '图标', key: 'icon' },
          {
            label: '菜单排序',
            key: 'sort',
            type: 'number',
            props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
          },
          ...switchItems()
        ];

      case 'menu':
        return [
          ...baseItems,
          parentItem,
          { label: '菜单名称', key: 'name', type: 'input', props: { placeholder: '菜单名称' } },
          {
            label: createLabelTooltip('路由地址', '相对路径，如 console、user'),
            key: 'path',
            type: 'input',
            props: { placeholder: '如：console' }
          },
          { label: '权限标识', key: 'label', type: 'input', props: { placeholder: '如：User' } },
          {
            label: createLabelTooltip('组件路径', '填写组件路径（如 system/user）'),
            key: 'component',
            type: 'input',
            props: { placeholder: '如：system/user' }
          },
          { label: '图标', key: 'icon' },
          {
            label: '菜单排序',
            key: 'sort',
            type: 'number',
            props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
          },
          {
            label: createLabelTooltip(
              '激活路径',
              '用于详情页等隐藏菜单，指定高亮显示的父级菜单路径'
            ),
            key: 'activePath',
            type: 'input',
            props: { placeholder: '如：/system/user' }
          },
          { label: '页面缓存', key: 'keepAlive', type: 'switch', span: switchSpan.value },
          { label: '固定标签', key: 'fixedTab', type: 'switch', span: switchSpan.value },
          { label: '全屏页面', key: 'isFullPage', type: 'switch', span: switchSpan.value },
          ...switchItems()
        ];

      case 'button':
        return [
          ...baseItems,
          parentItem,
          {
            label: '权限名称',
            key: 'authName',
            type: 'input',
            props: { placeholder: '如：新增、编辑、删除' }
          },
          {
            label: '权限标识',
            key: 'authLabel',
            type: 'input',
            props: { placeholder: '如：add、edit、delete' }
          },
          {
            label: '权限排序',
            key: 'authSort',
            type: 'number',
            props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
          }
        ];

      case 'iframe':
        return [
          ...baseItems,
          parentItem,
          { label: '内嵌名称', key: 'name', type: 'input', props: { placeholder: '内嵌名称' } },
          {
            label: createLabelTooltip('路由地址', '一级以 / 开头，二级相对路径'),
            key: 'path',
            type: 'input',
            props: { placeholder: '如：/iframe-page' }
          },
          { label: '权限标识', key: 'label', type: 'input', props: { placeholder: '如：Iframe' } },
          {
            label: '内嵌地址',
            key: 'link',
            type: 'input',
            props: { placeholder: '如：https://www.example.com' }
          },
          { label: '图标', key: 'icon' },
          {
            label: '菜单排序',
            key: 'sort',
            type: 'number',
            props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
          },
          ...switchItems()
        ];

      case 'link':
        return [
          ...baseItems,
          parentItem,
          { label: '外链名称', key: 'name', type: 'input', props: { placeholder: '外链名称' } },
          {
            label: '外链地址',
            key: 'link',
            type: 'input',
            props: { placeholder: '如：https://www.example.com' }
          },
          { label: '权限标识', key: 'label', type: 'input', props: { placeholder: '如：Link' } },
          { label: '图标', key: 'icon' },
          {
            label: '菜单排序',
            key: 'sort',
            type: 'number',
            props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
          },
          ...switchItems()
        ];

      default:
        return baseItems;
    }
  });

  const menuTypeLabelMap: Record<MenuType, string> = {
    directory: '目录',
    menu: '菜单',
    button: '按钮',
    iframe: '内嵌',
    link: '外链'
  };

  const dialogTitle = computed(() => {
    const label = menuTypeLabelMap[form.menuType];
    return isEdit.value ? `编辑${label}` : `新建${label}`;
  });

  const disableMenuType = computed(() => {
    if (isEdit.value) return true;
    if (!isEdit.value && form.menuType !== 'button' && props.lockType) return true;
    return false;
  });

  /** 加载上级菜单选项 */
  const loadParentMenuOptions = async () => {
    try {
      const tree = await mockGetMenuTree();
      const flatten = (
        items: AppRouteRecord[],
        result: Array<{ label: string; value: number }> = []
      ) => {
        items.forEach((item) => {
          if (!item.meta?.isAuthButton) {
            result.push({
              label: formatMenuTitle(item.meta?.title || ''),
              value: result.length + 1
            });
            if (item.children?.length) flatten(item.children, result);
          }
        });
        return result;
      };
      parentMenuOptions.value = flatten(tree);
    } catch {
      parentMenuOptions.value = [];
    }
  };

  const resetForm = (): void => {
    formRef.value?.reset();
    form.menuType = 'directory';
  };

  const loadFormData = (): void => {
    if (!props.editData) return;

    isEdit.value = true;

    if (form.menuType === 'button') {
      const row = props.editData;
      form.authName = row.title || row.meta?.title || '';
      form.authLabel = row.authMark || row.meta?.authMark || '';
      form.authSort = row.sort || 1;
    } else {
      const row = props.editData;
      form.id = row.id || 0;
      form.name = formatMenuTitle(row.meta?.title || '');
      form.path = row.path || '';
      form.label = row.name || '';
      form.component = row.component || '';
      form.icon = row.meta?.icon || '';
      form.sort = row.meta?.sort || 1;
      form.keepAlive = row.meta?.keepAlive ?? false;
      form.isHide = row.meta?.isHide ?? false;
      form.isHideTab = row.meta?.isHideTab ?? false;
      form.isEnable = row.meta?.isEnable ?? true;
      form.link = row.meta?.link || '';
      form.showBadge = row.meta?.showBadge ?? false;
      form.showTextBadge = row.meta?.showTextBadge || '';
      form.fixedTab = row.meta?.fixedTab ?? false;
      form.activePath = row.meta?.activePath || '';
      form.roles = row.meta?.roles || [];
      form.isFullPage = row.meta?.isFullPage ?? false;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return;

    try {
      await formRef.value.validate();
      emit('submit', { ...form });
      ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`);
      handleCancel();
    } catch {
      ElMessage.error('表单校验失败，请检查输入');
    }
  };

  const handleCancel = (): void => {
    emit('update:visible', false);
  };

  const handleClosed = (): void => {
    resetForm();
    isEdit.value = false;
  };

  /** 推断菜单类型 */
  const inferMenuType = (row: any): MenuType => {
    if (row?.meta?.isAuthButton) return 'button';
    if (row?.meta?.link && row?.meta?.isIframe) return 'iframe';
    if (row?.meta?.link) return 'link';
    if (row?.children?.length) return 'directory';
    if (row?.path) return 'menu';
    return 'directory';
  };

  watch(
    () => props.visible,
    async (newVal) => {
      if (newVal) {
        await loadParentMenuOptions();
        if (props.editData) {
          form.menuType = inferMenuType(props.editData);
        } else {
          form.menuType = props.type === 'button' ? 'button' : 'directory';
        }
        nextTick(() => {
          if (props.editData) {
            loadFormData();
          }
        });
      }
    }
  );

  watch(
    () => props.type,
    (newType) => {
      if (props.visible && !props.editData) {
        form.menuType = newType === 'button' ? 'button' : 'directory';
      }
    }
  );
</script>

<style scoped>
  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .icon-field {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;

    .icon-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: var(--el-fill-color-lighter);
      font-size: 18px;
      flex-shrink: 0;
    }

    .icon-name {
      font-size: 13px;
      color: var(--el-text-color-regular);
      flex: 1;
    }

    .icon-placeholder {
      font-size: 13px;
      color: var(--el-text-color-placeholder);
      flex: 1;
    }

    .el-button {
      flex-shrink: 0;
    }
  }
</style>
