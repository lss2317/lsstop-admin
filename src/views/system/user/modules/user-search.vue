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
  import type { UserSearchParams } from '@/apis/user';

  interface Props {
    modelValue: UserSearchParams;
  }

  interface Emits {
    (e: 'update:modelValue', value: UserSearchParams): void;
    (e: 'search', params: UserSearchParams): void;
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
   * 用户状态选项
   */
  const statusOptions = ref([
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ]);

  /**
   * 搜索表单配置项
   */
  const formItems = computed(() => [
    {
      label: '用户UID',
      key: 'userUid',
      type: 'input',
      placeholder: '请输入用户UID',
      clearable: true
    },
    {
      label: '昵称',
      key: 'nickname',
      type: 'input',
      placeholder: '请输入昵称',
      clearable: true
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: statusOptions.value,
        clearable: true
      }
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
   */
  const handleSearch = async (params: UserSearchParams) => {
    await searchBarRef.value.validate();
    emit('search', params);
  };
</script>
