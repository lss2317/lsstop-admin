<!-- 通知组件 -->
<template>
  <div
    v-show="visible"
    class="art-notification-panel art-card-sm !shadow-xl"
    :style="{
      transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
      opacity: show ? 1 : 0
    }"
    @click.stop
  >
    <div class="flex-cb h-16 px-5 border-b-d">
      <span class="text-base font-medium text-g-800">{{ $t('notice.title') }}</span>
      <button
        type="button"
        class="text-xs text-g-700 px-1.5 py-1 c-p select-none rounded hover:bg-g-200"
        @click="handleMarkAllRead"
      >
        {{ $t('notice.btnRead') }}
      </button>
    </div>

    <div v-loading="loading" class="w-full h-[calc(100%-64px)]">
      <div class="h-[calc(100%-64px)] overflow-y-auto scrollbar-thin">
        <ul v-if="noticeList.length">
          <li
            v-for="item in noticeList"
            :key="item.notificationNo"
            class="box-border flex items-start px-5 py-4 c-p border-b-d last:border-b-0 hover:bg-g-200/60"
            @click="handleNotificationClick(item)"
          >
            <div
              class="size-10 shrink-0 text-center rounded-lg flex-cc"
              :class="getNoticeStyle(item.level).iconClass"
            >
              <ArtSvgIcon class="text-xl !bg-transparent" :icon="getNoticeStyle(item.level).icon" />
            </div>
            <div class="min-w-0 ml-3.5">
              <h4 class="text-sm font-normal leading-5.5 text-g-900 line-clamp-2">
                {{ item.title }}
              </h4>
              <p v-if="item.content" class="mt-1 text-xs leading-5 text-g-500 line-clamp-2">
                {{ item.content }}
              </p>
              <div class="flex items-center gap-2 mt-1 text-xs text-g-500">
                <span>{{ formatTimeAgo(item.lastOccurredTime) }}</span>
                <span v-if="item.occurrenceCount > 1" class="text-danger">
                  ×{{ item.occurrenceCount }}
                </span>
              </div>
            </div>
          </li>
        </ul>

        <div
          v-else
          class="h-full flex flex-col items-center justify-center text-g-500 text-center !bg-transparent"
        >
          <ArtSvgIcon icon="system-uicons:inbox" class="text-5xl" />
          <p class="mt-3.5 text-xs !bg-transparent">{{ $t('notice.empty') }}</p>
        </div>
      </div>

      <div class="box-border flex items-center h-16 px-3.5">
        <ElButton class="w-full" @click="handleViewAll" v-ripple>
          {{ $t('notice.viewAll') }}
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  import type { NotificationLevel, NotificationListItem } from '@/apis/notification/types';
  import {
    fetchMarkAllNotificationsRead,
    fetchMarkNotificationRead,
    fetchUnreadNotificationList
  } from '@/apis/notification';
  import { formatTimeAgo } from '@/utils/format';
  import { mittBus } from '@/utils/sys';

  defineOptions({ name: 'ArtNotification' });

  interface NoticeStyle {
    /** 图标 */
    icon: string;
    /** 图标样式 */
    iconClass: string;
  }

  const props = defineProps<{
    value: boolean;
  }>();

  const emit = defineEmits<{
    'update:value': [value: boolean];
    'unread-count-change': [value: number];
  }>();

  const router = useRouter();
  const show = ref(false);
  const visible = ref(false);
  const loading = ref(false);
  const unreadCount = ref(0);
  const noticeList = ref<NotificationListItem[]>([]);
  const POLL_INTERVAL = 60 * 1000;
  let pollTimer: ReturnType<typeof setInterval> | undefined;
  let requestVersion = 0;

  const noticeStyleMap: Record<NotificationLevel, NoticeStyle> = {
    1: {
      icon: 'ri:information-line',
      iconClass: 'bg-info/12 text-info'
    },
    2: {
      icon: 'ri:alarm-warning-line',
      iconClass: 'bg-warning/12 text-warning'
    },
    3: {
      icon: 'ri:error-warning-line',
      iconClass: 'bg-danger/12 text-danger'
    },
    4: {
      icon: 'ri:fire-line',
      iconClass: 'bg-danger/12 text-danger'
    }
  };

  const getNoticeStyle = (level: NotificationLevel): NoticeStyle =>
    noticeStyleMap[level] || noticeStyleMap[1];

  /**
   * 获取最近未读通知，分页总数同时用于顶部数字角标。
   * 后台轮询失败时保留上一次结果，避免短暂网络波动导致角标闪烁归零。
   */
  const loadUnreadNotifications = async (): Promise<void> => {
    const currentVersion = ++requestVersion;
    loading.value = true;
    try {
      const result = await fetchUnreadNotificationList();
      if (currentVersion !== requestVersion) return;
      noticeList.value = result.records;
      unreadCount.value = result.total;
      emit('unread-count-change', result.total);
    } catch {
      // 静默轮询失败时保留现有通知，接口层已关闭全局错误提示。
    } finally {
      if (currentVersion === requestVersion) loading.value = false;
    }
  };

  const showNotice = (open: boolean) => {
    if (open) {
      visible.value = true;
      setTimeout(() => {
        show.value = true;
      }, 5);
      return;
    }

    show.value = false;
    setTimeout(() => {
      visible.value = false;
    }, 350);
  };

  /** 将当前全部未读通知标记为已读并立即清空弹层。 */
  const handleMarkAllRead = async (): Promise<void> => {
    if (unreadCount.value === 0) return;
    await fetchMarkAllNotificationsRead();
    // 使标记操作之前发出的查询响应失效，避免旧未读列表覆盖当前状态。
    requestVersion++;
    loading.value = false;
    noticeList.value = [];
    unreadCount.value = 0;
    emit('unread-count-change', 0);
    ElMessage.success('已全部标为已读');
  };

  /**
   * 点击一条未读通知后标记已读，并跳转通知列表自动打开对应详情。
   */
  const handleNotificationClick = async (item: NotificationListItem): Promise<void> => {
    await fetchMarkNotificationRead(item.notificationNo);
    requestVersion++;
    loading.value = false;
    noticeList.value = noticeList.value.filter(
      (notification) => notification.notificationNo !== item.notificationNo
    );
    unreadCount.value = Math.max(0, unreadCount.value - 1);
    emit('unread-count-change', unreadCount.value);
    emit('update:value', false);
    await router.push({
      path: '/notification/list',
      query: { notificationNo: item.notificationNo }
    });
  };

  /** 跳转通知列表页面并关闭弹层。 */
  const handleViewAll = (): void => {
    router.push('/notification/list');
    emit('update:value', false);
  };

  /** 标签页重新可见时立即刷新，避免后台挂起期间的角标数据过期。 */
  const handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') loadUnreadNotifications();
  };

  watch(
    () => props.value,
    (newValue) => {
      showNotice(newValue);
      if (newValue) loadUnreadNotifications();
    }
  );

  onMounted(() => {
    loadUnreadNotifications();
    pollTimer = setInterval(() => {
      if (document.visibilityState === 'visible') loadUnreadNotifications();
    }, POLL_INTERVAL);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    mittBus.on('notificationReadChanged', loadUnreadNotifications);
  });

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    mittBus.off('notificationReadChanged', loadUnreadNotifications);
  });
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .art-notification-panel {
    @apply absolute
    top-14.5
    right-5
    w-90
    h-125
    overflow-hidden
    transition-all
    duration-300
    origin-top
    will-change-[top,left]
    max-[640px]:top-[65px]
    max-[640px]:right-0
    max-[640px]:w-full
    max-[640px]:h-[80vh];
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 5px !important;
  }

  .dark .scrollbar-thin::-webkit-scrollbar-track {
    background-color: var(--default-box-color);
  }

  .dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #222 !important;
  }
</style>
