<!-- 系统设置页面 -->
<template>
  <div class="setting-page pb-5">
    <header ref="pageHeaderRef" class="page-header">
      <div>
        <div class="page-title-row">
          <span class="page-title-icon">
            <ArtSvgIcon icon="ri:settings-3-line" />
          </span>
          <h1>网站配置</h1>
        </div>
        <p>管理个人博客的展示信息、社交主页以及评论和留言规则</p>
      </div>

      <div class="header-actions">
        <span v-if="isDirty" class="dirty-tip">
          <span class="dirty-dot" />
          有未保存修改
        </span>
        <ElButton :disabled="!isDirty || submitting || confirming" @click="handleReset">
          放弃修改
        </ElButton>
        <ElButton
          type="primary"
          :disabled="!isDirty || confirming"
          :loading="submitting"
          @click="handleSubmit"
        >
          <ArtSvgIcon icon="ri:save-line" class="mr-1" />
          保存配置
        </ElButton>
      </div>
    </header>

    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      class="setting-form"
      v-loading="loading"
    >
      <div class="setting-layout">
        <SettingSidebar v-model="activeTab" />

        <main class="setting-content" :class="`is-switching-${panelTransitionDirection}`">
          <Transition name="setting-panel-switch">
            <BlogInfoPanel
              v-show="activeTab === 'base'"
              :model-value="form"
              @avatar-change="handleAvatarChange"
            />
          </Transition>
          <Transition name="setting-panel-switch">
            <SocialConnectionPanel v-show="activeTab === 'links'" :model-value="form" />
          </Transition>
          <Transition name="setting-panel-switch">
            <CommentSettingsPanel v-show="activeTab === 'comment'" :model-value="form" />
          </Transition>
          <Transition name="setting-panel-switch">
            <AboutEditorPanel v-show="activeTab === 'about'" :model-value="form" />
          </Transition>
        </main>
      </div>
    </ElForm>

    <!-- 图片裁剪弹窗（复用用户模块） -->
    <AvatarCropperDialog
      v-model="cropDialogVisible"
      :image-file="cropImageFile"
      @save="handleCropSave"
      @close="handleCropClose"
    />
  </div>
</template>

