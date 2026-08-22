<template>
  <ElDialog
    v-model="visible"
    :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
    width="500px"
    align-center
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
      <ElFormItem label="角色名称" prop="roleName" required>
        <ElInput
          v-model="form.roleName"
          placeholder="请输入角色名称"
          clearable
          maxlength="20"
          @blur="form.roleName = form.roleName.trim()"
        />
      </ElFormItem>
      <ElFormItem label="角色编码" prop="roleCode" required>
        <ElInput
          v-model="form.roleCode"
          placeholder="请输入角色编码"
          clearable
          maxlength="20"
          @keydown.space.prevent
          @blur="form.roleCode = form.roleCode.replace(/\s/g, '')"
        />
      </ElFormItem>
      <ElFormItem label="描述" prop="description">
        <ElInput
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入角色描述"
          maxlength="100"
          show-word-limit
        />
      </ElFormItem>
      <ElFormItem label="启用" prop="isEnabled">
        <ElSwitch v-model="form.isEnabled" :active-value="1" :inactive-value="0" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="handleClose">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus';
  import type { RoleItem, RoleFormParams } from '@/apis/role/types';

  interface Props {
    modelValue: boolean;
    dialogType: 'add' | 'edit';
    roleData?: RoleItem;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'success'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    dialogType: 'add',
    roleData: undefined
  });

  const emit = defineEmits<Emits>();

  const formRef = ref<FormInstance>();

  /**
   * 弹窗显示状态双向绑定
   */
  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    roleName: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    roleCode: [
      { required: true, message: '请输入角色编码', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
  });

  /**
   * 表单数据
   */
  const form = reactive<RoleFormParams>({
    roleName: '',
    roleCode: '',
    description: '',
    isEnabled: 1
  });

  /**
   * 监听弹窗打开，初始化表单数据
   */
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) initForm();
    }
  );

  /**
   * 监听角色数据变化，更新表单
   */
  watch(
    () => props.roleData,
    (newData) => {
      if (newData && props.modelValue) initForm();
    },
    { deep: true }
  );

  /**
   * 初始化表单数据
   * 根据弹窗类型填充表单或重置表单
   */
  const initForm = () => {
    if (props.dialogType === 'edit' && props.roleData) {
      Object.assign(form, props.roleData);
    } else {
      Object.assign(form, {
        roleName: '',
        roleCode: '',
        description: '',
        isEnabled: 1
      });
    }
  };

  /**
   * 关闭弹窗并重置表单
   */
  const handleClose = () => {
    visible.value = false;
    formRef.value?.resetFields();
  };

  /**
   * 提交表单
   * 验证通过后调用接口保存数据
   */
  const handleSubmit = async () => {
    if (!formRef.value) return;

    try {
      await formRef.value.validate();
      const { fetchAddRole, fetchUpdateRole } = await import('@/apis/role');
      if (props.dialogType === 'edit') {
        await fetchUpdateRole(form);
        ElMessage.success('修改成功');
      } else {
        await fetchAddRole(form);
        ElMessage.success('新增成功');
      }
      emit('success');
      handleClose();
    } catch {
      // 表单校验失败或接口报错（接口报错由全局拦截器展示）
    }
  };
</script>

<style scoped lang="scss">
  .dialog-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset;

    &:hover {
      box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }
  }
</style>
