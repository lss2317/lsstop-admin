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
          <ElFormItem label="用户UID" prop="userUid" required>
            <ElInput
              v-model="form.userUid"
              placeholder="请输入用户UID"
              :disabled="dialogType === 'edit'"
              clearable
              maxlength="32"
              @blur="form.userUid = form.userUid.trim()"
            />
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
          <ElFormItem label="头像" prop="avatar">
            <ElInput v-model="form.avatar" placeholder="请输入头像URL" clearable maxlength="255" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="个人网站" prop="website">
            <ElInput v-model="form.website" placeholder="请输入个人网站" clearable maxlength="255" />
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
        <ElCol :span="12">
          <ElFormItem label="是否启用" prop="status">
            <ElSwitch v-model="form.status" :active-value="1" :inactive-value="0" />
          </ElFormItem>
        </ElCol>
      </ElRow>

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
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus';
  import type { UserFormParams } from '@/apis/user/types';
  import type { UserListItem, RoleOption } from '@/apis/user';
  import { MOCK_ROLE_LIST } from '@/apis/user';

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

  /** 弹窗显示状态双向绑定 */
  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  /** 角色下拉选项 */
  const roleOptions = ref<RoleOption[]>(MOCK_ROLE_LIST);

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    userUid: [
      { required: true, message: '请输入用户UID', trigger: 'blur' },
      { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
    ],
    nickname: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ]
  });

  /**
   * 表单数据
   */
  const form = reactive<UserFormParams>({
    userUid: '',
    nickname: '',
    avatar: '',
    website: '',
    intro: '',
    status: 1,
    roleIds: []
  });

  /** 默认表单值 */
  const defaultForm = (): UserFormParams => ({
    userUid: '',
    nickname: '',
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
          avatar: detail.avatar,
          website: detail.website || '',
          intro: detail.intro || '',
          status: detail.status,
          roleIds: [...detail.roleIds]
        });
      } catch {
        // 详情获取失败时，用列表数据兜底
        const roleMap = new Map(roleOptions.value.map((r) => [r.roleName, r.id]));
        Object.assign(form, {
          userUid: props.userData!.userUid,
          nickname: props.userData!.nickname,
          avatar: props.userData!.avatar,
          website: '',
          intro: '',
          status: props.userData!.status,
          roleIds: props.userData!.roles.map((name) => roleMap.get(name)).filter(Boolean) as number[]
        });
      }
    } else {
      Object.assign(form, defaultForm());
    }
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
    if (!formRef.value) return;

    try {
      await formRef.value.validate();

      if (props.dialogType === 'add') {
        ElMessage.success('新增成功');
      } else {
        ElMessage.success('修改成功');
      }
      emit('success');
      handleClose();
    } catch {
      // 表单校验失败或接口报错（接口报错由全局拦截器展示）
    }
  };
</script>

<style scoped lang="scss">
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