<script setup lang="ts">
  import type { WebsiteConfigItem } from '@/apis/setting/types';
  import { fetchSettingInfo, fetchUpdateSetting, fetchUploadWebsiteAvatar } from '@/apis/setting';
  import { ElMessageBox } from 'element-plus';
  import type { FormInstance, FormItemRule, FormRules, UploadFile } from 'element-plus';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import AvatarCropperDialog from '@/views/system/user/modules/avatar-cropper-dialog.vue';
  import AboutEditorPanel from './modules/about-editor-panel.vue';
  import BlogInfoPanel from './modules/blog-info-panel.vue';
  import CommentSettingsPanel from './modules/comment-settings-panel.vue';
  import SettingSidebar from './modules/setting-sidebar.vue';
  import SocialConnectionPanel from './modules/social-connection-panel.vue';
  import type { AvatarField, SettingTab } from './types';

  defineOptions({ name: 'Setting' });

  const formRef = ref<FormInstance>();
  const submitting = ref(false);
  const confirming = ref(false);
  const loading = ref(false);
  const activeTab = ref<SettingTab>('base');
  const panelTransitionDirection = ref<'up' | 'down'>('down');
  const pageHeaderRef = ref<HTMLElement>();
  const savedSnapshot = ref('');

  const settingTabOrder: SettingTab[] = ['base', 'links', 'comment', 'about'];

  // 图片上传相关
  const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const cropDialogVisible = ref(false);
  const cropImageFile = ref<File | null>(null);
  const avatarField = ref<AvatarField>('siteAvatar');

  const defaultForm = (): WebsiteConfigItem => ({
    id: 0,
    siteAvatar: '',
    siteName: '',
    siteAuthor: '',
    siteIntro: '',
    about: '',
    siteStartTime: '',
    qqUrl: '',
    githubUrl: '',
    giteeUrl: '',
    defaultUserAvatar: '',
    enableCommentReview: 0,
    enableMessageReview: 0,
    websocketUrl: '',
    enableCommentEmailNotice: 0,
    enableCommentReviewNotice: 0,
    enableMessageReviewNotice: 0,
    commentIllegalPolicy: 0,
    messageIllegalPolicy: 0
  });

  const form = reactive<WebsiteConfigItem>(defaultForm());

  const isDirty = computed(
    () => savedSnapshot.value !== '' && JSON.stringify(form) !== savedSnapshot.value
  );

  const isUrlWithProtocol = (value: unknown, protocols: string[]): boolean => {
    if (typeof value !== 'string' || value.trim() === '') return true;

    try {
      const url = new URL(value.trim());
      return protocols.includes(url.protocol) && Boolean(url.hostname);
    } catch {
      return false;
    }
  };

  const validateOptionalHttpUrl: NonNullable<FormItemRule['validator']> = (
    _rule,
    value,
    callback
  ) => {
    if (isUrlWithProtocol(value, ['http:', 'https:'])) {
      callback();
      return;
    }
    callback(new Error('请输入以 http:// 或 https:// 开头的完整链接'));
  };

  const validateOptionalWebSocketUrl: NonNullable<FormItemRule['validator']> = (
    _rule,
    value,
    callback
  ) => {
    if (typeof value !== 'string' || value.trim() === '') {
      callback();
      return;
    }

    const trimmedValue = value.trim();
    const hasWebSocketProtocol = /^wss?:\/\//i.test(trimmedValue);
    if ((!hasWebSocketProtocol && trimmedValue.includes('://')) || /\s/.test(trimmedValue)) {
      callback(new Error('请输入有效地址，如 localhost:8080 或 wss://example.com'));
      return;
    }

    const normalizedValue = hasWebSocketProtocol ? trimmedValue : `ws://${trimmedValue}`;
    try {
      const url = new URL(normalizedValue);
      const port = url.port ? Number(url.port) : undefined;
      const isValid =
        ['ws:', 'wss:'].includes(url.protocol) &&
        Boolean(url.hostname) &&
        !url.username &&
        !url.password &&
        !url.hash &&
        (port === undefined || (Number.isInteger(port) && port > 0 && port <= 65535));
      if (isValid) {
        callback();
        return;
      }
    } catch {
      // 交由下方返回统一的格式错误提示
    }
    callback(new Error('请输入有效地址，如 localhost:8080 或 wss://example.com'));
  };

  const validateSiteStartTime: NonNullable<FormItemRule['validator']> = (
    _rule,
    value,
    callback
  ) => {
    if (typeof value !== 'string' || value.trim() === '') {
      callback();
      return;
    }

    const timestamp = new Date(value.replace(' ', 'T')).getTime();
    if (Number.isNaN(timestamp)) {
      callback(new Error('博客创建时间格式不正确'));
      return;
    }
    if (timestamp > Date.now()) {
      callback(new Error('博客创建时间不能晚于当前时间'));
      return;
    }
    callback();
  };

  const rules: FormRules = {
    siteName: [
      { required: true, whitespace: true, message: '请输入博客名称', trigger: 'blur' },
      { max: 50, message: '博客名称不能超过50个字符', trigger: 'blur' }
    ],
    siteAuthor: [
      { required: true, whitespace: true, message: '请输入博主名称', trigger: 'blur' },
      { max: 50, message: '博主名称不能超过50个字符', trigger: 'blur' }
    ],
    siteStartTime: [
      { required: true, message: '请选择博客创建时间', trigger: 'change' },
      { validator: validateSiteStartTime, trigger: 'change' }
    ],
    siteIntro: [
      { required: true, whitespace: true, message: '请输入博客简介', trigger: 'blur' },
      { max: 500, message: '博客简介不能超过500个字符', trigger: 'blur' }
    ],
    about: [
      { required: true, whitespace: true, message: '请填写关于我', trigger: 'blur' },
      { max: 5000, message: '关于我不能超过5000个字符', trigger: 'blur' }
    ],
    qqUrl: [{ validator: validateOptionalHttpUrl, trigger: 'blur' }],
    githubUrl: [{ validator: validateOptionalHttpUrl, trigger: 'blur' }],
    giteeUrl: [{ validator: validateOptionalHttpUrl, trigger: 'blur' }],
    websocketUrl: [{ validator: validateOptionalWebSocketUrl, trigger: 'blur' }]
  };

  /** 页面标题滚出可视区域后，切换分类时将完整标题和操作区平滑带回顶部。 */
  const scrollPageHeaderIntoView = () => {
    const pageHeader = pageHeaderRef.value;
    if (!pageHeader) return;

    const headerBottom = document.getElementById('app-header')?.getBoundingClientRect().bottom ?? 0;
    const safeTop = headerBottom + 12;
    const pageHeaderTop = pageHeader.getBoundingClientRect().top;
    if (pageHeaderTop >= safeTop) return;

    const scrollOptions: ScrollToOptions = {
      top: pageHeaderTop - safeTop,
      behavior: 'smooth'
    };
    const appMain = document.getElementById('app-main');
    const appMainOverflow = appMain ? window.getComputedStyle(appMain).overflowY : '';

    if (appMain && (appMainOverflow === 'auto' || appMainOverflow === 'scroll')) {
      appMain.scrollBy(scrollOptions);
      return;
    }
    window.scrollBy(scrollOptions);
  };

  watch(activeTab, (currentTab, previousTab) => {
    panelTransitionDirection.value =
      settingTabOrder.indexOf(currentTab) >= settingTabOrder.indexOf(previousTab) ? 'down' : 'up';
    nextTick(scrollPageHeaderIntoView);
  });

  onMounted(() => {
    getSetting();
  });

  const getSetting = async (): Promise<void> => {
    loading.value = true;
    try {
      const data = await fetchSettingInfo();
      Object.assign(form, defaultForm(), data ?? {});
      await nextTick();
      savedSnapshot.value = JSON.stringify(form);
    } catch {
      // 接口报错由全局拦截器展示
    } finally {
      loading.value = false;
    }
  };

  /** 图片选择 → 打开裁剪弹窗，记录当前编辑的字段 */
  const handleAvatarChange = (field: AvatarField, uploadFile: UploadFile) => {
    if (!uploadFile.raw) return;

    // 与后端图片上传白名单保持一致，避免选择后才收到接口错误
    if (!ALLOWED_AVATAR_TYPES.includes(uploadFile.raw.type)) {
      ElMessage.warning('仅支持 JPG、PNG、GIF、WebP 格式的图片');
      return;
    }

    // 原始图片最大允许5MB，超出时不进入裁剪和上传流程
    if (uploadFile.raw.size > MAX_AVATAR_FILE_SIZE) {
      ElMessage.warning('图片大小不能超过5MB');
      return;
    }

    avatarField.value = field;
    cropImageFile.value = uploadFile.raw;
    cropDialogVisible.value = true;
  };

  /** 裁剪保存 → 上传图片并回填字段 */
  const handleCropSave = async (file: File) => {
    try {
      const url = await fetchUploadWebsiteAvatar(file);
      form[avatarField.value] = url;
    } catch {
      // 接口报错由全局拦截器展示
    }
  };

  const handleCropClose = () => {
    cropImageFile.value = null;
  };

  /** 重置：重新拉取后端配置，放弃本地修改 */
  const handleReset = async () => {
    if (!isDirty.value) return;
    try {
      await ElMessageBox.confirm('当前修改尚未保存，确定要放弃吗？', '放弃修改', {
        confirmButtonText: '确定放弃',
        cancelButtonText: '继续编辑',
        type: 'warning'
      });
      await getSetting();
      formRef.value?.clearValidate();
    } catch {
      // 用户继续编辑
    }
  };

  const handleSubmit = async () => {
    if (!formRef.value || submitting.value || confirming.value) return;
    try {
      await formRef.value.validate();
      if (!form.defaultUserAvatar?.trim()) {
        activeTab.value = 'base';
        ElMessage.warning('请先上传用户默认头像');
        return;
      }
      confirming.value = true;
      await ElMessageBox.confirm(
        '保存后，当前修改将立即应用到博客前台，确定继续吗？',
        '保存网站配置',
        {
          confirmButtonText: '确认保存',
          cancelButtonText: '取消',
          type: 'warning'
        }
      );
      submitting.value = true;
      await fetchUpdateSetting({ ...form });
      ElMessage.success('保存成功');
      await getSetting();
    } catch (error) {
      if (error && typeof error === 'object') {
        if (
          ['siteName', 'siteAuthor', 'siteStartTime', 'siteIntro'].some((field) => field in error)
        ) {
          activeTab.value = 'base';
        } else if (
          ['qqUrl', 'githubUrl', 'giteeUrl', 'websocketUrl'].some((field) => field in error)
        ) {
          activeTab.value = 'links';
        } else if ('about' in error) {
          activeTab.value = 'about';
        }
      }
      // 接口报错由全局拦截器展示
    } finally {
      confirming.value = false;
      submitting.value = false;
    }
  };
