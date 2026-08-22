<!-- 个人中心页面 -->
<template>
  <div class="user-center-page pb-5">
    <div class="flex-b gap-5 items-stretch max-md:block">
      <!-- 左侧：个人信息卡片 -->
      <div class="w-[45%] shrink-0 max-md:w-full">
        <ElCard class="art-card profile-card" :body-style="{ padding: 0 }">
          <div class="pb-9">
            <!-- 顶部：头像 + 基本信息 -->
            <div class="flex items-center gap-5 px-6 pt-6 pb-5">
              <ElUpload
                class="avatar-upload-wrapper shrink-0"
                :auto-upload="false"
                :show-file-list="false"
                accept="image/*"
                @change="handleAvatarChange"
              >
                <ElImage
                  class="size-18 rounded-md cursor-pointer object-cover"
                  :src="profile.avatar"
                  fit="cover"
                />
              </ElUpload>
              <div class="min-w-0">
                <h2 class="text-xl font-medium text-g-800">{{ profile.nickname }}</h2>
                <p class="mt-1 text-sm text-g-500 truncate">{{
                  profile.intro || '这个人很懒，什么都没写~'
                }}</p>
              </div>
            </div>

            <!-- 详细信息 -->
            <div class="grid grid-cols-2 gap-3 px-6 pt-5">
              <div class="auth-binding-item !w-full !justify-start gap-2">
                <ArtSvgIcon icon="ri:mail-line" class="text-base text-[#409eff] shrink-0" />
                <ElTooltip :content="profile.email" placement="top" :show-after="500">
                  <span class="max-w-[80%] text-sm text-g-600 truncate">{{ profile.email }}</span>
                </ElTooltip>
              </div>
              <div class="auth-binding-item !w-full !justify-start gap-2">
                <ArtSvgIcon icon="ri:links-line" class="text-base text-[#67c23a] shrink-0" />
                <ElTooltip :content="profile.website || '未填写'" placement="top" :show-after="500">
                  <span class="max-w-[80%] text-sm text-g-600 truncate">
                    {{ profile.website || '未填写' }}
                  </span>
                </ElTooltip>
              </div>
              <div ref="roleInfoRef" class="auth-binding-item !w-full !justify-start gap-2">
                <ArtSvgIcon icon="ri:user-star-line" class="text-base text-[#e6a23c] shrink-0" />
                <span v-if="!profile.roles?.length" class="text-sm text-g-400">暂无角色</span>
                <span
                  v-else
                  class="flex flex-1 items-center flex-nowrap overflow-hidden min-w-0 text-sm text-g-600"
                >
                  <span class="flex items-center min-w-0 overflow-hidden">
                    <ElTag
                      v-for="role in visibleRoles"
                      :key="role.id"
                      type="info"
                      size="small"
                      class="role-tag max-w-[80px]"
                    >
                      {{ role.roleName }}
                    </ElTag>
                  </span>
                  <ElPopover
                    v-if="overflowRoles.length > 0"
                    trigger="hover"
                    placement="top"
                    :show-arrow="false"
                    :popper-style="{ padding: '8px' }"
                    class="shrink-0"
                  >
                    <template #reference>
                      <ElTag type="info" size="small" class="cursor-pointer shrink-0"
                        >+{{ overflowRoles.length }}</ElTag
                      >
                    </template>
                    <div class="flex flex-wrap gap-1">
                      <ElTag v-for="role in profile.roles" :key="role.id" type="info" size="small">
                        {{ role.roleName }}
                      </ElTag>
                    </div>
                  </ElPopover>
                </span>
              </div>
              <div class="auth-binding-item !w-full !justify-start gap-2">
                <ArtSvgIcon icon="ri:time-line" class="text-base text-[#909399] shrink-0" />
                <span class="text-sm text-g-600 truncate">{{ createTimeText }}</span>
              </div>
            </div>

            <!-- 第三方绑定 -->
            <div class="mt-5 border-t border-g-300/60 px-6">
              <h3 class="mt-5 text-sm font-medium text-g-700">第三方账号绑定</h3>
              <div class="auth-binding-row mt-3 pb-6">
                <div class="auth-binding-item">
                  <div class="auth-platform">
                    <ArtSvgIcon icon="ri:qq-line" class="text-xl text-[#1296db]" />
                    <span>QQ</span>
                  </div>
                  <span v-if="profile.qqBound" class="auth-bound">已绑定</span>
                  <span v-else class="auth-unbound">未绑定</span>
                </div>
                <div class="auth-binding-item">
                  <div class="auth-platform">
                    <ArtSvgIcon icon="ri:weibo-line" class="text-xl text-[#e6162d]" />
                    <span>微博</span>
                  </div>
                  <span v-if="profile.weiboBound" class="auth-bound">已绑定</span>
                  <span v-else class="auth-unbound">未绑定</span>
                </div>
              </div>
            </div>
          </div>
        </ElCard>

        <!-- 更改密码 -->
        <ElCard class="art-card setting-card mt-5" :body-style="{ padding: '24px' }">
          <div class="flex-b items-center px-1 pb-4 border-b border-g-300/60">
            <h1 class="text-lg font-medium text-g-800">更改密码</h1>
            <template v-if="isPasswordEdit">
              <div class="flex gap-2">
                <ElButton @click="cancelPasswordEdit">取消</ElButton>
                <ElButton type="primary" :loading="passwordSubmitting" @click="savePassword">
                  保存
                </ElButton>
              </div>
            </template>
            <ElButton v-else type="primary" @click="enterPasswordEdit">编辑</ElButton>
          </div>

          <ElForm
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="86px"
            label-position="top"
            class="pt-5"
          >
            <ElFormItem label="当前密码" prop="oldPassword" required>
              <ElInput
                v-model="passwordForm.oldPassword"
                type="password"
                :disabled="!isPasswordEdit"
                placeholder="请输入当前密码"
                show-password
                maxlength="20"
                @input="(val: string) => (passwordForm.oldPassword = val.replace(/\s/g, ''))"
              />
            </ElFormItem>
            <ElFormItem label="新密码" prop="newPassword" required>
              <ElInput
                v-model="passwordForm.newPassword"
                type="password"
                :disabled="!isPasswordEdit"
                placeholder="请输入新密码，6~20位"
                show-password
                maxlength="20"
                @input="(val: string) => (passwordForm.newPassword = val.replace(/\s/g, ''))"
              />
            </ElFormItem>
            <ElFormItem label="确认新密码" prop="confirmPassword" required>
              <ElInput
                v-model="passwordForm.confirmPassword"
                type="password"
                :disabled="!isPasswordEdit"
                placeholder="请再次输入新密码"
                show-password
                maxlength="20"
                @input="(val: string) => (passwordForm.confirmPassword = val.replace(/\s/g, ''))"
              />
            </ElFormItem>
          </ElForm>
        </ElCard>
      </div>

      <!-- 右侧：设置表单 -->
      <div class="flex-1 flex flex-col min-w-0 max-md:mt-3.5">
        <!-- 基本设置 -->
        <ElCard class="art-card setting-card" :body-style="{ padding: '24px' }">
          <div class="flex-b items-center px-1 pb-4 border-b border-g-300/60">
            <h1 class="text-lg font-medium text-g-800">基本设置</h1>
            <template v-if="isProfileEdit">
              <div class="flex gap-2">
                <ElButton @click="cancelProfileEdit">取消</ElButton>
                <ElButton type="primary" :loading="profileSubmitting" @click="saveProfile">
                  保存
                </ElButton>
              </div>
            </template>
            <ElButton v-else type="primary" @click="enterProfileEdit">编辑</ElButton>
          </div>

          <ElForm
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="86px"
            label-position="top"
            class="pt-5"
          >
            <ElFormItem label="昵称" prop="nickname" required>
              <ElInput
                v-model="profileForm.nickname"
                :disabled="!isProfileEdit"
                placeholder="请输入昵称"
                maxlength="20"
                @blur="profileForm.nickname = profileForm.nickname.trim()"
              />
            </ElFormItem>
            <ElFormItem label="个人网站" prop="website">
              <ElInput
                v-model="profileForm.website"
                :disabled="!isProfileEdit"
                placeholder="请输入个人网站"
                maxlength="200"
              />
            </ElFormItem>
            <ElFormItem label="个人简介" prop="intro">
              <ElInput
                v-model="profileForm.intro"
                type="textarea"
                :rows="5"
                :disabled="!isProfileEdit"
                placeholder="介绍一下自己..."
                maxlength="100"
                show-word-limit
                @blur="profileForm.intro = (profileForm.intro || '').trim()"
              />
            </ElFormItem>
          </ElForm>
        </ElCard>

        <!-- 更改邮箱 -->
        <ElCard class="art-card setting-card mt-5" :body-style="{ padding: '24px' }">
          <div class="flex-b items-center px-1 pb-4 border-b border-g-300/60">
            <h1 class="text-lg font-medium text-g-800">更改邮箱</h1>
            <template v-if="isEmailEdit">
              <div class="flex gap-2">
                <ElButton @click="cancelEmailEdit">取消</ElButton>
                <ElButton type="primary" :loading="emailSubmitting" @click="saveEmail">
                  保存
                </ElButton>
              </div>
            </template>
            <ElButton v-else type="primary" @click="enterEmailEdit">编辑</ElButton>
          </div>

          <ElForm
            ref="emailFormRef"
            :model="emailForm"
            :rules="emailRules"
            label-width="86px"
            label-position="top"
            class="pt-5"
          >
            <ElFormItem label="新邮箱" prop="email" required>
              <ElInput
                v-model="emailForm.email"
                :disabled="!isEmailEdit"
                placeholder="请输入新邮箱"
                maxlength="100"
                @blur="emailForm.email = emailForm.email.trim()"
              />
            </ElFormItem>
            <ElFormItem label="验证码" prop="code" required>
              <div class="flex gap-3">
                <ElInput
                  v-model="emailForm.code"
                  :disabled="!isEmailEdit"
                  placeholder="请输入验证码"
                  maxlength="6"
                  class="flex-1"
                />
                <ElButton
                  :disabled="!isEmailEdit || codeCountdown > 0"
                  :loading="isSendingCode"
                  @click="sendChangeEmailCode"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
                </ElButton>
              </div>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </div>
    </div>

    <!-- 头像裁剪弹窗 -->
    <AvatarCropperDialog
      v-model="cropDialogVisible"
      :image-file="cropImageFile"
      @save="handleCropSave"
      @error="(msg: string) => ElMessage.error(msg)"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus';
  import type { FormInstance, FormRules, UploadFile } from 'element-plus';
  import { fetchGetUserInfo } from '@/apis/auth';
  import type { UserInfo } from '@/apis/auth/types';
  import {
    fetchUpdateProfile,
    fetchChangePassword,
    fetchSendChangeEmailCode,
    fetchChangeEmail
  } from '@/apis/user-center';
  import type { UpdateProfileParams } from '@/apis/user-center';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import AvatarCropperDialog from '@/views/system/user/modules/avatar-cropper-dialog.vue';
  import { formatDateTime } from '@/utils/format';

  defineOptions({ name: 'UserCenter' });

  // ============================================================
  // 用户信息
  // ============================================================

  const profile = reactive<UserInfo>({
    userId: '',
    nickname: '',
    email: '',
    avatar: '',
    website: '',
    intro: '',
    createTime: '',
    qqBound: false,
    weiboBound: false,
    roles: []
  });

  const loading = ref(true);

  const loadProfile = async () => {
    loading.value = true;
    try {
      const data = await fetchGetUserInfo();
      Object.assign(profile, data);
      syncProfileForm();
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadProfile();
  });

  const createTimeText = computed(() => {
    return profile.createTime ? formatDateTime(profile.createTime) : '暂无记录';
  });

  const roleInfoRef = ref<HTMLElement>();
  const visibleRoleCount = ref(2);
  const visibleRoles = computed(() => profile.roles.slice(0, visibleRoleCount.value));
  const overflowRoles = computed(() => profile.roles.slice(visibleRoleCount.value));

  /** 根据角色信息格的实际宽度调整展示数量，避免窄屏下所有角色同时被截断。 */
  useResizeObserver(roleInfoRef, (entries) => {
    const width = entries[0]?.contentRect.width ?? 0;
    if (width >= 330) {
      visibleRoleCount.value = 3;
    } else if (width >= 220) {
      visibleRoleCount.value = 2;
    } else {
      visibleRoleCount.value = 1;
    }
  });

  // ============================================================
  // 编辑/保存切换
  // ============================================================

  const isProfileEdit = ref(false);
  const isPasswordEdit = ref(false);
  const isEmailEdit = ref(false);

  // ============================================================
  // 基本设置
  // ============================================================

  const profileFormRef = ref<FormInstance>();
  const profileSubmitting = ref(false);

  const profileForm = reactive<UpdateProfileParams>({
    nickname: profile.nickname,
    website: profile.website || '',
    intro: profile.intro || ''
  });

  const syncProfileForm = () => {
    profileForm.nickname = profile.nickname;
    profileForm.website = profile.website || '';
    profileForm.intro = profile.intro || '';
  };

  const profileRules: FormRules = {
    nickname: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    website: [{ max: 200, message: '长度不超过 200 个字符', trigger: 'blur' }]
  };

  /** 进入基本设置编辑 */
  const enterProfileEdit = () => {
    syncProfileForm();
    isProfileEdit.value = true;
  };

  /** 取消基本设置编辑 */
  const cancelProfileEdit = () => {
    syncProfileForm();
    isProfileEdit.value = false;
  };

  /** 保存基本设置 */
  const saveProfile = async () => {
    if (!profileFormRef.value || profileSubmitting.value) return;
    try {
      await profileFormRef.value.validate();
      profileSubmitting.value = true;

      await fetchUpdateProfile({
        ...profileForm,
        nickname: profileForm.nickname.trim()
      });

      profile.nickname = profileForm.nickname;
      profile.website = profileForm.website || '';
      profile.intro = profileForm.intro || '';

      ElMessage.success('个人资料更新成功');
      isProfileEdit.value = false;
    } catch {
      // 校验失败
    } finally {
      profileSubmitting.value = false;
    }
  };

  // ============================================================
  // 头像上传
  // ============================================================

  const cropDialogVisible = ref(false);
  const cropImageFile = ref<File | null>(null);

  const handleAvatarChange = (uploadFile: UploadFile) => {
    if (!uploadFile.raw) return;
    cropImageFile.value = uploadFile.raw;
    cropDialogVisible.value = true;
  };

  const handleCropSave = async (file: File) => {
    // Mock 上传
    const url = URL.createObjectURL(file);
    profile.avatar = url;
    ElMessage.success('头像更新成功');
  };

  // ============================================================
  // 更改密码
  // ============================================================

  const passwordFormRef = ref<FormInstance>();
  const passwordSubmitting = ref(false);

  const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validateConfirmPassword = (
    _rule: unknown,
    value: string,
    callback: (err?: Error) => void
  ) => {
    if (value !== passwordForm.newPassword) {
      callback(new Error('两次输入的新密码不一致'));
    } else {
      callback();
    }
  };

  const passwordRules: FormRules = {
    oldPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' }
    ]
  };

  /** 进入密码编辑 */
  const enterPasswordEdit = () => {
    isPasswordEdit.value = true;
  };

  /** 取消密码编辑 */
  const cancelPasswordEdit = () => {
    passwordFormRef.value?.resetFields();
    isPasswordEdit.value = false;
  };

  /** 保存密码 */
  const savePassword = async () => {
    if (!passwordFormRef.value || passwordSubmitting.value) return;
    try {
      await passwordFormRef.value.validate();
      passwordSubmitting.value = true;

      await fetchChangePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });

      ElMessage.success('密码修改成功');
      passwordFormRef.value.resetFields();
      isPasswordEdit.value = false;
    } catch {
      // 校验失败
    } finally {
      passwordSubmitting.value = false;
    }
  };

  // ============================================================
  // 更改邮箱
  // ============================================================

  const emailFormRef = ref<FormInstance>();
  const emailSubmitting = ref(false);
  const isSendingCode = ref(false);
  const codeCountdown = ref(0);
  let codeTimer: ReturnType<typeof setInterval> | null = null;

  const emailForm = reactive({
    email: '',
    code: ''
  });

  const emailRules: FormRules = {
    email: [
      { required: true, message: '请输入新邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  };

  const startCodeCountdown = () => {
    codeCountdown.value = 60;
    codeTimer = setInterval(() => {
      codeCountdown.value--;
      if (codeCountdown.value <= 0) {
        if (codeTimer) clearInterval(codeTimer);
        codeTimer = null;
      }
    }, 1000);
  };

  const sendChangeEmailCode = async () => {
    if (!emailForm.email) {
      ElMessage.warning('请先输入新邮箱');
      return;
    }
    isSendingCode.value = true;
    try {
      await fetchSendChangeEmailCode({ email: emailForm.email.trim(), purpose: 4 });
      ElMessage.success('验证码已发送');
      startCodeCountdown();
    } catch {
      // 接口已处理错误提示
    } finally {
      isSendingCode.value = false;
    }
  };

  /** 进入邮箱编辑 */
  const enterEmailEdit = () => {
    emailForm.email = '';
    emailForm.code = '';
    isEmailEdit.value = true;
  };

  /** 取消邮箱编辑 */
  const cancelEmailEdit = () => {
    emailFormRef.value?.resetFields();
    isEmailEdit.value = false;
  };

  /** 保存邮箱 */
  const saveEmail = async () => {
    if (!emailFormRef.value || emailSubmitting.value) return;
    try {
      await emailFormRef.value.validate();
      emailSubmitting.value = true;

      await fetchChangeEmail({
        newEmail: emailForm.email.trim(),
        code: emailForm.code
      });

      profile.email = emailForm.email.trim();
      ElMessage.success('邮箱修改成功');
      emailFormRef.value.resetFields();
      isEmailEdit.value = false;
    } catch {
      // 校验失败
    } finally {
      emailSubmitting.value = false;
    }
  };
</script>

<style scoped lang="scss">
  .profile-card {
    overflow: hidden;
    border-radius: calc(var(--custom-radius) + 2px);

    :deep(.el-card__body) {
      padding: 0;
    }
  }

  .setting-card {
    border-radius: calc(var(--custom-radius) + 2px);

    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .auth-binding-row {
    display: flex;
    justify-content: space-around;
    gap: 16px;
  }

  .auth-binding-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 45%;
    padding: 8px 14px;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
  }

  .auth-platform {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .auth-bound {
    color: #67c23a;
    font-size: 13px;
  }

  .auth-unbound {
    color: var(--el-text-color-placeholder);
    font-size: 13px;
  }

  .role-tag {
    flex: 0 1 auto;
    min-width: 0;
    margin-right: 4px;

    :deep(.el-tag__content) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
