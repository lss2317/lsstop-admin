<template>
  <ElDialog
    v-model="visible"
    :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
    width="700px"
    align-center
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="right">
      <!-- 基本信息：两列布局 -->
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="头像" prop="avatar">
            <ElUpload
              class="avatar-upload"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              @change="handleAvatarChange"
            >
              <ElImage v-if="form.avatar" :src="form.avatar" class="avatar-preview" fit="cover" />
              <div v-else class="avatar-placeholder">
                <ArtSvgIcon icon="ri:image-line" class="text-[28px] text-gray-300" />
              </div>
            </ElUpload>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="昵称" prop="nickname" required>
            <ElInput
              v-model="form.nickname"
              placeholder="请输入昵称"
              clearable
              maxlength="20"
              @blur="form.nickname = form.nickname.trim()"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="邮箱" prop="email" required>
            <ElInput
              v-model="form.email"
              placeholder="请输入邮箱"
              clearable
              maxlength="100"
              @blur="form.email = form.email.trim()"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="dialogType === 'add'" :span="12">
          <ElFormItem label="密码" prop="password" required>
            <ElInput
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
              maxlength="32"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="dialogType === 'add'" :span="12">
          <ElFormItem label="确认密码" prop="confirmPassword" required>
            <ElInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              clearable
              maxlength="32"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="个人网站" prop="website">
            <ElInput
              v-model="form.website"
              placeholder="请输入个人网站"
              clearable
              maxlength="255"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="是否启用" prop="status">
            <ElSwitch v-model="form.status" :active-value="1" :inactive-value="0" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="24">
          <ElFormItem label="个人简介" prop="intro">
            <ElInput
              v-model="form.intro"
              type="textarea"
              :rows="2"
              placeholder="请输入个人简介"
              maxlength="100"
              show-word-limit
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <!-- 第三方绑定（仅编辑时显示） -->
      <template v-if="dialogType === 'edit'">
        <ElDivider content-position="left">第三方绑定</ElDivider>
        <div class="auth-binding-row">
          <div class="auth-binding-item">
            <div class="auth-platform">
              <ArtSvgIcon icon="ri:qq-line" class="text-[22px] text-[#1296db]" />
              <span>QQ</span>
            </div>
            <div class="auth-status">
              <span v-if="qqBinding" class="auth-bound">已绑定</span>
              <span v-else class="auth-unbound">未绑定</span>
              <ElPopconfirm
                v-if="qqBinding"
                title="确定解绑该QQ账号？"
                confirm-button-text="解绑"
                cancel-button-text="取消"
                @confirm="unbindAuth(2)"
              >
                <template #reference>
                  <ElButton type="danger" link size="small">解绑</ElButton>
                </template>
              </ElPopconfirm>
            </div>
          </div>
          <div class="auth-binding-item">
            <div class="auth-platform">
              <ArtSvgIcon icon="ri:weibo-line" class="text-[22px] text-[#e6162d]" />
              <span>微博</span>
            </div>
            <div class="auth-status">
              <span v-if="weiboBinding" class="auth-bound">已绑定</span>
              <span v-else class="auth-unbound">未绑定</span>
              <ElPopconfirm
                v-if="weiboBinding"
                title="确定解绑该微博账号？"
                confirm-button-text="解绑"
                cancel-button-text="取消"
                @confirm="unbindAuth(3)"
              >
                <template #reference>
                  <ElButton type="danger" link size="small">解绑</ElButton>
                </template>
              </ElPopconfirm>
            </div>
          </div>
        </div>
      </template>

      <!-- 角色分配 -->
      <ElDivider content-position="left">角色分配</ElDivider>
      <ElFormItem label="角色" prop="roleIds">
        <ElSelect v-model="form.roleIds" placeholder="请选择角色" multiple clearable>
          <ElOption
            v-for="role in roleOptions"
            :key="role.id"
            :label="role.roleName"
            :value="role.id"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="handleClose">取消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules, UploadFile } from 'element-plus';
  import type { UserFormParams, AuthMethodItem } from '@/apis/user/types';
  import type { UserListItem, RoleOption } from '@/apis/user';
  import { MOCK_ROLE_LIST } from '@/apis/user';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  interface Props {
    modelValue: boolean;
    dialogType: 'add' | 'edit';
    userData?: UserListItem;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'success'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    dialogType: 'add',
    userData: undefined
  });

  const emit = defineEmits<Emits>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  /** 弹窗显示状态双向绑定 */
  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  /** 角色下拉选项 */
  const roleOptions = ref<RoleOption[]>(MOCK_ROLE_LIST);

  /** 第三方绑定列表（仅编辑时使用） */
  const authBindings = ref<AuthMethodItem[]>([]);

  /** QQ绑定 */
  const qqBinding = computed(() => authBindings.value.find((a) => a.loginType === 2));

  /** 微博绑定 */
  const weiboBinding = computed(() => authBindings.value.find((a) => a.loginType === 3));

  /** 确认密码校验 */
  const validateConfirmPassword = (
    _rule: unknown,
    value: string,
    callback: (err?: Error) => void
  ) => {
    if (props.dialogType === 'add' && value !== form.password) {
      callback(new Error('两次输入的密码不一致'));
    } else {
      callback();
    }
  };

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    nickname: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' }
    ]
  });

  /**
   * 表单数据
   */
  const form = reactive<UserFormParams>({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    website: '',
    intro: '',
    status: 1,
    roleIds: []
  });

  /** 默认表单值 */
  const defaultForm = (): UserFormParams => ({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    website: '',
    intro: '',
    status: 1,
    roleIds: []
  });

  /**
   * 监听弹窗打开，初始化表单数据
   */
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) initForm();
    }
  );

  /**
   * 监听用户数据变化，更新表单
   */
  watch(
    () => props.userData,
    (newData) => {
      if (newData && props.modelValue) initForm();
    },
    { deep: true }
  );

  /**
   * 初始化表单数据
   */
  const initForm = async () => {
    if (props.dialogType === 'edit' && props.userData) {
      try {
        const { mockFetchUserDetail } = await import('@/apis/user');
        const detail = await mockFetchUserDetail(props.userData.userUid);
        Object.assign(form, {
          userUid: detail.userUid,
          nickname: detail.nickname,
          email: detail.authMethods.find((a) => a.loginType === 1)?.identifier || '',
          avatar: detail.avatar,
          website: detail.website || '',
          intro: detail.intro || '',
          status: detail.status,
          roleIds: [...detail.roleIds]
        });
        // 加载第三方绑定（QQ / 微博）
        authBindings.value = detail.authMethods.filter((a) => a.loginType !== 1);
      } catch {
        // 详情获取失败时，用列表数据兜底
        const roleMap = new Map(roleOptions.value.map((r) => [r.roleName, r.id]));
        Object.assign(form, {
          userUid: props.userData!.userUid,
          nickname: props.userData!.nickname,
          email: props.userData!.email || '',
          avatar: props.userData!.avatar,
          website: '',
          intro: '',
          status: props.userData!.status,
          roleIds: props
            .userData!.roles.map((name) => roleMap.get(name))
            .filter(Boolean) as number[]
        });
        authBindings.value = [];
      }
    } else {
      Object.assign(form, defaultForm());
      form.userUid = undefined;
      form.password = '';
      form.confirmPassword = '';
      authBindings.value = [];
    }
  };

  /**
   * 头像上传变化
   */
  const handleAvatarChange = (uploadFile: UploadFile) => {
    if (!uploadFile.raw) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      form.avatar = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(uploadFile.raw);
  };

  /**
   * 解绑第三方账号
   */
  const unbindAuth = (loginType: number) => {
    authBindings.value = authBindings.value.filter((a) => a.loginType !== loginType);
    ElMessage.success('解绑成功');
  };

  /**
   * 关闭弹窗并重置表单
   */
  const handleClose = () => {
    visible.value = false;
    formRef.value?.resetFields();
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!formRef.value || submitting.value) return;

    try {
      await formRef.value.validate();

      submitting.value = true;

      if (props.dialogType === 'add') {
        const { mockFetchAddUser } = await import('@/apis/user');
        await mockFetchAddUser({ ...form, password: form.password });
        ElMessage.success('新增成功');
      } else {
        const { mockFetchUpdateUser } = await import('@/apis/user');
        await mockFetchUpdateUser({ ...form, userUid: form.userUid! });
        ElMessage.success('修改成功');
      }
      emit('success');
      handleClose();
    } catch {
      // 表单校验失败或接口报错（接口报错由全局拦截器展示）
    } finally {
      submitting.value = false;
    }
  };
</script>

<style scoped lang="scss">
  .avatar-upload {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar-upload :deep(.el-upload) {
    cursor: pointer;
  }

  .avatar-preview,
  .avatar-placeholder {
    width: 64px;
    height: 64px;
    border-radius: 4px;
  }

  .avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    background: #fafafa;
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
    width: 40%;
    padding: 8px 14px;
    background: #fafafa;
    border-radius: 8px;
  }

  .auth-platform {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    color: #303133;
  }

  .auth-status {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .auth-bound {
    color: #67c23a;
    font-size: 13px;
  }

  .auth-unbound {
    color: #c0c4cc;
    font-size: 13px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 0 0 1px #c0c4cc inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px #409eff inset;
    }
  }
</style>
