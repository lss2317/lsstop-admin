<template>
  <ElDrawer
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleClose"
    size="min(820px, calc(100vw - 48px))"
    class="api-drawer"
    @closed="handleClosed"
  >
    <section>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px">
        <ElRow :gutter="20">
          <!-- 类型（全宽） -->
          <ElCol :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <ElFormItem class="api-type-item">
              <template #label>类型</template>
              <div class="flex w-full flex-col items-start gap-2">
                <ElRadioGroup v-model="form.apiType" :disabled="isEdit" class="api-type-group">
                  <ElRadioButton value="directory">目录</ElRadioButton>
                  <ElRadioButton value="api">接口</ElRadioButton>
                </ElRadioGroup>
                <p class="w-full text-xs leading-5 text-[var(--el-text-color-secondary)]">
                  新建时可直接选择类型。目录节点仅用于分组，不参与接口鉴权。
                </p>
              </div>
            </ElFormItem>
          </ElCol>

          <!-- 目录 -->
          <template v-if="form.apiType === 'directory'">
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="上级权限" prop="parentId">
                <ElTreeSelect
                  v-model="form.parentId"
                  :data="parentOptions"
                  :props="{ label: 'description', value: 'id', children: 'children' }"
                  class="w-full"
                  clearable
                  check-strictly
                  filterable
                  placeholder="不选择则创建为顶级"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="description" required>
                <template #label>
                  <span>权限描述</span>
                </template>
                <ElInput
                  v-model="form.description"
                  placeholder="如：文章管理"
                  :maxlength="255"
                  clearable
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem>
                <template #label>
                  <span class="flex items-center">
                    <span>排序</span>
                    <ElTooltip content="按升序排列，数字越小越靠前" placement="top">
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInputNumber
                  v-model="form.sort"
                  :min="0"
                  :max="9999"
                  controls-position="right"
                  style="width: 100%"
                />
              </ElFormItem>
            </ElCol>
          </template>

          <!-- 接口 -->
          <template v-else>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="上级权限" prop="parentId">
                <ElTreeSelect
                  v-model="form.parentId"
                  :data="parentOptions"
                  :props="{ label: 'description', value: 'id', children: 'children' }"
                  class="w-full"
                  clearable
                  check-strictly
                  filterable
                  placeholder="不选择则创建为顶级"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem prop="description" required>
                <template #label>
                  <span>权限描述</span>
                </template>
                <ElInput
                  v-model="form.description"
                  placeholder="如：文章列表"
                  :maxlength="255"
                  clearable
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="请求方法" prop="requestMethod">
                <ElSelect v-model="form.requestMethod" placeholder="请选择请求方法" clearable>
                  <ElOption label="GET" value="GET" />
                  <ElOption label="POST" value="POST" />
                  <ElOption label="PUT" value="PUT" />
                  <ElOption label="DELETE" value="DELETE" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem label="接口路径" prop="requestUrl">
                <ElInput
                  v-model="form.requestUrl"
                  placeholder="如：/admin/article/list"
                  :maxlength="255"
                  clearable
                />
              </ElFormItem>
            </ElCol>
            <ElCol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <ElFormItem>
                <template #label>
                  <span class="flex items-center">
                    <span>排序</span>
                    <ElTooltip content="按升序排列，数字越小越靠前" placement="top">
                      <ElIcon class="ml-0.5 cursor-help"><QuestionFilled /></ElIcon>
                    </ElTooltip>
                  </span>
                </template>
                <ElInputNumber
                  v-model="form.sort"
                  :min="0"
                  :max="9999"
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
            <ElSwitch
              :model-value="form.isEnabled === 1"
              @update:model-value="(v: boolean) => (form.isEnabled = v ? 1 : 0)"
            />
          </div>
        </div>
      </section>
    </section>

    <template #footer>
      <span class="drawer-footer">
        <ElButton @click="handleClose">取 消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="handleSubmit">确 定</ElButton>
      </span>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import type { ApiPermissionItem } from '@/apis/api-permission/types';
  import type { FormInstance, FormRules } from 'element-plus';
  import { ElIcon, ElTooltip } from 'element-plus';
  import { QuestionFilled } from '@element-plus/icons-vue';

  type ApiType = 'directory' | 'api';

  interface Props {
    visible: boolean;
    editData: ApiPermissionItem | { _parentRow: ApiPermissionItem } | null;
    treeData: ApiPermissionItem[];
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: Record<string, any>): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const isEdit = computed(() => !!(props.editData && 'id' in props.editData && props.editData.id));

  const apiTypeLabelMap: Record<ApiType, string> = {
    directory: '目录',
    api: '接口'
  };

  const dialogTitle = computed(() => {
    const label = apiTypeLabelMap[form.apiType];
    return isEdit.value ? `编辑${label}` : `新建${label}`;
  });

  const defaultForm = () => ({
    apiType: 'directory' as ApiType,
    parentId: undefined as number | undefined,
    description: '',
    requestMethod: null as string | null,
    requestUrl: '',
    sort: 1,
    isEnabled: 1
  });

  const form = reactive(defaultForm());

  /** 过滤树形数据，只保留目录节点（没有 requestMethod） */
  const parentOptions = computed(() => {
    const filterDirectories = (items: ApiPermissionItem[]): ApiPermissionItem[] => {
      return items
        .filter((item) => !item.requestMethod)
        .map((item) => ({
          ...item,
          children: item.children ? filterDirectories(item.children) : []
        }));
    };
    return filterDirectories(props.treeData);
  });

  const rules = computed<FormRules>(() => {
    const base: FormRules = {
      description: [{ required: true, message: '请输入权限描述', trigger: 'blur' }]
    };
    if (form.apiType === 'api') {
      base.requestMethod = [{ required: true, message: '请选择请求方法', trigger: 'change' }];
      base.requestUrl = [{ required: true, message: '请输入接口路径', trigger: 'blur' }];
    }
    return base;
  });

  /** 根据编辑数据推断类型 */
  const inferApiType = (row: ApiPermissionItem): ApiType => {
    return row.requestMethod ? 'api' : 'directory';
  };

  const resetForm = (): void => {
    formRef.value?.resetFields();
    form.apiType = 'directory';
    form.parentId = undefined;
    form.description = '';
    form.requestMethod = null;
    form.requestUrl = '';
    form.sort = 1;
    form.isEnabled = 1;
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        resetForm();

        if (props.editData && 'id' in props.editData && props.editData.id) {
          // 编辑模式
          form.apiType = inferApiType(props.editData);
          nextTick(() => {
            Object.assign(form, {
              parentId:
                props.editData.parentId && props.editData.parentId !== 0
                  ? props.editData.parentId
                  : undefined,
              description: props.editData.description ?? '',
              requestMethod: props.editData.requestMethod ?? null,
              requestUrl: props.editData.requestUrl ?? '',
              sort: props.editData.sort ?? 1,
              isEnabled: props.editData.isEnabled ?? 1
            });
          });
        } else if (props.editData && '_parentRow' in props.editData) {
          // 在父节点下新增
          nextTick(() => {
            form.parentId = props.editData._parentRow.id;
          });
        }
      }
    }
  );

  const handleClose = () => {
    emit('update:visible', false);
  };

  const handleClosed = (): void => {
    resetForm();
  };

  const handleSubmit = async () => {
    if (!formRef.value) return;
    try {
      await formRef.value.validate();
      submitting.value = true;
      const { apiType, ...payload } = form as Record<string, any>;
      // parentId 归一化：undefined → 0（顶级）
      emit('submit', { ...payload, parentId: form.parentId ?? 0 });
    } catch {
      // 校验失败
    } finally {
      submitting.value = false;
    }
  };
</script>

<style scoped>
  .api-type-item :deep(.el-form-item__content) {
    display: block;
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
</style>
