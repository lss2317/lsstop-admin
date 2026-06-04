<template>
  <ElDialog
    :model-value="modelValue"
    title="选择图标"
    width="680px"
    top="12vh"
    :append-to-body="true"
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
        <div class="tag-group">
          <ElTag type="primary" effect="plain" size="small">Remix Icon</ElTag>
          <ElTag effect="plain" size="small">共 {{ filteredIcons.length }} 个</ElTag>
        </div>
      </div>

      <ElScrollbar max-height="52vh">
        <div class="icon-grid">
          <ElTooltip v-for="icon in filteredIcons" :key="icon" :content="icon" placement="top">
            <div
              class="icon-item"
              :class="{ active: selectedIcon === icon }"
              @click="selectedIcon = icon"
            >
              <ArtSvgIcon :icon="icon" style="font-size: 22px" />
            </div>
          </ElTooltip>
        </div>
        <div v-if="filteredIcons.length === 0" class="empty-tip"> 未找到匹配的图标 </div>
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

      .tag-group {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(8, 68px);
      gap: 10px;
      justify-content: center;
    }

    .icon-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 68px;
      height: 68px;
      border-radius: 8px;
      cursor: pointer;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      color: #4b5563;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: var(--el-color-primary);
        border-color: #d1d5db;
      }

      &.active {
        background: #f9fafb;
        color: var(--el-color-primary);
        border: 2px solid var(--el-color-primary);
      }
    }

    .empty-tip {
      text-align: center;
      padding: 60px 0;
      color: var(--el-text-color-placeholder);
    }

    .footer-info {
      margin-top: 12px;
      font-size: 12px;
      color: #666;
    }
  }
</style>
