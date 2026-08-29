<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    @reset="handleReset"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
  import type { AnnouncementSearchParams } from '@/apis/announcement/types';

  export type NotificationSearchForm = Omit<AnnouncementSearchParams, 'current' | 'size'>;

  interface Props {
    modelValue: NotificationSearchForm;
  }

  interface Emits {
    (e: 'update:modelValue', value: NotificationSearchForm): void;
    (e: 'search', value: NotificationSearchForm): void;
    (e: 'reset'): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();
  const searchBarRef = ref();

  const formData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const formItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入公告标题' }
    },
    {
      label: '公告类型',
      key: 'type',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择公告类型',
        options: [
          { label: '弹窗公告', value: 1 },
          { label: '首页展示', value: 2 },
          { label: '全部展示', value: 3 }
        ]
      }
    },
    {
      label: '启用状态',
      key: 'isEnabled',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择启用状态',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      }
    }
  ]);

  const handleReset = (): void => {
    emit('reset');
  };

  const handleSearch = async (params: NotificationSearchForm): Promise<void> => {
    await searchBarRef.value.validate();
    emit('search', params);
  };
</script>
