<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="560px"
    @closed="resetDialog"
  >
    <ArtForm
      ref="formRef"
      v-model="form"
      :items="formItems"
      :rules="rules"
      :span="formSpan"
      :gutter="16"
      label-width="96px"
      class="generated-form"
      :show-reset="false"
      :show-submit="false"
    />
    <template #footer>
      <div class="generated-form-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">确认</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus';
  import ArtForm from '@/components/core/forms/art-form/index.vue';
  import type { FormItem } from '@/components/core/forms/art-form/index.vue';

  defineOptions({ name: 'OperationLogDialog' });

  type DialogMode = 'add' | 'edit';

  /** 操作日志记录 */
  interface OperationLogRecord {
    id: number;
    module: string;
    operationType: string;
    username: string;
    ip: string;
    status: string;
    durationMs: number;
  }

  /** 表单提交数据 */
  interface OperationLogFormData {
    module?: string;
    operationType?: string;
    username?: string;
    ip?: string;
    status?: string;
    durationMs?: number;
  }

  /** 系统模块选项 */
  const MODULE_OPTIONS = [
    { label: '客户管理', value: 'CUSTOMER' },
    { label: '项目管理', value: 'PROJECT' },
    { label: '任务管理', value: 'TASK' },
    { label: '系统管理', value: 'SYSTEM' }
  ] as const;

  /** 操作类型选项 */
  const OPERATION_TYPE_OPTIONS = [
    { label: '新增', value: 'CREATE' },
    { label: '修改', value: 'UPDATE' },
    { label: '删除', value: 'DELETE' },
    { label: '查询', value: 'QUERY' },
    { label: '导入', value: 'IMPORT' },
    { label: '导出', value: 'EXPORT' }
  ] as const;

  /** 状态选项 */
  const STATUS_OPTIONS = [
    { label: '成功', value: 'SUCCESS' },
    { label: '失败', value: 'FAIL' }
  ] as const;

  interface Props {
    visible: boolean;
    type: DialogMode;
    row?: OperationLogRecord | null;
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', mode: DialogMode): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'add',
    row: null
  });
  const emit = defineEmits<Emits>();

  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  });
  const dialogMode = computed(() => props.type);
  const dialogTitle = computed(() =>
    dialogMode.value === 'add' ? '新增操作日志' : '编辑操作日志'
  );
  const formRef = ref<InstanceType<typeof ArtForm>>();
  const submitLoading = ref(false);

  const formSpan = 24;

  const formItems = computed<FormItem[]>(() => [
    {
      key: 'module',
      label: '系统模块',
      type: 'select',
      options: MODULE_OPTIONS as unknown as { label: string; value: string }[],
      placeholder: '请选择系统模块'
    },
    {
      key: 'operationType',
      label: '操作类型',
      type: 'select',
      options: OPERATION_TYPE_OPTIONS as unknown as { label: string; value: string }[],
      placeholder: '请选择操作类型'
    },
    {
      key: 'username',
      label: '操作人员',
      type: 'input',
      placeholder: '请输入操作人员'
    },
    {
      key: 'ip',
      label: '操作地址',
      type: 'input',
      placeholder: '请输入操作地址'
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: STATUS_OPTIONS as unknown as { label: string; value: string }[],
      placeholder: '请选择状态'
    },
    {
      key: 'durationMs',
      label: '消耗时间(ms)',
      type: 'number',
      placeholder: '请输入消耗时间'
    }
  ]);

  const rules = reactive<FormRules>({
    module: [{ required: true, message: '请选择系统模块', trigger: 'change' }],
    operationType: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
    username: [
      { required: true, message: '请输入操作人员', trigger: 'blur' },
      { min: 2, max: 50, message: '操作人员长度为 2-50 个字符', trigger: 'blur' }
    ]
  });

  const createDefaultForm = (): OperationLogFormData => ({
    module: undefined,
    operationType: undefined,
    username: undefined,
    ip: undefined,
    status: undefined,
    durationMs: undefined
  });

  const form = reactive<OperationLogFormData>(createDefaultForm());
  const formFieldNames: Array<keyof OperationLogFormData> = [
    'module',
    'operationType',
    'username',
    'ip',
    'status',
    'durationMs'
  ];
  const optionalFieldNames = new Set<keyof OperationLogFormData>(['ip', 'durationMs']);

  const resetDialog = () => {
    Object.assign(form, createDefaultForm());
    submitLoading.value = false;
    nextTick(() => formRef.value?.clearValidate());
  };

  const initDialog = () => {
    resetDialog();
    if (dialogMode.value !== 'edit' || !props.row) return;

    const rowRecord = props.row as unknown as Record<keyof OperationLogFormData, unknown>;
    formFieldNames.forEach((key) => {
      const value = rowRecord[key];
      if (value !== undefined && value !== null) {
        (form as Record<keyof OperationLogFormData, unknown>)[key] = value;
      }
    });
  };

  const buildPayload = (): OperationLogFormData =>
    Object.fromEntries(
      formFieldNames.flatMap((key) => {
        const value = form[key];
        if (value === undefined || value === null) return [];
        if (optionalFieldNames.has(key) && value === '') return [];
        return [[key, value]];
      })
    ) as unknown as OperationLogFormData;

  const handleSubmit = async () => {
    if (!formRef.value) return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid) return;

    submitLoading.value = true;
    // TODO: 对接真实接口
    await new Promise((resolve) => setTimeout(resolve, 300));
    submitLoading.value = false;
    emit('submit', dialogMode.value);
  };

  watch(
    () => [props.visible, props.type, props.row],
    ([visible]) => {
      if (visible) {
        initDialog();
      }
    },
    { immediate: true }
  );
</script>

<style scoped>
  .generated-form {
    padding: 2px 2px 0;
  }

  .generated-form :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  .generated-form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
</style>
