<template>
  <ElDialog
    :model-value="modelValue"
    title="选择图标"
    width="760px"
    top="8vh"
    :append-to-body="true"
    class="icon-picker-dialog"
    @update:model-value="emit('update:modelValue', $event)"
    @closed="handleClosed"
  >
    <div class="icon-picker">
      <div class="search-bar">
        <ElInput
          v-model="searchText"
          placeholder="搜索图标名称，如 user、menu、setting"
          clearable
          :prefix-icon="Search"
        />
        <div class="label-group">
          <span class="label-badge">Remix Icon</span>
          <span class="label-badge">共 {{ filteredIcons.length }} 个</span>
        </div>
      </div>

      <ElScrollbar height="calc(80vh - 200px)" class="icon-scrollbar">
        <div class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon"
            class="icon-item"
            :class="{ active: selectedIcon === icon }"
            @click="selectedIcon = icon"
          >
            <ArtSvgIcon :icon="icon" style="font-size: 20px" />
          </div>
        </div>
        <div v-if="filteredIcons.length === 0" class="empty-tip">
          <ArtSvgIcon icon="ri:search-eye-line" style="font-size: 40px; color: var(--el-text-color-placeholder)" />
          <p class="empty-title">没有找到匹配的图标</p>
          <p class="empty-desc">可以尝试搜索更短的关键词，或直接在输入框中填写完整图标名。</p>
        </div>
      </ElScrollbar>

      <div class="footer-info"> 共 {{ filteredIcons.length }} 个图标，支持直接搜索图标名称。 </div>
    </div>

    <template #footer>
      <ElButton @click="emit('update:modelValue', false)">取 消</ElButton>
      <ElButton type="primary" @click="handleConfirm">确 定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import { Search } from '@element-plus/icons-vue';

  interface Props {
    modelValue: boolean;
    defaultValue?: string;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'confirm', icon: string): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const searchText = ref('');
  const selectedIcon = ref('');

  import riIconsData from '@iconify-json/ri/icons.json';

  /** 从 @iconify-json/ri 动态读取全部图标名称 */
  const ICONS = Object.keys(riIconsData.icons).map((name) => `ri:${name}`);

  const filteredIcons = computed(() => {
    const q = searchText.value.toLowerCase().trim();
    if (!q) return ICONS;
    return ICONS.filter((icon) => icon.toLowerCase().includes(q));
  });

  const handleConfirm = () => {
    if (selectedIcon.value) {
      emit('confirm', selectedIcon.value);
    }
    emit('update:modelValue', false);
  };

  const handleClosed = () => {
    searchText.value = '';
  };

  watch(
    () => props.modelValue,
    (val) => {
      if (val && props.defaultValue) {
        selectedIcon.value = props.defaultValue;
      }
    }
  );
</script>

<style scoped lang="scss">
  .icon-picker {
    .search-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .el-input {
        flex: 1;
      }

      .label-group {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .label-badge {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        white-space: nowrap;
        padding: 4px 12px;
        border-radius: 20px;
        background: var(--el-fill-color-light, #f5f7fa);
      }
    }

    .icon-scrollbar {
      :deep(.el-scrollbar__bar) {
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover :deep(.el-scrollbar__bar) {
        opacity: 1;
      }
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 10px;
    }

    .icon-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      border-radius: 8px;
      cursor: pointer;
      background: var(--el-fill-color-lighter, #f5f7fa);
      border: 1px solid var(--el-border-color-lighter, #e4e7ed);
      color: #4b5563;
      transition: all 0.2s;

      &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }

      &.active {
        color: var(--el-color-primary);
        border: 2px solid var(--el-color-primary);
      }
    }

    .empty-tip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 300px;
      color: var(--el-text-color-placeholder);

      .empty-title {
        margin-top: 16px;
        font-size: 15px;
        font-weight: 500;
        color: var(--el-text-color-secondary);
      }

      .empty-desc {
        margin-top: 8px;
        font-size: 13px;
        color: var(--el-text-color-placeholder);
      }
    }

    .footer-info {
      margin-top: 12px;
      font-size: 12px;
      color: #666;
    }
  }
</style>

<style lang="scss">
  .el-overlay:has(.icon-picker-dialog) {
    .el-overlay-dialog {
      overflow: hidden;
    }
  }
</style>
