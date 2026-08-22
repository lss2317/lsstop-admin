<!-- 系统设置页面 -->
<!-- 配置表仅一条数据，页面以「表单 + 页签分组」方式直接编辑，非列表 CRUD -->
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
        <p>管理网站对外展示信息、社交账号以及评论和留言规则</p>
      </div>

      <div class="header-actions">
        <span v-if="isDirty" class="dirty-tip">
          <span class="dirty-dot" />
          有未保存修改
        </span>
        <ElButton :disabled="!isDirty || submitting" @click="handleReset">放弃修改</ElButton>
        <ElButton type="primary" :loading="submitting" @click="handleSubmit">
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
        <aside class="art-card setting-nav">
          <p class="nav-caption">配置分类</p>
          <button
            v-for="item in settingNavItems"
            :key="item.name"
            type="button"
            class="nav-item"
            :class="{ active: activeTab === item.name }"
            @click="activeTab = item.name"
          >
            <span class="nav-icon"><ArtSvgIcon :icon="item.icon" /></span>
            <span class="nav-copy">
              <strong>{{ item.label }}</strong>
              <small>{{ item.description }}</small>
            </span>
            <ArtSvgIcon icon="ri:arrow-right-s-line" class="nav-arrow" />
          </button>
        </aside>

        <main class="setting-content">
          <!-- 基础资料 -->
          <section v-show="activeTab === 'base'" class="setting-panel">
            <div class="panel-heading">
              <span class="panel-icon"><ArtSvgIcon icon="ri:global-line" /></span>
              <div>
                <h2>基础资料</h2>
                <p>设置网站品牌资源和对外展示的基本信息</p>
              </div>
            </div>

            <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
              <div class="card-heading">
                <div>
                  <h3>品牌资源</h3>
                  <p>统一管理网站标识及用户缺省头像</p>
                </div>
              </div>

              <div class="media-grid">
                <div class="media-setting">
                  <ElUpload
                    class="avatar-upload"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*"
                    @change="(file: UploadFile) => handleAvatarChange('siteAvatar', file)"
                  >
                    <div class="avatar-frame">
                      <ElImage
                        v-if="form.siteAvatar"
                        :src="form.siteAvatar"
                        class="avatar-preview"
                        fit="cover"
                      />
                      <div v-else class="avatar-placeholder">
                        <ArtSvgIcon icon="ri:image-add-line" />
                      </div>
                      <span class="avatar-mask">
                        <ArtSvgIcon icon="ri:camera-line" />
                        更换
                      </span>
                    </div>
                  </ElUpload>
                  <div class="media-copy">
                    <strong>网站头像</strong>
                    <p>展示在网站首页、浏览器图标等品牌位置</p>
                    <span>建议上传 1:1 比例的 JPG、PNG 或 WebP 图片</span>
                  </div>
                </div>

                <div class="media-setting">
                  <ElUpload
                    class="avatar-upload"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*"
                    @change="(file: UploadFile) => handleAvatarChange('defaultUserAvatar', file)"
                  >
                    <div class="avatar-frame">
                      <ElImage
                        v-if="form.defaultUserAvatar"
                        :src="form.defaultUserAvatar"
                        class="avatar-preview"
                        fit="cover"
                      />
                      <div v-else class="avatar-placeholder">
                        <ArtSvgIcon icon="ri:user-add-line" />
                      </div>
                      <span class="avatar-mask">
                        <ArtSvgIcon icon="ri:camera-line" />
                        更换
                      </span>
                    </div>
                  </ElUpload>
                  <div class="media-copy">
                    <strong>用户默认头像</strong>
                    <p>用户未上传头像时使用的默认展示图片</p>
                    <span>建议保持人物主体居中，避免圆形裁切时丢失内容</span>
                  </div>
                </div>
              </div>
            </ElCard>

            <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
              <div class="card-heading">
                <div>
                  <h3>基本信息</h3>
                  <p>这些内容将展示在网站首页及相关介绍页面</p>
                </div>
              </div>

              <div class="card-body">
                <ElRow :gutter="20">
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="网站名称" prop="siteName" required>
                      <ElInput
                        v-model="form.siteName"
                        placeholder="请输入网站名称"
                        clearable
                        maxlength="50"
                      >
                        <template #prefix><ArtSvgIcon icon="ri:window-line" /></template>
                      </ElInput>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="网站作者" prop="siteAuthor">
                      <ElInput
                        v-model="form.siteAuthor"
                        placeholder="请输入网站作者"
                        clearable
                        maxlength="50"
                      >
                        <template #prefix><ArtSvgIcon icon="ri:user-3-line" /></template>
                      </ElInput>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="网站创建时间" prop="siteStartTime">
                      <ElDatePicker
                        v-model="form.siteStartTime"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择网站创建时间"
                        class="w-full"
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24">
                    <ElFormItem label="网站介绍" prop="siteIntro">
                      <ElInput
                        v-model="form.siteIntro"
                        type="textarea"
                        :rows="3"
                        resize="none"
                        placeholder="用一段简短的文字介绍你的网站"
                        maxlength="200"
                        show-word-limit
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24">
                    <ElFormItem label="关于我" prop="about" class="!mb-0">
                      <ElInput
                        v-model="form.about"
                        type="textarea"
                        :rows="5"
                        resize="none"
                        placeholder="介绍一下网站作者、创作方向或个人经历"
                        maxlength="500"
                        show-word-limit
                      />
                    </ElFormItem>
                  </ElCol>
                </ElRow>
              </div>
            </ElCard>
          </section>

          <!-- 社交与连接 -->
          <section v-show="activeTab === 'links'" class="setting-panel">
            <div class="panel-heading">
              <span class="panel-icon"><ArtSvgIcon icon="ri:links-line" /></span>
              <div>
                <h2>社交与连接</h2>
                <p>配置公开社交主页以及网站实时通信服务</p>
              </div>
            </div>

            <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
              <div class="card-heading">
                <div>
                  <h3>社交账号</h3>
                  <p>填写后可在网站前台展示对应平台入口</p>
                </div>
              </div>
              <div class="card-body">
                <ElRow :gutter="20">
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="QQ 链接" prop="qqUrl">
                      <ElInput
                        v-model="form.qqUrl"
                        placeholder="https://wpa.qq.com/xxx"
                        clearable
                        maxlength="200"
                      >
                        <template #prefix
                          ><ArtSvgIcon icon="ri:qq-line" class="text-[#1296db]"
                        /></template>
                      </ElInput>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="GitHub 链接" prop="githubUrl">
                      <ElInput
                        v-model="form.githubUrl"
                        placeholder="https://github.com/xxx"
                        clearable
                        maxlength="200"
                      >
                        <template #prefix><ArtSvgIcon icon="ri:github-line" /></template>
                      </ElInput>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="Gitee 链接" prop="giteeUrl" class="!mb-0">
                      <ElInput
                        v-model="form.giteeUrl"
                        placeholder="https://gitee.com/xxx"
                        clearable
                        maxlength="200"
                      >
                        <template #prefix
                          ><ArtSvgIcon icon="ri:git-repository-line" class="text-[#c71d23]"
                        /></template>
                      </ElInput>
                    </ElFormItem>
                  </ElCol>
                </ElRow>
              </div>
            </ElCard>

            <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
              <div class="card-heading">
                <div>
                  <h3>服务连接</h3>
                  <p>用于前台实时通知、在线状态等即时通信功能</p>
                </div>
              </div>
              <div class="card-body">
                <ElFormItem label="WebSocket 地址" prop="websocketUrl" class="!mb-0">
                  <ElInput
                    v-model="form.websocketUrl"
                    placeholder="wss://example.com/ws"
                    clearable
                    maxlength="200"
                  >
                    <template #prefix><ArtSvgIcon icon="ri:radio-2-line" /></template>
                  </ElInput>
                  <p class="field-help"
                    >生产环境建议使用加密协议 wss://，修改后请确认前台服务可以正常连接。</p
                  >
                </ElFormItem>
              </div>
            </ElCard>
          </section>

          <!-- 评论与留言 -->
          <section v-show="activeTab === 'comment'" class="setting-panel">
            <div class="panel-heading">
              <span class="panel-icon"><ArtSvgIcon icon="ri:chat-settings-line" /></span>
              <div>
                <h2>评论与留言</h2>
                <p>管理内容审核、邮件提醒以及敏感词命中策略</p>
              </div>
            </div>

            <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
              <div class="card-heading">
                <div>
                  <h3>内容审核</h3>
                  <p>控制访客内容发布前是否需要管理员确认</p>
                </div>
                <span class="card-heading-icon"><ArtSvgIcon icon="ri:shield-check-line" /></span>
              </div>
              <div class="setting-rows">
                <div class="switch-row">
                  <div>
                    <strong>评论审核</strong>
                    <p>开启后，新评论需要管理员审核通过才会公开展示</p>
                  </div>
                  <ElSwitch
                    v-model="form.enableCommentReview"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </div>
                <div class="switch-row">
                  <div>
                    <strong>留言审核</strong>
                    <p>开启后，新留言需要管理员审核通过才会公开展示</p>
                  </div>
                  <ElSwitch
                    v-model="form.enableMessageReview"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </div>
              </div>
            </ElCard>

            <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
              <div class="card-heading">
                <div>
                  <h3>邮件通知</h3>
                  <p>选择需要通过邮件及时提醒的互动事件</p>
                </div>
                <span class="card-heading-icon"><ArtSvgIcon icon="ri:mail-send-line" /></span>
              </div>
              <div class="setting-rows">
                <div class="switch-row">
                  <div>
                    <strong>新评论通知</strong>
                    <p>网站收到新评论时向管理员发送提醒邮件</p>
                  </div>
                  <ElSwitch
                    v-model="form.enableCommentEmailNotice"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </div>
                <div class="switch-row">
                  <div>
                    <strong>评论审核结果通知</strong>
                    <p>评论审核通过后，向评论用户发送结果通知</p>
                  </div>
                  <ElSwitch
                    v-model="form.enableCommentReviewNotice"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </div>
                <div class="switch-row">
                  <div>
                    <strong>留言审核结果通知</strong>
                    <p>留言审核通过后，向留言用户发送结果通知</p>
                  </div>
                  <ElSwitch
                    v-model="form.enableMessageReviewNotice"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </div>
              </div>
            </ElCard>

            <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
              <div class="card-heading">
                <div>
                  <h3>敏感词策略</h3>
                  <p>分别设置评论和留言命中敏感词后的处理方式</p>
                </div>
                <span class="card-heading-icon"><ArtSvgIcon icon="ri:filter-3-line" /></span>
              </div>
              <div class="card-body policy-body">
                <ElRow :gutter="20">
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="评论处理策略" prop="commentIllegalPolicy">
                      <ElSelect v-model="form.commentIllegalPolicy" class="w-full">
                        <ElOption
                          v-for="item in illegalPolicyOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                      <p class="field-help">{{
                        getIllegalPolicyDescription(form.commentIllegalPolicy)
                      }}</p>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="留言处理策略" prop="messageIllegalPolicy" class="!mb-0">
                      <ElSelect v-model="form.messageIllegalPolicy" class="w-full">
                        <ElOption
                          v-for="item in illegalPolicyOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                      <p class="field-help">{{
                        getIllegalPolicyDescription(form.messageIllegalPolicy)
                      }}</p>
                    </ElFormItem>
                  </ElCol>
                </ElRow>
              </div>
            </ElCard>
          </section>

          <div class="setting-footer">
            <div class="footer-state">
              <ArtSvgIcon :icon="isDirty ? 'ri:edit-circle-line' : 'ri:checkbox-circle-line'" />
              <span>{{ isDirty ? '配置已修改，保存后生效' : '当前配置已是最新状态' }}</span>
            </div>
            <div class="footer-actions">
              <ElButton :disabled="!isDirty || submitting" @click="handleReset">放弃修改</ElButton>
              <ElButton type="primary" :loading="submitting" @click="handleSubmit"
                >保存配置</ElButton
              >
            </div>
          </div>
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
  import { fetchSettingInfo, fetchUpdateSetting, fetchUploadImage } from '@/apis/setting';
  import { ElMessageBox } from 'element-plus';
  import type { FormInstance, FormRules, UploadFile } from 'element-plus';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import AvatarCropperDialog from '@/views/system/user/modules/avatar-cropper-dialog.vue';

  defineOptions({ name: 'Setting' });

  const formRef = ref<FormInstance>();
  const submitting = ref(false);
  const loading = ref(false);
  const activeTab = ref('base');
  const savedSnapshot = ref('');

  const settingNavItems = [
    {
      name: 'base',
      label: '基础资料',
      description: '品牌与网站信息',
      icon: 'ri:global-line'
    },
    {
      name: 'links',
      label: '社交与连接',
      description: '主页链接与通信服务',
      icon: 'ri:links-line'
    },
    {
      name: 'comment',
      label: '评论与留言',
      description: '审核、通知与敏感词',
      icon: 'ri:chat-settings-line'
    }
  ] as const;

  // 图片上传相关
  const cropDialogVisible = ref(false);
  const cropImageFile = ref<File | null>(null);
  const avatarField = ref<'siteAvatar' | 'defaultUserAvatar'>('siteAvatar');

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
    siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }]
  };

  /** 敏感词处理选项：0-拦截 1-转审核 2-替换发布 */
  const illegalPolicyOptions = [
    { label: '拦截', value: 0, description: '拒绝发布，并提示用户修改内容后重试。' },
    { label: '转审核', value: 1, description: '内容进入待审核列表，由管理员决定是否发布。' },
    { label: '替换发布', value: 2, description: '替换命中的敏感内容后直接发布。' }
  ];

  const getIllegalPolicyDescription = (value: number) =>
    illegalPolicyOptions.find((item) => item.value === value)?.description ?? '';

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
  const handleAvatarChange = (
    field: 'siteAvatar' | 'defaultUserAvatar',
    uploadFile: UploadFile
  ) => {
    if (!uploadFile.raw) return;
    avatarField.value = field;
    cropImageFile.value = uploadFile.raw;
    cropDialogVisible.value = true;
  };

  /** 裁剪保存 → 上传图片并回填字段 */
  const handleCropSave = async (file: File) => {
    try {
      const url = await fetchUploadImage(file);
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
      // 基础资料是目前唯一包含必填校验的分类，校验失败时自动定位
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
    max-width: 1180px;
    margin: 0 auto;
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

  .page-title-icon,
  .panel-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 11%, transparent);
  }

  .page-title-icon {
    width: 36px;
    height: 36px;
    font-size: 19px;
    border-radius: 11px;
  }

  .header-actions,
  .footer-actions {
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

  .setting-nav {
    position: sticky;
    top: 16px;
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

  .nav-item {
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
      background: color-mix(in srgb, var(--theme-color) 10%, transparent);

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

  .setting-content {
    min-width: 0;
  }

  .setting-panel {
    animation: panel-in 0.22s ease-out;
  }

  .panel-heading {
    display: flex;
    gap: 12px;
    align-items: center;
    min-height: 52px;
    padding: 0 4px;
    margin-bottom: 16px;

    h2 {
      font-size: 17px;
      font-weight: 600;
      color: var(--art-gray-900);
    }

    p {
      margin-top: 3px;
      font-size: 12px;
      color: var(--art-gray-600);
    }
  }

  .panel-icon {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    font-size: 19px;
    border-radius: 11px;
  }

  .config-card {
    margin-bottom: 18px;
    overflow: hidden;
  }

  .card-heading {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    border-bottom: 1px solid var(--art-card-border);

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--art-gray-800);
    }

    p {
      margin-top: 4px;
      font-size: 12px;
      color: var(--art-gray-500);
    }
  }

  .card-heading-icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    font-size: 17px;
    color: var(--art-gray-600);
    background: var(--art-gray-200);
    border-radius: 9px;
  }

  .card-body {
    padding: 22px;

    :deep(.el-form-item__label) {
      padding-bottom: 7px;
      font-weight: 500;
      line-height: 1.3;
      color: var(--art-gray-700);
    }
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    padding: 20px 22px 22px;
  }

  .media-setting {
    display: flex;
    gap: 16px;
    align-items: center;
    min-width: 0;
    padding: 16px;
    background: var(--art-gray-100);
    border: 1px solid var(--art-card-border);
    border-radius: calc(var(--custom-radius) / 2 + 5px);
  }

  .avatar-frame,
  .avatar-preview,
  .avatar-placeholder {
    width: 88px;
    height: 88px;
    border-radius: 13px;
  }

  .avatar-frame {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      .avatar-mask {
        opacity: 1;
      }

      .avatar-preview,
      .avatar-placeholder {
        transform: scale(1.04);
      }
    }
  }

  .avatar-preview,
  .avatar-placeholder {
    transition: transform 0.25s ease;
  }

  .avatar-placeholder {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: var(--art-gray-500);
    background: var(--default-box-color);
    border: 1px dashed var(--art-gray-400);
  }

  .avatar-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #fff;
    background: rgb(15 23 42 / 56%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .media-copy {
    min-width: 0;

    strong {
      font-size: 14px;
      font-weight: 600;
      color: var(--art-gray-800);
    }

    p {
      margin-top: 5px;
      font-size: 12px;
      line-height: 1.6;
      color: var(--art-gray-600);
    }

    span {
      display: block;
      margin-top: 8px;
      font-size: 11px;
      line-height: 1.5;
      color: var(--art-gray-500);
    }
  }

  .setting-rows {
    padding: 0 22px;
  }

  .switch-row {
    display: flex;
    gap: 28px;
    align-items: center;
    justify-content: space-between;
    min-height: 76px;
    padding: 14px 2px;
    border-bottom: 1px solid var(--art-card-border);

    &:last-child {
      border-bottom: 0;
    }

    > div {
      min-width: 0;
    }

    strong {
      font-size: 13px;
      font-weight: 500;
      color: var(--art-gray-800);
    }

    p {
      margin-top: 5px;
      font-size: 12px;
      line-height: 1.5;
      color: var(--art-gray-500);
    }

    :deep(.el-switch) {
      flex-shrink: 0;
    }
  }

  .field-help {
    width: 100%;
    margin-top: 8px;
    font-size: 11px;
    line-height: 1.5;
    color: var(--art-gray-500);
  }

  .policy-body {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .setting-footer {
    display: flex;
    gap: 18px;
    align-items: center;
    justify-content: space-between;
    min-height: 68px;
    padding: 12px 16px 12px 20px;
    background: var(--default-box-color);
    border: 1px solid var(--art-card-border);
    border-radius: calc(var(--custom-radius) + 4px);
    box-shadow: 0 8px 24px rgb(31 41 55 / 6%);
  }

  .footer-state {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 12px;
    color: var(--art-gray-600);

    > svg {
      font-size: 17px;
      color: var(--theme-color);
    }
  }

  @keyframes panel-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
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

    .media-grid {
      grid-template-columns: 1fr;
    }

    .media-setting {
      min-height: 122px;
    }
  }

  @media screen and (width <= 760px) {
    .page-header {
      flex-direction: column;
      padding-bottom: 18px;
    }

    .header-actions {
      width: 100%;

      .el-button:last-child {
        flex: 1;
      }
    }

    .setting-layout {
      display: block;
    }

    .setting-nav {
      position: static;
      display: flex;
      gap: 6px;
      padding: 8px;
      margin-bottom: 18px;
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

    .panel-heading {
      margin-bottom: 12px;
    }

    .setting-footer {
      flex-direction: column;
      align-items: stretch;
      padding: 14px;
    }

    .footer-state {
      justify-content: center;
    }

    .footer-actions {
      display: grid;
      grid-template-columns: 1fr 1.5fr;

      .el-button {
        width: 100%;
        margin: 0;
      }
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

    .header-actions .el-button:first-of-type {
      display: none;
    }

    .card-heading,
    .card-body,
    .media-grid {
      padding-right: 16px;
      padding-left: 16px;
    }

    .card-heading-icon {
      display: none;
    }

    .media-setting {
      align-items: flex-start;
      padding: 14px;
    }

    .avatar-frame,
    .avatar-preview,
    .avatar-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 11px;
    }

    .media-copy span {
      display: none;
    }

    .setting-rows {
      padding: 0 16px;
    }

    .switch-row {
      gap: 18px;
    }
  }
</style>
