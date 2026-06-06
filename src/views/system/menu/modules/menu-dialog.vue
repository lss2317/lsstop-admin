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
                <ElTreeSelect
                  v-model="form.parentId"
                  :data="parentMenuOptions"
                  :props="{ label: 'label', value: 'value', children: 'children' }"
                  class="w-full"
                  clearable
                  check-strictly
                  :render-after-expand="false"
                  placeholder="不选择则创建为顶级菜单"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="title" required>
                <template #label>
                  <span>{{ '菜单名称' }}</span>
                </template>
                <ElInput v-model="form.title" placeholder="菜单名称" />
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
                <ElInput v-model="form.name" placeholder="如：System" />
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
                <ElTreeSelect
                  v-model="form.parentId"
                  :data="parentMenuOptions"
                  :props="{ label: 'label', value: 'value', children: 'children' }"
                  class="w-full"
                  clearable
                  check-strictly
                  :render-after-expand="false"
                  placeholder="无（顶级菜单）"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="菜单名称" prop="title" required>
                <ElInput v-model="form.title" placeholder="菜单名称" />
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
                <ElInput v-model="form.path" placeholder="如：/system/user 或 user" />
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
                <ElInput v-model="form.component" placeholder="如：/system/user" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识">
                <ElInput v-model="form.name" placeholder="如：User" />
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
              <ElFormItem label="权限名称" prop="title" required>
                <ElInput v-model="form.title" placeholder="如：新增、编辑、删除" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识" prop="authMark" required>
                <ElInput v-model="form.authMark" placeholder="如：add、edit、delete" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="sort">
                <template #label>
                  <span class="flex items-center">
                    <span>权限排序</span>
                    <ElTooltip content="按升序排列，数字越小排序越靠前" placement="top">
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

          <template v-else-if="form.menuType === 'iframe'">
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="上级菜单" prop="parentId">
                <ElTreeSelect
                  v-model="form.parentId"
                  :data="parentMenuOptions"
                  :props="{ label: 'label', value: 'value', children: 'children' }"
                  class="w-full"
                  clearable
                  check-strictly
                  :render-after-expand="false"
                  placeholder="无（顶级菜单）"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="菜单名称" prop="title" required>
                <ElInput v-model="form.title" placeholder="菜单名称" />
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
                <ElInput v-model="form.path" placeholder="如：/outside/iframe/docs" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="外部链接" prop="link" required>
                <ElInput v-model="form.link" placeholder="如：https://www.example.com" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识">
                <ElInput v-model="form.name" placeholder="如：Iframe" />
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
                <ElTreeSelect
                  v-model="form.parentId"
                  :data="parentMenuOptions"
                  :props="{ label: 'label', value: 'value', children: 'children' }"
                  class="w-full"
                  clearable
                  check-strictly
                  :render-after-expand="false"
                  placeholder="无（顶级菜单）"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="菜单名称" prop="title" required>
                <ElInput v-model="form.title" placeholder="菜单名称" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="外部链接" prop="link" required>
                <ElInput v-model="form.link" placeholder="如：https://www.example.com" />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="权限标识">
                <ElInput v-model="form.name" placeholder="如：Link" />
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
            <ElSwitch v-model="form.isEnabled" />
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
                >隐藏标签</span
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
  import type { BackendMenuItem } from '@/apis/menu/types';
  import { mockGetMenuAdminList } from '@/apis/menu/mock';

  type MenuType = 'directory' | 'menu' | 'button' | 'iframe' | 'link';

  /** 表单状态（字段名对齐 DB BackendMenuItem） */
  interface MenuFormState {
    id: number;
    parentId: number | undefined;
    /** 菜单标题（DB title） */
    title: string;
    /** 路由唯一标识（DB name） */
    name: string;
    path: string;
    component: string;
    icon: string;
    sort: number;
    isHide: boolean;
    isHideTab: boolean;
    keepAlive: boolean;
    isFullPage: boolean;
    fixedTab: boolean;
    link: string;
    activePath: string;
    /** 权限标识（DB auth_mark） */
    authMark: string;
    /** 是否启用（DB is_enabled） */
    isEnabled: boolean;
  }

  interface Props {
    visible: boolean;
    editData?: BackendMenuItem | any;
    type?: 'menu' | 'button';
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: MenuFormState & { menuType: MenuType }): void;
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

  interface TreeOption {
    label: string;
    value: number;
    children?: TreeOption[];
  }

  /** 上级菜单选项 */
  const parentMenuOptions = ref<TreeOption[]>([]);

  const form = reactive<MenuFormState & { menuType: MenuType }>({
    menuType: 'directory',
    id: 0,
    parentId: undefined,
    title: '',
    name: '',
    path: '',
    component: '',
    icon: '',
    sort: 1,
    isHide: false,
    isHideTab: false,
    keepAlive: true,
    isFullPage: false,
    fixedTab: false,
    link: '',
    activePath: '',
    authMark: '',
    isEnabled: true
  });

  const rules = reactive<FormRules>({
    title: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
    link: [{ required: true, message: '请输入外部链接', trigger: 'blur' }],
    authMark: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
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

  /** 加载上级菜单选项（树形结构） */
  const loadParentMenuOptions = async () => {
    try {
      const tree = await mockGetMenuAdminList();
      const buildTree = (items: BackendMenuItem[]): TreeOption[] => {
        const result: TreeOption[] = [];
        items.forEach((item) => {
          if (item.menuType !== 3) {
            const node: TreeOption = {
              label: item.title || '',
              value: item.id
            };
            const nonButtonChildren = item.children?.filter((c) => c.menuType !== 3) || [];
            if (nonButtonChildren.length) {
              node.children = buildTree(nonButtonChildren);
            }
            result.push(node);
          }
        });
        return result;
      };
      parentMenuOptions.value = buildTree(tree);
    } catch {
      parentMenuOptions.value = [];
    }
  };

  const resetForm = (): void => {
    formRef.value?.resetFields();
    form.menuType = 'directory';
    form.id = 0;
    form.parentId = undefined;
    form.title = '';
    form.name = '';
    form.path = '';
    form.component = '';
    form.icon = '';
    form.sort = 1;
    form.isHide = false;
    form.isHideTab = false;
    form.keepAlive = true;
    form.isFullPage = false;
    form.fixedTab = false;
    form.link = '';
    form.activePath = '';
    form.authMark = '';
    form.isEnabled = true;
  };

  const loadFormData = (): void => {
    if (!props.editData) return;

    isEdit.value = true;

    if (form.menuType === 'button') {
      const row = props.editData;
      form.title = row.title || '';
      form.authMark = row.authMark || '';
      form.sort = row.sort || 1;
    } else {
      const row = props.editData;
      form.id = row.id || 0;
      form.title = row.title || '';
      form.name = row.name || '';
      form.path = row.path || '';
      form.component = row.component || '';
      form.icon = row.icon || '';
      form.sort = row.sort || 1;
      form.keepAlive = row.keepAlive ?? false;
      form.isHide = row.isHide ?? false;
      form.isHideTab = row.isHideTab ?? false;
      form.isEnabled = row.isEnabled === 1;
      form.link = row.link || '';
      form.fixedTab = row.fixedTab ?? false;
      form.activePath = row.activePath || '';
      form.isFullPage = row.isFullPage ?? false;
      // 通过 parentId 直接赋值
      if (row.parentId && row.parentId !== 0) {
        form.parentId = row.parentId;
      }
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
    if (row.menuType === 3) return 'button';
    if (row.link && row.isIframe) return 'iframe';
    if (row.link) return 'link';
    if (row.menuType === 1) return 'directory';
    return 'menu';
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        resetForm();

        if (props.editData && !props.editData._parentRow) {
          // 编辑模式
          form.menuType = props.type === 'button' ? 'button' : inferMenuType(props.editData);
          isEdit.value = true;
          loadParentMenuOptions();
          nextTick(() => {
            loadFormData();
          });
        } else {
          // 新增模式
          isEdit.value = false;
          form.menuType = props.type === 'button' ? 'button' : 'directory';
          loadParentMenuOptions();
          if (props.editData?._parentRow) {
            nextTick(() => {
              const parentRow = props.editData._parentRow;
              form.parentId = parentRow.id;
            });
          }
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
