<!-- 登录日志搜索组件 -->
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
    userId?: string;
    actionType?: number;
    state?: number;
    type?: number;
    loginType?: number;
    noUserId?: boolean;
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
   * 选项配置
   */
  const actionTypeOptions = ref([
    { label: '登录', value: 1 },
    { label: '退出', value: 2 },
    { label: '注册', value: 3 }
  ]);

  const stateOptions = ref([
    { label: '成功', value: 0 },
    { label: '失败', value: 1 }
  ]);

  const typeOptions = ref([
    { label: '前台', value: 0 },
    { label: '后台', value: 1 },
    { label: '非法', value: 2 }
  ]);

  const loginTypeOptions = ref([
    { label: '邮箱', value: 1 },
    { label: 'QQ', value: 2 },
    { label: '微博', value: 3 }
  ]);

  const noUserIdOptions = ref([{ label: '仅看未知用户', value: true }]);

  /**
   * 搜索表单配置项
   */
  const formItems = computed(() => [
    {
      label: '用户ID',
      key: 'userId',
      type: 'input',
      placeholder: '请输入用户ID',
      clearable: true
    },
    {
      label: '操作类型',
      key: 'actionType',
      type: 'select',
      props: {
        placeholder: '请选择操作类型',
        options: actionTypeOptions.value,
        clearable: true
      }
    },
    {
      label: '状态',
      key: 'state',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: stateOptions.value,
        clearable: true
      }
    },
    {
      label: '操作来源',
      key: 'type',
      type: 'select',
      props: {
        placeholder: '请选择操作来源',
        options: typeOptions.value,
        clearable: true
      }
    },
    {
      label: '登录方式',
      key: 'loginType',
      type: 'select',
      props: {
        placeholder: '请选择登录方式',
        options: loginTypeOptions.value,
        clearable: true
      }
    },
    {
      label: '未知用户',
      key: 'noUserId',
      type: 'select',
      props: {
        placeholder: '筛选未知用户',
        options: noUserIdOptions.value,
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
   * 验证表单后触发搜索
   */
  const handleSearch = async (params: SearchForm) => {
    await searchBarRef.value.validate();
    emit('search', params);
  };
</script>
