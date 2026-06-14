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

  /** 表单数据双向绑定 */
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  });

  /** 表单校验规则 */
  const rules = {};

  /** 状态选项 */
  const statusOptions = ref([
    { label: '在线', value: '1' },
    { label: '离线', value: '2' },
    { label: '异常', value: '3' },
    { label: '注销', value: '4' }
  ]);

  /** 搜索表单配置项 */
  const formItems = computed(() => [
    {
      label: '用户名',
      key: 'userName',
      type: 'input',
      placeholder: '请输入用户名',
      clearable: true
    },
    {
      label: '手机号',
      key: 'userPhone',
      type: 'input',
      props: { placeholder: '请输入手机号', maxlength: '11' }
    },
    {
      label: '邮箱',
      key: 'userEmail',
      type: 'input',
      props: { placeholder: '请输入邮箱' }
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
    },
    {
      label: '性别',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' }
        ]
      }
    }
  ]);

  /** 处理重置事件 */
  const handleReset = () => {
    emit('reset');
  };

  /** 处理搜索事件 */
  const handleSearch = async (params: UserSearchParams) => {
    await searchBarRef.value.validate();
    emit('search', params);
  };
</script>
