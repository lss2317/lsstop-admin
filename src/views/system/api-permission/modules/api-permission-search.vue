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
    keyword?: string;
    requestMethod?: string;
    isEnabled?: number;
  }

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

  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  });

  const rules = {};

  const formItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入描述、接口路径' }
    },
    {
      label: '请求方法',
      key: 'requestMethod',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择请求方法',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' }
        ]
      }
    },
    {
      label: '状态',
      key: 'isEnabled',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      }
    }
  ]);

  const handleReset = () => {
    emit('reset');
  };

  const handleSearch = async (params: SearchForm) => {
    await searchBarRef.value.validate();
    emit('search', params);
  };
</script>
