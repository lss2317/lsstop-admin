<template>
  <ElDialog v-model="visible" title="重置密码" width="420px" align-center @close="handleClose">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
      <ElFormItem label="新密码" prop="password">
        <ElInput
          v-model="form.password"
          type="password"
          placeholder="请输入新密码"
          show-password
          clearable
          maxlength="20"
          @input="(val: string) => (form.password = val.replace(/\s/g, ''))"
          @paste="
            (e: ClipboardEvent) => {
              e.preventDefault();
              const text = e.clipboardData?.getData('text') || '';
              form.password += text.replace(/\s/g, '');
            }
          "
        />
      </ElFormItem>
      <ElFormItem label="确认密码" prop="confirmPassword">
        <ElInput
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          show-password
          clearable
          maxlength="20"
          @input="(val: string) => (form.confirmPassword = val.replace(/\s/g, ''))"
          @paste="
            (e: ClipboardEvent) => {
              e.preventDefault();
              const text = e.clipboardData?.getData('text') || '';
              form.confirmPassword += text.replace(/\s/g, '');
            }
          "
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton type="primary" :loading="submitting" @click="handleSubmit">确认重置</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus';
  import type { UserListItem } from '@/apis/user';

  interface Props {
    modelValue: boolean;
    userData?: UserListItem;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    userData: undefined
  });

  const emit = defineEmits<Emits>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const form = reactive({
    password: '',
    confirmPassword: ''
  });

  /** 确认密码校验 */
  const validateConfirmPassword = (
    _rule: unknown,
    value: string,
    callback: (err?: Error) => void
  ) => {
    if (value !== form.password) {
      callback(new Error('两次输入的密码不一致'));
    } else {
      callback();
    }
  };

  const rules = reactive<FormRules>({
    password: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' }
    ]
  });

  /**
   * 监听弹窗打开，重置表单
   */
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) {
        form.password = '';
        form.confirmPassword = '';
        nextTick(() => formRef.value?.clearValidate());
      }
    }
  );

  const handleClose = () => {
    visible.value = false;
    formRef.value?.resetFields();
  };

  const handleSubmit = async () => {
    if (!formRef.value || submitting.value || !props.userData) return;

    try {
      await formRef.value.validate();
      submitting.value = true;

      const { mockFetchResetPassword } = await import('@/apis/user');
      await mockFetchResetPassword(props.userData.userUid, form.password);
      ElMessage.success('密码重置成功');
      handleClose();
    } catch {
      // 校验失败
    } finally {
      submitting.value = false;
    }
  };
</script>