</script>

<style scoped lang="scss">
  .setting-page {
    width: 100%;
  }

  .page-header {
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
    padding: 4px 2px 22px;

    > div:first-child > p {
      margin-top: 7px;
      font-size: 13px;
      color: var(--art-gray-600);
    }
  }

  .page-title-row {
    display: flex;
    gap: 11px;
    align-items: center;

    h1 {
      font-size: 21px;
      font-weight: 600;
      line-height: 1.3;
      color: var(--art-gray-900);
    }
  }

  .page-title-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 19px;
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 11%, transparent);
    border-radius: 11px;
  }

  .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .dirty-tip {
    display: inline-flex;
    gap: 7px;
    align-items: center;
    margin-right: 4px;
    font-size: 12px;
    color: var(--art-gray-600);
  }

  .dirty-dot {
    width: 7px;
    height: 7px;
    background: var(--el-color-warning);
    border-radius: 50%;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--el-color-warning) 15%, transparent);
  }

  .setting-layout {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 20px;
    align-items: start;
  }

  .setting-content {
    position: relative;
    min-width: 0;
  }

  .setting-panel-switch-enter-active {
    z-index: 1;
    transition:
      opacity 0.24s ease 0.11s,
      transform 0.28s cubic-bezier(0.22, 1, 0.36, 1) 0.11s;
    will-change: opacity, transform;
  }

  .setting-panel-switch-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    pointer-events: none;
    transition: opacity 0.16s ease;
    will-change: opacity;
  }

  .setting-content.is-switching-down .setting-panel-switch-enter-from {
    opacity: 0;
    transform: translate3d(0, 5px, 0);
  }

  .setting-content.is-switching-up .setting-panel-switch-enter-from {
    opacity: 0;
    transform: translate3d(0, -5px, 0);
  }

  .setting-panel-switch-leave-to {
    opacity: 0;
  }

  @media screen and (width <= 980px) {
    .page-header {
      align-items: flex-start;
    }

    .dirty-tip {
      display: none;
    }

    .setting-layout {
      grid-template-columns: 190px minmax(0, 1fr);
      gap: 16px;
    }
  }

  @media screen and (width <= 760px) {
    .setting-page {
      padding-bottom: 72px;
    }

    .page-header {
      position: static;
      display: block;
      padding-bottom: 18px;
    }

    .header-actions {
      position: fixed;
      right: 15px;
      bottom: 15px;
      left: 15px;
      z-index: 100;
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      width: auto;
      padding: 10px;
      background: color-mix(in srgb, var(--default-box-color) 94%, transparent);
      backdrop-filter: blur(12px);
      border: 1px solid var(--art-card-border);
      border-radius: calc(var(--custom-radius) + 4px);
      box-shadow: 0 10px 30px rgb(31 41 55 / 14%);

      :deep(.el-button) {
        width: 100%;
        margin: 0;
      }
    }

    .setting-layout {
      display: block;
    }
  }

  @media screen and (width <= 520px) {
    .page-title-row h1 {
      font-size: 19px;
    }

    .page-header > div:first-child > p {
      padding-left: 47px;
      line-height: 1.55;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .setting-panel-switch-enter-active,
    .setting-panel-switch-leave-active {
      transition: none;
    }

    .setting-content :deep(.setting-panel) {
      animation: none;
    }

    .setting-content.is-switching-down .setting-panel-switch-enter-from,
    .setting-content.is-switching-up .setting-panel-switch-enter-from,
    .setting-panel-switch-leave-to {
      opacity: 1;
      transform: none;
    }
  }
</style>
