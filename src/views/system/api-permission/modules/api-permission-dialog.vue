<template>
  <ElDrawer
    :model-value="visible"
    :title="isEdit ? '编辑接口权限' : '新增接口权限'"
    size="520px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <ElFormItem label="上级权限" prop="parentId">
        <ElTreeSelect
          v-model="form.parentId"
          :data="treeData"
          :props="{ label: 'description', value: 'id', children: 'children' }"
          placeholder="请选择上级权限（不选为顶级）"
          clearable
          check-strictly
          filterable
          style="width: 100%"
        />
      </ElFormItem>

      <ElFormItem label="权限描述" prop="description">
        <ElInput
          v-model="form.description"
          placeholder="如 文章列表"
          :maxlength="255"
          show-word-limit
          clearable
        />
      </ElFormItem>

      <ElFormItem label="请求方法" prop="requestMethod">
        <ElSelect v-model="form.requestMethod" placeholder="目录节点可不选" clearable>
          <ElOption label="GET" value="GET" />
          <ElOption label="POST" value="POST" />
          <ElOption label="PUT" value="PUT" />
          <ElOption label="DELETE" value="DELETE" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="接口路径" prop="requestUrl">
        <ElInput
          v-model="form.requestUrl"
          placeholder="如 /admin/article/list，目录节点可不填"
          :maxlength="255"
          clearable
        />
      </ElFormItem>

      <ElFormItem label="排序" prop="sort">
        <ElInputNumber v-model="form.sort" :min="0" :max="9999" controls-position="right" />
      </ElFormItem>

      <ElFormItem label="状态" prop="isEnabled">
        <ElRadioGroup v-model="form.isEnabled">
          <ElRadio :value="1">启用</ElRadio>
          <ElRadio :value="0">禁用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton type="primary" :loading="submitting" @click="handleSubmit">确定</ElButton>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import type { ApiPermissionItem } from '@/apis/api-permission/types';
  import type { FormInstance, FormRules } from 'element-plus';

  interface Props {
    visible: boolean;
    editData: ApiPermissionItem | { _parentRow: ApiPermissionItem } | null;
    treeData: ApiPermissionItem[];
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: Record<string, any>): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const isEdit = computed(() => !!(props.editData && 'id' in props.editData && props.editData.id));

  const defaultForm = () => ({
    parentId: 0,
    description: '',
    requestMethod: null as string | null,
    requestUrl: '',
    sort: 0,
    isEnabled: 1
  });

  const form = reactive(defaultForm());

  const rules: FormRules = {
    description: [{ required: true, message: '请输入权限描述', trigger: 'blur' }],
    requestUrl: [
      {
        validator: (_rule, value, callback) => {
          if (!value && form.requestMethod) {
            callback(new Error('接口节点必须填写接口路径'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ]
  };

  watch(
    () => props.visible,
    (val) => {
      if (val) {
        nextTick(() => {
          if (props.editData && 'id' in props.editData && props.editData.id) {
            Object.assign(form, {
              parentId: props.editData.parentId ?? 0,
              description: props.editData.description ?? '',
              requestMethod: props.editData.requestMethod ?? null,
              requestUrl: props.editData.requestUrl ?? '',
              sort: props.editData.sort ?? 0,
              isEnabled: props.editData.isEnabled ?? 1
            });
          } else if (props.editData && '_parentRow' in props.editData) {
            Object.assign(form, {
              ...defaultForm(),
              parentId: props.editData._parentRow.id
            });
          } else {
            Object.assign(form, defaultForm());
          }
          formRef.value?.clearValidate();
        });
      }
    }
  );

  const handleClose = () => {
    emit('update:visible', false);
  };

  const handleSubmit = async () => {
    if (!formRef.value) return;
    try {
      await formRef.value.validate();
      submitting.value = true;
      emit('submit', { ...form });
    } catch {
      // 校验失败
    } finally {
      submitting.value = false;
    }
  };
</script>