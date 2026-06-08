<template>
  <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
    <ElFormItem label="图标">
      <div class="flex w-full items-center">
        <div
          class="flex h-[var(--el-component-custom-height)] min-w-0 flex-1 items-stretch overflow-hidden rounded-custom-sm border border-[var(--el-border-color-light)] bg-transparent transition-colors duration-200 hover:border-[var(--el-border-color)] focus-within:border-[var(--el-border-color)]"
        >
          <div
            class="flex h-full w-10 shrink-0 items-center justify-center border-r border-[var(--el-border-color-light)] bg-box text-g-700"
          >
            <ArtSvgIcon v-if="modelValue" :icon="modelValue" class="text-lg text-g-700" />
            <ArtSvgIcon v-else icon="ri:apps-line" class="text-lg text-g-500" />
          </div>
          <ElInput
            :model-value="modelValue"
            placeholder="如：ri:user-line"
            class="icon-input-inner min-w-0 flex-1 self-stretch"
            :readonly="true"
          />
          <button
            type="button"
            class="c-p flex h-full shrink-0 items-center border-l border-[var(--el-border-color-light)] bg-box px-3 text-[13px] text-theme tad-200 hover:bg-[var(--art-gray-200)] dark:hover:bg-[var(--art-gray-300)]"
            @click="$emit('select')"
          >
            选择图标
          </button>
        </div>
      </div>
    </ElFormItem>
  </ElCol>
</template>

<script setup lang="ts">
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  defineProps<{
    modelValue: string;
  }>();

  defineEmits<{
    select: [];
  }>();
</script>
