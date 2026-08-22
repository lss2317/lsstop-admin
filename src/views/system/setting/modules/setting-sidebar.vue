<template>
  <aside class="art-card setting-nav">
    <p class="nav-caption">配置分类</p>
    <div ref="navListRef" class="nav-list">
      <span class="nav-active-indicator" :style="indicatorStyle" aria-hidden="true"></span>
      <button
        v-for="item in settingNavItems"
        :key="item.name"
        type="button"
        class="nav-item"
        :class="{ active: model === item.name }"
        :data-tab="item.name"
        @click="model = item.name"
      >
        <span class="nav-icon"><ArtSvgIcon :icon="item.icon" /></span>
        <span class="nav-copy">
          <strong>{{ item.label }}</strong>
          <small>{{ item.description }}</small>
        </span>
        <ArtSvgIcon icon="ri:arrow-right-s-line" class="nav-arrow" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import type { SettingTab } from '../types';

  const model = defineModel<SettingTab>({ required: true });
  const navListRef = ref<HTMLElement>();
  const indicatorStyle = ref<CSSProperties>({ opacity: 0 });

  const settingNavItems = [
    {
      name: 'base',
      label: '博客信息',
      description: '头像与基本信息',
      icon: 'ri:global-line'
    },
    {
      name: 'links',
      label: '社交与连接',
      description: '社交主页与聊天室',
      icon: 'ri:links-line'
    },
    {
      name: 'comment',
      label: '评论与留言',
      description: '审核、通知与敏感词',
      icon: 'ri:chat-settings-line'
    },
    {
      name: 'about',
      label: '关于我',
      description: '个人介绍与预览',
      icon: 'ri:user-heart-line'
    }
  ] as const;

  const updateIndicator = () => {
    const activeItem = navListRef.value?.querySelector<HTMLElement>(`[data-tab="${model.value}"]`);
    if (!activeItem) return;

    indicatorStyle.value = {
      width: `${activeItem.offsetWidth}px`,
      height: `${activeItem.offsetHeight}px`,
      opacity: 1,
      transform: `translate3d(${activeItem.offsetLeft}px, ${activeItem.offsetTop}px, 0)`
    };
  };

  watch(model, () => nextTick(updateIndicator), { immediate: true });

  onMounted(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateIndicator);
  });
</script>

<style scoped lang="scss">
  .setting-nav {
    padding: 12px;
    overflow: hidden;
    background: var(--default-box-color);
  }

  .nav-caption {
    padding: 4px 10px 9px;
    font-size: 11px;
    font-weight: 500;
    color: var(--art-gray-500);
    letter-spacing: 0.08em;
  }

  .nav-list {
    position: relative;
  }

  .nav-active-indicator {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
    background: color-mix(in srgb, var(--theme-color) 10%, transparent);
    border-radius: calc(var(--custom-radius) / 2 + 4px);
    transition:
      width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
      height 0.28s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.16s ease,
      transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: width, height, transform;
  }

  .nav-item {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 60px;
    padding: 8px 9px;
    margin-bottom: 4px;
    color: var(--art-gray-700);
    text-align: left;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: calc(var(--custom-radius) / 2 + 4px);
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: var(--art-hover-color);
    }

    &.active {
      color: var(--theme-color);
      background: transparent;

      .nav-icon {
        color: #fff;
        background: var(--theme-color);
        box-shadow: 0 5px 12px color-mix(in srgb, var(--theme-color) 22%, transparent);
      }

      .nav-copy small {
        color: color-mix(in srgb, var(--theme-color) 68%, var(--art-gray-600));
      }

      .nav-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  .nav-icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    margin-right: 10px;
    font-size: 17px;
    background: var(--art-gray-200);
    border-radius: 9px;
    transition: all 0.2s ease;
  }

  .nav-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;

    strong {
      font-size: 13px;
      font-weight: 500;
    }

    small {
      margin-top: 2px;
      overflow: hidden;
      font-size: 11px;
      color: var(--art-gray-500);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .nav-arrow {
    flex-shrink: 0;
    margin-left: 4px;
    font-size: 16px;
    opacity: 0;
    transition: all 0.2s ease;
    transform: translateX(-4px);
  }

  @media screen and (width <= 760px) {
    .setting-nav {
      position: static;
      padding: 8px;
      margin-bottom: 18px;
      overflow: hidden;
    }

    .nav-list {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .nav-caption,
    .nav-copy small,
    .nav-arrow {
      display: none;
    }

    .nav-item {
      flex: 0 0 auto;
      width: auto;
      min-height: 42px;
      padding: 6px 12px 6px 7px;
      margin: 0;
    }

    .nav-icon {
      width: 30px;
      height: 30px;
      margin-right: 7px;
      font-size: 15px;
    }

    .nav-copy {
      flex: none;

      strong {
        font-size: 12px;
        white-space: nowrap;
      }
    }
  }
</style>
