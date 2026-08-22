<template>
  <ElDialog
    v-model="visible"
    title="插入链接"
    width="440px"
    align-center
    destroy-on-close
    @closed="formRef?.clearValidate()"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElFormItem label="链接文字" prop="text">
        <ElInput v-model="form.text" placeholder="请输入链接文字" maxlength="100" clearable />
      </ElFormItem>
      <ElFormItem label="链接地址" prop="url" class="!mb-0">
        <ElInput
          v-model="form.url"
          placeholder="https://example.com"
          maxlength="500"
          clearable
          @keyup.enter="handleConfirm"
        >
          <template #prefix>
            <ArtSvgIcon icon="ri:link" class="link-icon" />
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" @click="handleConfirm">插入链接</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormItemRule, FormRules } from 'element-plus';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  const props = defineProps<{
    initialText: string;
  }>();

  const visible = defineModel<boolean>({ required: true });
  const emit = defineEmits<{
    confirm: [value: { text: string; url: string }];
  }>();

  const formRef = ref<FormInstance>();
  const form = reactive({ text: '', url: '' });

  const validateHttpUrl: NonNullable<FormItemRule['validator']> = (_rule, value, callback) => {
    try {
      const url = new URL(String(value).trim());
      if (['http:', 'https:'].includes(url.protocol) && url.hostname) {
        callback();
        return;
      }
    } catch {
      // 交由下方返回统一提示
    }
    callback(new Error('请输入以 http:// 或 https:// 开头的完整链接'));
  };

  const rules: FormRules = {
    text: [{ required: true, whitespace: true, message: '请输入链接文字', trigger: 'blur' }],
    url: [
      { required: true, whitespace: true, message: '请输入链接地址', trigger: 'blur' },
      { validator: validateHttpUrl, trigger: 'blur' }
    ]
  };

  watch(visible, (isVisible) => {
    if (!isVisible) return;
    form.text = props.initialText || '链接文字';
    form.url = '';
    nextTick(() => formRef.value?.clearValidate());
  });

  const handleConfirm = async () => {
    if (!formRef.value) return;
    try {
      await formRef.value.validate();
      emit('confirm', { text: form.text.trim(), url: form.url.trim() });
      visible.value = false;
    } catch {
      // 表单项会展示具体校验信息
    }
  };
</script>

<style scoped lang="scss">
  .link-icon {
    font-size: 18px;
    color: var(--theme-color);
  }
</style>
