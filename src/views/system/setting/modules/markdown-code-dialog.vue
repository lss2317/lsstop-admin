<template>
  <ElDialog
    v-model="visible"
    title="插入代码块"
    width="620px"
    align-center
    destroy-on-close
    @closed="formRef?.clearValidate()"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElFormItem label="代码语言">
        <ElSelect
          v-model="form.language"
          placeholder="纯文本"
          filterable
          allow-create
          default-first-option
          clearable
          class="w-full"
        >
          <ElOption
            v-for="language in languageOptions"
            :key="language.value"
            :label="language.label"
            :value="language.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="代码内容" prop="code" class="!mb-0">
        <ElInput
          v-model="form.code"
          type="textarea"
          :rows="10"
          resize="vertical"
          placeholder="请输入代码内容"
          maxlength="4000"
          show-word-limit
          class="code-input"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" @click="handleConfirm">插入代码块</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus';

  const props = defineProps<{
    initialCode: string;
  }>();

  const visible = defineModel<boolean>({ required: true });
  const emit = defineEmits<{
    confirm: [value: { language: string; code: string }];
  }>();

  const formRef = ref<FormInstance>();
  const form = reactive({ language: '', code: '' });
  const languageOptions = [
    { label: 'Java', value: 'java' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Vue', value: 'vue' },
    { label: 'SQL', value: 'sql' },
    { label: 'Shell', value: 'shell' },
    { label: 'JSON', value: 'json' },
    { label: 'YAML', value: 'yaml' }
  ];

  const rules: FormRules = {
    code: [{ required: true, whitespace: true, message: '请输入代码内容', trigger: 'blur' }]
  };

  watch(visible, (isVisible) => {
    if (!isVisible) return;
    form.language = '';
    form.code = props.initialCode;
    nextTick(() => formRef.value?.clearValidate());
  });

  const handleConfirm = async () => {
    if (!formRef.value) return;
    try {
      await formRef.value.validate();
      emit('confirm', { language: form.language.trim(), code: form.code });
      visible.value = false;
    } catch {
      // 表单项会展示具体校验信息
    }
  };
</script>

<style scoped lang="scss">
  .code-input :deep(.el-textarea__inner) {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
    line-height: 1.65;
  }
</style>
