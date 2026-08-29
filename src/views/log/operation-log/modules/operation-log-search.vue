<!-- 操作日志搜索组件 -->
<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  interface SearchForm {
    module?: string;
    operationType?: string;
    userId?: string;
  }

  export type { SearchForm };

  interface Props {
    modelValue: SearchForm;
  }

  interface Emits {
    (e: 'update:modelValue', value: SearchForm): void;
    (e: 'search', params: SearchForm): void;
    (e: 'reset'): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const searchBarRef = ref();

  /**
   * 表单数据双向绑定
   */
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  });

  /**
   * 表单校验规则
   */
  const rules = {};

  /**
   * 操作类型选项
   */
  const operationTypeOptions = ref([
    { label: '新增', value: '新增' },
    { label: '编辑', value: '编辑' },
    { label: '删除', value: '删除' },
    { label: '上传', value: '上传' },
    { label: '导出', value: '导出' },
    { label: '权限变更', value: '权限变更' },
    { label: '重置', value: '重置' }
  ]);

  /**
   * 搜索表单配置项
   */
  const formItems = computed(() => [
    {
      label: '系统模块',
      key: 'module',
      type: 'input',
      placeholder: '请输入系统模块',
      clearable: true
    },
    {
      label: '操作类型',
      key: 'operationType',
      type: 'select',
      props: {
        placeholder: '请选择操作类型',
        options: operationTypeOptions.value,
        clearable: true
      }
    },
    {
      label: '用户ID',
      key: 'userId',
      type: 'input',
      placeholder: '请输入用户ID',
      clearable: true
    }
  ]);

  /**
   * 处理重置事件
   */
  const handleReset = () => {
    emit('reset');
  };

  /**
   * 处理搜索事件
   * 验证表单后触发搜索
   */
  const handleSearch = async (params: SearchForm) => {
    await searchBarRef.value.validate();
    emit('search', params);
  };
</script>
