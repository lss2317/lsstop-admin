<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    @reset="emit('reset')"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
  import type {
    NotificationCategory,
    NotificationLevel,
    NotificationReadStatus
  } from '@/apis/notification/types';

  export interface NotificationSearchForm {
    keyword?: string;
    category?: NotificationCategory;
    eventType?: string;
    level?: NotificationLevel;
    readStatus?: NotificationReadStatus;
    sourceType?: string;
    timeRange?: [string, string];
  }

  interface Props {
    modelValue: NotificationSearchForm;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    'update:modelValue': [value: NotificationSearchForm];
    search: [value: NotificationSearchForm];
    reset: [];
  }>();

  const searchBarRef = ref();
  const formData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  /** 通知筛选项与后端枚举保持一致。 */
  const formItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入标题或内容' }
    },
    {
      label: '通知分类',
      key: 'category',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择分类',
        options: [
          { label: '异常告警', value: 1 },
          { label: '安全告警', value: 2 },
          { label: '系统通知', value: 3 }
        ]
      }
    },
    {
      label: '通知级别',
      key: 'level',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择级别',
        options: [
          { label: '提示', value: 1 },
          { label: '警告', value: 2 },
          { label: '错误', value: 3 },
          { label: '严重', value: 4 }
        ]
      }
    },
    {
      label: '阅读状态',
      key: 'readStatus',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择状态',
        options: [
          { label: '未读', value: 0 },
          { label: '已读', value: 1 }
        ]
      }
    },
    {
      label: '事件类型',
      key: 'eventType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择事件类型',
        options: [
          { label: '系统异常', value: 'SYSTEM_EXCEPTION' },
          { label: '接口响应过慢', value: 'SLOW_API' },
          { label: '登录安全风险', value: 'LOGIN_RISK' },
          { label: '定时任务失败', value: 'TASK_FAILURE' },
          { label: '消息队列异常', value: 'MQ_FAILURE' },
          { label: '依赖服务异常', value: 'DEPENDENCY_FAILURE' },
          { label: '系统通知', value: 'SYSTEM_NOTICE' }
        ]
      }
    },
    {
      label: '来源模块',
      key: 'sourceType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择来源模块',
        options: [
          { label: '接口请求', value: 'HTTP_REQUEST' },
          { label: '认证日志模块', value: 'LOGIN_LOG' },
          { label: '定时任务', value: 'TASK' },
          { label: '消息队列消费', value: 'MQ_CONSUMER' },
          { label: '实时通信', value: 'WEBSOCKET' },
          { label: '系统内部', value: 'SYSTEM' }
        ]
      }
    },
    {
      label: '发生时间',
      key: 'timeRange',
      type: 'datetimerange',
      span: 12,
      props: {
        type: 'datetimerange',
        clearable: true,
        valueFormat: 'YYYY-MM-DDTHH:mm:ss',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        rangeSeparator: '至'
      }
    }
  ]);

  /** 校验搜索表单后提交经过清洗的查询条件。 */
  const handleSearch = async (params: NotificationSearchForm): Promise<void> => {
    await searchBarRef.value.validate();
    emit('search', params);
  };
</script>
