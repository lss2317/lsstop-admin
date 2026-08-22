<!-- 系统设置页面 -->
<template>
  <div class="setting-page pb-5">
    <header class="page-header">
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
        <ElButton :disabled="!isDirty || submitting" @click="handleReset">放弃修改</ElButton>
        <ElButton type="primary" :disabled="!isDirty" :loading="submitting" @click="handleSubmit">
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
      class="setting-form"
      v-loading="loading"
    >
      <div class="setting-layout">
        <SettingSidebar v-model="activeTab" />

        <main
          ref="settingContentRef"
          class="setting-content"
          :class="`is-switching-${panelTransitionDirection}`"
        >
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
  import type { FormInstance, FormRules, UploadFile } from 'element-plus';
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
  const loading = ref(false);
  const activeTab = ref<SettingTab>('base');
  const panelTransitionDirection = ref<'up' | 'down'>('down');
  const settingContentRef = ref<HTMLElement>();
  const savedSnapshot = ref('');

  const settingTabOrder: SettingTab[] = ['base', 'links', 'comment', 'about'];

  // 图片上传相关
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

  const rules: FormRules = {
    siteName: [{ required: true, message: '请输入博客名称', trigger: 'blur' }]
  };

  /** 配置区标题滚出可视区域后，切换分类时将其平滑带回顶部。 */
  const scrollSettingContentIntoView = () => {
    const content = settingContentRef.value;
    if (!content) return;

    const headerBottom = document.getElementById('app-header')?.getBoundingClientRect().bottom ?? 0;
    const safeTop = headerBottom + 12;
    const contentTop = content.getBoundingClientRect().top;
    if (contentTop >= safeTop) return;

    const scrollOptions: ScrollToOptions = {
      top: contentTop - safeTop,
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
    nextTick(scrollSettingContentIntoView);
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
    if (!formRef.value || submitting.value) return;
    try {
      await formRef.value.validate();
      submitting.value = true;
      await fetchUpdateSetting({ ...form });
      ElMessage.success('保存成功');
      await getSetting();
    } catch (error) {
      // 博客信息是目前唯一包含必填校验的分类，校验失败时自动定位
      if (error && typeof error === 'object' && 'siteName' in error) {
        activeTab.value = 'base';
      }
      // 接口报错由全局拦截器展示
    } finally {
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
