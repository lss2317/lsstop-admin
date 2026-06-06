<template>
  <ElDrawer
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    size="min(820px, calc(100vw - 48px))"
    class="menu-drawer"
    @closed="handleClosed"
  >
    <section>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px">
        <!-- 表单字段：两列布局 -->
        <ElRow :gutter="20">
          <!-- 菜单类型（全宽） -->
          <ElCol :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <ElFormItem class="menu-type-item">
              <template #label>类型</template>
              <div class="flex w-full flex-col items-start gap-2">
                <ElRadioGroup
                  v-model="form.menuType"
                  :disabled="disableMenuType"
                  class="menu-type-group"
                >
                  <ElRadioButton value="directory" :disabled="disableDirectoryOption"
                    >目录</ElRadioButton
                  >
                  <ElRadioButton value="menu">菜单</ElRadioButton>
                  <ElRadioButton value="button" :disabled="disableButtonOption">按钮</ElRadioButton>
                  <ElRadioButton value="iframe">内嵌</ElRadioButton>
                  <ElRadioButton value="link">外链</ElRadioButton>
                </ElRadioGroup>
                <p class="w-full text-xs leading-5 text-[var(--el-text-color-secondary)]">
                  新建时可直接选择类型。按钮权限仍需挂在具体菜单下。
                </p>
              </div>
            </ElFormItem>
          </ElCol>

          <template v-if="form.menuType === 'directory'">
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="上级菜单" prop="parentId">
                <ElSelect
                  v-model="form.parentId"
                  class="w-full"
                  clearable
                  placeholder="无（顶级菜单）"
                >
                  <ElOption
                    v-for="opt in parentMenuOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="name" required>
                <template #label>
                  <span>{{ '目录名称' }}</span>
                </template>
                <ElInput v-model="form.name" placeholder="目录名称" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="path" required>
                <template #label>
                  <span class="flex items-center">
                    <span>路由地址</span>
                    <ElTooltip
                      content="一级菜单：以 / 开头的绝对路径（如 /dashboard） 二级及以下：相对路径（如 console、user）"
                      placement="top"
                    >
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInput v-model="form.path" placeholder="如：/system" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识">
                <ElInput v-model="form.label" placeholder="如：System" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="图标">
                <div class="flex w-full items-center">
                  <div
                    class="flex h-[var(--el-component-custom-height)] min-w-0 flex-1 items-stretch overflow-hidden rounded-custom-sm border border-[var(--el-border-color-light)] bg-transparent transition-colors duration-200 hover:border-[var(--el-border-color)] focus-within:border-[var(--el-border-color)]"
                  >
                    <div
                      class="flex h-full w-10 shrink-0 items-center justify-center border-r border-[var(--el-border-color-light)] bg-box text-g-700"
                    >
                      <ArtSvgIcon v-if="form.icon" :icon="form.icon" class="text-lg text-g-700" />
                      <ArtSvgIcon v-else icon="ri:apps-line" class="text-lg text-g-500" />
                    </div>
                    <ElInput
                      v-model="form.icon"
                      placeholder="如：ri:user-line"
                      class="icon-input-inner min-w-0 flex-1 self-stretch"
                      :readonly="true"
                    />
                    <button
                      type="button"
                      class="c-p flex h-full shrink-0 items-center border-l border-[var(--el-border-color-light)] bg-box px-3 text-[13px] text-theme tad-200 hover:bg-[var(--art-gray-200)] dark:hover:bg-[var(--art-gray-300)]"
                      @click="showIconPicker = true"
                    >
                      选择图标
                    </button>
                  </div>
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem>
                <template #label>
                  <span class="flex items-center">
                    <span>菜单排序</span>
                    <ElTooltip content="按升序排列，数字越小越靠前" placement="top">
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInputNumber
                  v-model="form.sort"
                  :min="1"
                  controls-position="right"
                  style="width: 100%"
                />
              </ElFormItem>
            </ElCol>
          </template>

          <template v-else-if="form.menuType === 'menu'">
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="上级菜单" prop="parentId">
                <ElSelect
                  v-model="form.parentId"
                  class="w-full"
                  clearable
                  placeholder="无（顶级菜单）"
                >
                  <ElOption
                    v-for="opt in parentMenuOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="菜单名称" prop="name" required>
                <ElInput v-model="form.name" placeholder="菜单名称" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="path" required>
                <template #label>
                  <span class="flex items-center">
                    <span>路由地址</span>
                    <ElTooltip
                      content="一级菜单：以 / 开头的绝对路径（如 /dashboard） 二级及以下：相对路径（如 console、user）"
                      placement="top"
                    >
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInput v-model="form.path" placeholder="如：console" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="component" required>
                <template #label>
                  <span class="flex items-center">
                    <span>组件路径</span>
                    <ElTooltip
                      content="一级父级菜单：填写 /index/index 具体页面：填写组件路径（如 /system/user） 目录菜单：留空"
                      placement="top"
                    >
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInput v-model="form.component" placeholder="如：system/user" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识">
                <ElInput v-model="form.label" placeholder="如：User" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="图标">
                <div class="flex w-full items-center">
                  <div
                    class="flex h-[var(--el-component-custom-height)] min-w-0 flex-1 items-stretch overflow-hidden rounded-custom-sm border border-[var(--el-border-color-light)] bg-transparent transition-colors duration-200 hover:border-[var(--el-border-color)] focus-within:border-[var(--el-border-color)]"
                  >
                    <div
                      class="flex h-full w-10 shrink-0 items-center justify-center border-r border-[var(--el-border-color-light)] bg-box text-g-700"
                    >
                      <ArtSvgIcon v-if="form.icon" :icon="form.icon" class="text-lg text-g-700" />
                      <ArtSvgIcon v-else icon="ri:apps-line" class="text-lg text-g-500" />
                    </div>
                    <ElInput
                      v-model="form.icon"
                      placeholder="如：ri:user-line"
                      class="icon-input-inner min-w-0 flex-1 self-stretch"
                      :readonly="true"
                    />
                    <button
                      type="button"
                      class="c-p flex h-full shrink-0 items-center border-l border-[var(--el-border-color-light)] bg-box px-3 text-[13px] text-theme tad-200 hover:bg-[var(--art-gray-200)] dark:hover:bg-[var(--art-gray-300)]"
                      @click="showIconPicker = true"
                    >
                      选择图标
                    </button>
                  </div>
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem>
                <template #label>
                  <span class="flex items-center">
                    <span>菜单排序</span>
                    <ElTooltip content="按升序排列，数字越小越靠前" placement="top">
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInputNumber
                  v-model="form.sort"
                  :min="1"
                  controls-position="right"
                  style="width: 100%"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem>
                <template #label>
                  <span class="flex items-center">
                    <span>激活路径</span>
                    <ElTooltip
                      content="用于详情页等隐藏菜单，指定高亮显示的父级菜单路径"
                      placement="top"
                    >
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInput v-model="form.activePath" placeholder="如：/system/user" />
              </ElFormItem>
            </ElCol>
          </template>

          <template v-else-if="form.menuType === 'button'">
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限名称" prop="authName" required>
                <ElInput v-model="form.authName" placeholder="如：新增、编辑、删除" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识" prop="authLabel" required>
                <ElInput v-model="form.authLabel" placeholder="如：add、edit、delete" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="authSort">
                <template #label>
                  <span class="flex items-center">
                    <span>权限排序</span>
                    <ElTooltip content="按升序排列，数字越小排序越靠前" placement="top">
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInputNumber
                  v-model="form.authSort"
                  :min="1"
                  controls-position="right"
                  style="width: 100%"
                />
              </ElFormItem>
            </ElCol>
          </template>

          <template v-else-if="form.menuType === 'iframe'">
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="上级菜单" prop="parentId">
                <ElSelect
                  v-model="form.parentId"
                  class="w-full"
                  clearable
                  placeholder="无（顶级菜单）"
                >
                  <ElOption
                    v-for="opt in parentMenuOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="内嵌名称" prop="name">
                <ElInput v-model="form.name" placeholder="内嵌名称" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="path" required>
                <template #label>
                  <span class="flex items-center">
                    <span>路由地址</span>
                    <ElTooltip
                      content="一级菜单：以 / 开头的绝对路径（如 /dashboard） 二级及以下：相对路径（如 console、user） 内嵌菜单必须以 /outside/iframe/ 开头"
                      placement="top"
                    >
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInput v-model="form.path" placeholder="如：/iframe-page" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识">
                <ElInput v-model="form.label" placeholder="如：Iframe" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="内嵌地址">
                <ElInput v-model="form.link" placeholder="如：https://www.example.com" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="图标">
                <div class="flex w-full items-center">
                  <div
                    class="flex h-[var(--el-component-custom-height)] min-w-0 flex-1 items-stretch overflow-hidden rounded-custom-sm border border-[var(--el-border-color-light)] bg-transparent transition-colors duration-200 hover:border-[var(--el-border-color)] focus-within:border-[var(--el-border-color)]"
                  >
                    <div
                      class="flex h-full w-10 shrink-0 items-center justify-center border-r border-[var(--el-border-color-light)] bg-box text-g-700"
                    >
                      <ArtSvgIcon v-if="form.icon" :icon="form.icon" class="text-lg text-g-700" />
                      <ArtSvgIcon v-else icon="ri:apps-line" class="text-lg text-g-500" />
                    </div>
                    <ElInput
                      v-model="form.icon"
                      placeholder="如：ri:user-line"
                      class="icon-input-inner min-w-0 flex-1 self-stretch"
                      :readonly="true"
                    />
                    <button
                      type="button"
                      class="c-p flex h-full shrink-0 items-center border-l border-[var(--el-border-color-light)] bg-box px-3 text-[13px] text-theme tad-200 hover:bg-[var(--art-gray-200)] dark:hover:bg-[var(--art-gray-300)]"
                      @click="showIconPicker = true"
                    >
                      选择图标
                    </button>
                  </div>
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem>
                <template #label>
                  <span class="flex items-center">
                    <span>菜单排序</span>
                    <ElTooltip content="按升序排列，数字越小越靠前" placement="top">
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInputNumber
                  v-model="form.sort"
                  :min="1"
                  controls-position="right"
                  style="width: 100%"
                />
              </ElFormItem>
            </ElCol>
          </template>

          <template v-else-if="form.menuType === 'link'">
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="上级菜单" prop="parentId">
                <ElSelect
                  v-model="form.parentId"
                  class="w-full"
                  clearable
                  placeholder="无（顶级菜单）"
                >
                  <ElOption
                    v-for="opt in parentMenuOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="外链名称" prop="name">
                <ElInput v-model="form.name" placeholder="外链名称" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="外链地址">
                <ElInput v-model="form.link" placeholder="如：https://www.example.com" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识">
                <ElInput v-model="form.label" placeholder="如：Link" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="图标">
                <div class="flex w-full items-center">
                  <div
                    class="flex h-[var(--el-component-custom-height)] min-w-0 flex-1 items-stretch overflow-hidden rounded-custom-sm border border-[var(--el-border-color-light)] bg-transparent transition-colors duration-200 hover:border-[var(--el-border-color)] focus-within:border-[var(--el-border-color)]"
                  >
                    <div
                      class="flex h-full w-10 shrink-0 items-center justify-center border-r border-[var(--el-border-color-light)] bg-box text-g-700"
                    >
                      <ArtSvgIcon v-if="form.icon" :icon="form.icon" class="text-lg text-g-700" />
                      <ArtSvgIcon v-else icon="ri:apps-line" class="text-lg text-g-500" />
                    </div>
                    <ElInput
                      v-model="form.icon"
                      placeholder="如：ri:user-line"
                      class="icon-input-inner min-w-0 flex-1 self-stretch"
                      :readonly="true"
                    />
                    <button
                      type="button"
                      class="c-p flex h-full shrink-0 items-center border-l border-[var(--el-border-color-light)] bg-box px-3 text-[13px] text-theme tad-200 hover:bg-[var(--art-gray-200)] dark:hover:bg-[var(--art-gray-300)]"
                      @click="showIconPicker = true"
                    >
                      选择图标
                    </button>
                  </div>
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem>
                <template #label>
                  <span class="flex items-center">
                    <span>菜单排序</span>
                    <ElTooltip content="按升序排列，数字越小越靠前" placement="top">
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInputNumber
                  v-model="form.sort"
                  :min="1"
                  controls-position="right"
                  style="width: 100%"
                />
              </ElFormItem>
            </ElCol>
          </template>
        </ElRow>
      </ElForm>

      <!-- 其他设置 -->
      <section>
        <ElDivider>其他设置</ElDivider>
        <div class="grid grid-cols-1 gap-x-7 gap-y-3.5 sm:grid-cols-2 px-5">
          <div class="flex min-h-8 items-center">
            <span class="mr-3 w-[100px] shrink-0 text-sm text-[var(--el-text-color-regular)]"
              >是否启用</span
            >
            <ElSwitch v-model="form.isEnable" />
          </div>
          <template v-if="form.menuType !== 'button'">
            <div class="flex min-h-8 items-center">
              <span class="mr-3 w-[100px] shrink-0 text-sm text-[var(--el-text-color-regular)]"
                >隐藏菜单</span
              >
              <ElSwitch v-model="form.isHide" />
            </div>
            <div class="flex min-h-8 items-center">
              <span class="mr-3 w-[100px] shrink-0 text-sm text-[var(--el-text-color-regular)]"
                >新标签打开</span
              >
              <ElSwitch v-model="form.isHideTab" />
            </div>
          </template>
          <template v-if="form.menuType === 'menu'">
            <div class="flex min-h-8 items-center">
              <span class="mr-3 w-[100px] shrink-0 text-sm text-[var(--el-text-color-regular)]"
                >页面缓存</span
              >
              <ElSwitch v-model="form.keepAlive" />
            </div>
            <div class="flex min-h-8 items-center">
              <span class="mr-3 w-[100px] shrink-0 text-sm text-[var(--el-text-color-regular)]"
                >固定标签</span
              >
              <ElSwitch v-model="form.fixedTab" />
            </div>
            <div class="flex min-h-8 items-center">
              <span class="mr-3 w-[100px] shrink-0 text-sm text-[var(--el-text-color-regular)]"
                >全屏页面</span
              >
              <ElSwitch v-model="form.isFullPage" />
            </div>
          </template>
        </div>
      </section>

      <IconPickerDialog
        v-model="showIconPicker"
        :default-value="form.icon"
        @confirm="handleIconConfirm"
      />
    </section>

    <template #footer>
      <span class="drawer-footer">
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确 定</ElButton>
      </span>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus';
  import { ElIcon, ElTooltip } from 'element-plus';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import IconPickerDialog from './icon-picker-dialog.vue';
  import { QuestionFilled } from '@element-plus/icons-vue';
  import { formatMenuTitle } from '@/utils/router';
  import type { AppRouteRecord } from '@/types/router';
  import { mockGetMenuTree } from '@/apis/menu/mock';

  type MenuType = 'directory' | 'menu' | 'button' | 'iframe' | 'link';

  const createLabelTooltip = (label: string, tooltip: string) => {
    return () =>
      h('span', { class: 'flex items-center' }, [
        h('span', label),
        h(ElTooltip, { content: tooltip, placement: 'top' }, () =>
          h(ElIcon, { class: 'ml-0.5 cursor-help' }, () => h(QuestionFilled))
        )
      ]);
  };

  interface MenuFormData {
    id: number;
    parentId: number;
    name: string;
    path: string;
    label: string;
    component: string;
    icon: string;
    isEnable: boolean;
    sort: number;
    keepAlive: boolean;
    isHide: boolean;
    isHideTab: boolean;
    link: string;
    fixedTab: boolean;
    activePath: string;
    roles: string[];
    isFullPage: boolean;
    authName: string;
    authLabel: string;
    authSort: number;
  }

  interface Props {
    visible: boolean;
    editData?: AppRouteRecord | any;
    type?: 'menu' | 'button';
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: MenuFormData): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'menu'
  });

  const emit = defineEmits<Emits>();

  const formRef = ref();
  const isEdit = ref(false);
  const showIconPicker = ref(false);

  const handleIconConfirm = (icon: string) => {
    form.icon = icon;
  };

  /** 上级菜单选项 */
  const parentMenuOptions = ref<Array<{ label: string; value: number }>>([]);

  const form = reactive<MenuFormData & { menuType: MenuType }>({
    menuType: 'directory',
    id: 0,
    parentId: 0,
    name: '',
    path: '',
    label: '',
    component: '',
    icon: '',
    isEnable: true,
    sort: 1,
    keepAlive: true,
    isHide: false,
    isHideTab: false,
    link: '',
    fixedTab: false,
    activePath: '',
    roles: [],
    isFullPage: false,
    authName: '',
    authLabel: '',
    authSort: 1
  });

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authLabel: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
  });

  const menuTypeLabelMap: Record<MenuType, string> = {
    directory: '目录',
    menu: '菜单',
    button: '按钮',
    iframe: '内嵌',
    link: '外链'
  };

  const dialogTitle = computed(() => {
    const label = menuTypeLabelMap[form.menuType];
    return isEdit.value ? `编辑${label}` : `新建${label}`;
  });

  const disableMenuType = computed(() => {
    // 编辑目录时禁用（目录下有子菜单，不能改类型）
    if (isEdit.value && form.menuType === 'directory') return true;
    // 编辑按钮时禁用（按钮是权限条目，数据结构完全不同）
    if (isEdit.value && form.menuType === 'button') return true;
    return false;
  });

  /** 编辑菜单/内嵌/外链时，禁用目录和按钮选项（只能在三者间切换） */
  const disableDirectoryOption = computed(() => {
    return isEdit.value && ['menu', 'iframe', 'link'].includes(form.menuType);
  });
  const disableButtonOption = computed(() => {
    return isEdit.value && ['menu', 'iframe', 'link'].includes(form.menuType);
  });

  /** 加载上级菜单选项 */
  const loadParentMenuOptions = async () => {
    try {
      const tree = await mockGetMenuTree();
      const flatten = (
        items: AppRouteRecord[],
        result: Array<{ label: string; value: number }> = []
      ) => {
        items.forEach((item) => {
          if (!item.meta?.isAuthButton) {
            result.push({
              label: formatMenuTitle(item.meta?.title || ''),
              value: result.length + 1
            });
            if (item.children?.length) flatten(item.children, result);
          }
        });
        return result;
      };
      parentMenuOptions.value = flatten(tree);
    } catch {
      parentMenuOptions.value = [];
    }
  };

  const resetForm = (): void => {
    formRef.value?.reset();
    form.menuType = 'directory';
    form.id = 0;
    form.parentId = 0;
    form.name = '';
    form.path = '';
    form.label = '';
    form.component = '';
    form.icon = '';
    form.sort = 1;
    form.keepAlive = true;
    form.isHide = false;
    form.isHideTab = false;
    form.isEnable = true;
    form.link = '';
    form.fixedTab = false;
    form.activePath = '';
    form.roles = [];
    form.isFullPage = false;
    form.authName = '';
    form.authLabel = '';
    form.authSort = 1;
  };

  const loadFormData = (): void => {
    if (!props.editData) return;

    isEdit.value = true;

    if (form.menuType === 'button') {
      const row = props.editData;
      form.authName = row.title || row.meta?.title || '';
      form.authLabel = row.authMark || row.meta?.authMark || '';
      form.authSort = row.sort || 1;
    } else {
      const row = props.editData;
      form.id = row.id || 0;
      form.name = formatMenuTitle(row.meta?.title || '');
      form.path = row.path || '';
      form.label = row.name || '';
      form.component = row.component || '';
      form.icon = row.meta?.icon || '';
      form.sort = row.meta?.sort || 1;
      form.keepAlive = row.meta?.keepAlive ?? false;
      form.isHide = row.meta?.isHide ?? false;
      form.isHideTab = row.meta?.isHideTab ?? false;
      form.isEnable = row.meta?.isEnable ?? true;
      form.link = row.meta?.link || '';
      form.fixedTab = row.meta?.fixedTab ?? false;
      form.activePath = row.meta?.activePath || '';
      form.roles = row.meta?.roles || [];
      form.isFullPage = row.meta?.isFullPage ?? false;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return;

    try {
      await formRef.value.validate();
      emit('submit', { ...form });
      ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`);
      handleCancel();
    } catch {
      ElMessage.error('表单校验失败，请检查输入');
    }
  };

  const handleCancel = (): void => {
    emit('update:visible', false);
  };

  const handleClosed = (): void => {
    resetForm();
    isEdit.value = false;
  };

  /** 推断菜单类型 */
  const inferMenuType = (row: any): MenuType => {
    if (row?.meta?.isAuthButton) return 'button';
    if (row?.meta?.link && row?.meta?.isIframe) return 'iframe';
    if (row?.meta?.link) return 'link';
    if (row?.children?.length) return 'directory';
    if (row?.path) return 'menu';
    return 'directory';
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        if (props.editData) {
          form.menuType = props.type === 'button' ? 'button' : inferMenuType(props.editData);
          isEdit.value = true;
          loadParentMenuOptions();
          nextTick(() => {
            loadFormData();
          });
        } else {
          isEdit.value = false;
          form.menuType = props.type === 'button' ? 'button' : 'directory';
          loadParentMenuOptions();
        }
      }
    }
  );

  watch(
    () => props.type,
    (newType) => {
      if (props.visible) {
        form.menuType = newType;
      }
    }
  );
</script>

<style scoped>
  .menu-type-item :deep(.el-form-item__content) {
    display: block;
  }

  .icon-input-inner :deep(.el-input__wrapper) {
    box-shadow: none !important;
    border: none !important;
    border-radius: 0;
    background: transparent !important;
    padding: 0 11px;
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
</style>

<style>
  .menu-drawer {
    background-color: var(--el-bg-color-overlay) !important;
    border-color: var(--el-border-color-lighter) !important;
  }

  .menu-drawer .el-drawer__header {
    padding: var(--el-drawer-padding-primary) !important;
    margin-bottom: 0 !important;
  }

  .menu-drawer .el-drawer__body {
    padding: var(--el-drawer-padding-primary) !important;
    padding-top: 0 !important;
    overflow-y: auto;
  }

  .menu-drawer .el-drawer__footer {
    padding: 10px 20px 20px !important;
    border-top: none;
  }

  .menu-drawer .el-form-item {
    margin-bottom: 18px;
  }

  .menu-drawer .el-col {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .menu-drawer .el-row {
    margin-top: 20px;
  }

  .menu-drawer .el-drawer__close-btn {
    position: relative;
    top: -4px;
    right: -4px;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .menu-drawer .el-drawer__close-btn:hover {
    background-color: var(--art-hover-color) !important;
    color: var(--art-gray-900) !important;
  }
</style>
