<!-- 个人中心页面 -->
<template>
  <div class="user-center-page pb-5">
    <div class="flex-b gap-5 items-start max-md:block">
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
              <div class="auth-binding-item !w-full !justify-start gap-2">
                <ArtSvgIcon icon="ri:user-star-line" class="text-base text-[#e6a23c] shrink-0" />
                <span v-if="!profile.roles?.length" class="text-sm text-g-400">暂无角色</span>
                <span
                  v-else
                  class="flex flex-1 items-center flex-nowrap overflow-hidden min-w-0 text-sm text-g-600"
                >
                  <span class="flex flex-1 items-center min-w-0 overflow-hidden">
                    <ElTag
                      v-for="role in visibleRoles"
                      :key="role.id"
                      type="info"
                      size="small"
                      class="role-tag"
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
                <span class="text-sm text-g-600 truncate">{{ lastLoginText }}</span>
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
            <ElButton type="primary" :loading="passwordSubmitting" @click="togglePasswordEdit">
              {{ isPasswordEdit ? '保存' : '编辑' }}
            </ElButton>
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
      <div class="flex-1 min-w-0 max-md:mt-3.5">
        <!-- 基本设置 -->
        <ElCard class="art-card setting-card mb-5" :body-style="{ padding: '24px' }">
          <div class="flex-b items-center px-1 pb-4 border-b border-g-300/60">
            <h1 class="text-lg font-medium text-g-800">基本设置</h1>
            <ElButton type="primary" :loading="profileSubmitting" @click="toggleProfileEdit">
              {{ isProfileEdit ? '保存' : '编辑' }}
            </ElButton>
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
            <ElFormItem label="邮箱" prop="email" required>
              <ElInput
                v-model="profileForm.email"
                :disabled="!isProfileEdit"
                placeholder="请输入邮箱"
                maxlength="100"
                @blur="profileForm.email = profileForm.email.trim()"
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
                :rows="4"
                :disabled="!isProfileEdit"
                placeholder="介绍一下自己..."
                maxlength="100"
                show-word-limit
                @blur="profileForm.intro = (profileForm.intro || '').trim()"
              />
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
  import type { UserProfileInfo, UpdateProfileParams } from '@/apis/user-center';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import AvatarCropperDialog from '@/views/system/user/modules/avatar-cropper-dialog.vue';
  import { formatDateTime } from '@/utils/format';
  import avatarImg from '@/assets/images/user/avatar.webp';

  defineOptions({ name: 'UserCenter' });

  // ============================================================
  // Mock 数据
  // ============================================================

  /** 当前用户详情 Mock */
  const profile = reactive<UserProfileInfo>({
    userId: 'usr_a1b2c3d4',
    nickname: '张三',
    email: 'zhangsan@example.com',
    avatar: avatarImg,
    website: 'https://zhangsan.dev',
    intro: '全栈开发工程师，热爱开源与技术分享。',
    lastLoginTime: '2026-06-27T10:30:00',
    createTime: '2025-03-15T08:00:00',
    qqBound: true,
    weiboBound: false,
    roles: [
      { id: 1, roleName: '管理员' },
      { id: 2, roleName: '编辑者' },
      { id: 3, roleName: '访客' },
      { id: 4, roleName: '测试' },
      { id: 5, roleName: '测试111' }
    ]
  });

  const lastLoginText = computed(() => {
    return profile.lastLoginTime ? formatDateTime(profile.lastLoginTime) : '暂无记录';
  });

  const MAX_SHOW = 2;
  const visibleRoles = computed(() => profile.roles.slice(0, MAX_SHOW));
  const overflowRoles = computed(() => profile.roles.slice(MAX_SHOW));

  // ============================================================
  // 编辑/保存切换
  // ============================================================

  const isProfileEdit = ref(false);
  const isPasswordEdit = ref(false);

  // ============================================================
  // 基本设置
  // ============================================================

  const profileFormRef = ref<FormInstance>();
  const profileSubmitting = ref(false);

  const profileForm = reactive<UpdateProfileParams>({
    nickname: profile.nickname,
    email: profile.email,
    avatar: profile.avatar,
    website: profile.website || '',
    intro: profile.intro || ''
  });

  const syncProfileForm = () => {
    profileForm.nickname = profile.nickname;
    profileForm.email = profile.email;
    profileForm.avatar = profile.avatar;
    profileForm.website = profile.website || '';
    profileForm.intro = profile.intro || '';
  };

  const profileRules: FormRules = {
    nickname: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    website: [{ max: 200, message: '长度不超过 200 个字符', trigger: 'blur' }]
  };

  /**
   * 切换基本设置编辑状态
   */
  const toggleProfileEdit = async () => {
    if (isProfileEdit.value) {
      // 保存
      if (!profileFormRef.value || profileSubmitting.value) return;
      try {
        await profileFormRef.value.validate();
        profileSubmitting.value = true;

        // Mock 保存
        await new Promise((resolve) => setTimeout(resolve, 600));

        profile.nickname = profileForm.nickname;
        profile.email = profileForm.email;
        profile.avatar = profileForm.avatar;
        profile.website = profileForm.website || null;
        profile.intro = profileForm.intro || null;

        ElMessage.success('个人资料更新成功');
        isProfileEdit.value = false;
      } catch {
        // 校验失败
      } finally {
        profileSubmitting.value = false;
      }
    } else {
      // 进入编辑
      syncProfileForm();
      isProfileEdit.value = true;
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
    profileForm.avatar = url;
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

  /**
   * 切换密码编辑状态
   */
  const togglePasswordEdit = async () => {
    if (isPasswordEdit.value) {
      // 保存
      if (!passwordFormRef.value || passwordSubmitting.value) return;
      try {
        await passwordFormRef.value.validate();
        passwordSubmitting.value = true;

        // Mock 保存
        await new Promise((resolve) => setTimeout(resolve, 600));

        ElMessage.success('密码修改成功');
        passwordFormRef.value.resetFields();
        isPasswordEdit.value = false;
      } catch {
        // 校验失败
      } finally {
        passwordSubmitting.value = false;
      }
    } else {
      // 进入编辑
      isPasswordEdit.value = true;
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
    background: #fafafa;
    border-radius: 8px;
  }

  .auth-platform {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    color: #303133;
  }

  .auth-bound {
    color: #67c23a;
    font-size: 13px;
  }

  .auth-unbound {
    color: #c0c4cc;
    font-size: 13px;
  }

  .role-tag {
    flex: 1 1 0;
    min-width: 0;
    margin-right: 4px;

    :deep(.el-tag__content) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
