<template>
  <ElDialog
    v-model="visible"
    :title="dialogTitle"
    class="announcement-dialog"
    width="min(960px, calc(100vw - 32px))"
    top="20px"
    destroy-on-close
    @closed="resetForm"
  >
    <ElForm
      v-if="!isViewMode"
      ref="formRef"
      class="announcement-form"
      :model="form"
      :rules="rules"
      label-width="88px"
    >
      <ElFormItem label="公告标题" prop="title">
        <ElInput
          v-model="form.title"
          maxlength="100"
          show-word-limit
          placeholder="请输入公告标题"
        />
      </ElFormItem>

      <ElFormItem label="公告类型" prop="type">
        <ElRadioGroup v-model="form.type">
          <ElRadio :value="1">弹窗公告</ElRadio>
          <ElRadio :value="2">首页展示</ElRadio>
          <ElRadio :value="3">全部展示</ElRadio>
        </ElRadioGroup>
      </ElFormItem>

      <ElFormItem label="优先级" prop="priority">
        <ElInputNumber v-model="form.priority" :min="0" :max="999" controls-position="right" />
        <span class="ml-3 text-xs text-g-500">数值越大，展示越靠前</span>
      </ElFormItem>

      <ElFormItem label="生效时间" prop="endTime">
        <div class="effective-time-row">
          <ElDatePicker
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="开始时间"
            clearable
          />
          <span class="effective-time-separator">至</span>
          <ElDatePicker
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="结束时间"
            clearable
          />
        </div>
      </ElFormItem>

      <ElFormItem label="是否启用" prop="isEnabled">
        <ElSwitch v-model="form.isEnabled" :active-value="1" :inactive-value="0" />
      </ElFormItem>

      <ElFormItem class="announcement-content-item" label="公告内容" prop="content">
        <div class="announcement-markdown">
          <div class="markdown-editor-heading">
            <span>使用 Markdown 编写公告内容</span>
            <div
              class="markdown-mode-switch"
              :class="{ 'is-preview': contentMode === 'preview' }"
              role="tablist"
              aria-label="公告内容编辑模式"
            >
              <button
                type="button"
                role="tab"
                :aria-selected="contentMode === 'edit'"
                :class="{ active: contentMode === 'edit' }"
                @click="contentMode = 'edit'"
              >
                <ArtSvgIcon icon="ri:edit-line" />
                编辑
              </button>
              <button
                type="button"
                role="tab"
                :aria-selected="contentMode === 'preview'"
                :class="{ active: contentMode === 'preview' }"
                @click="contentMode = 'preview'"
              >
                <ArtSvgIcon icon="ri:eye-line" />
                预览效果
              </button>
            </div>
          </div>

          <div class="markdown-mode-content">
            <Transition name="markdown-pane" mode="out-in">
              <div v-if="contentMode === 'edit'" key="edit" class="markdown-edit-pane">
                <div class="markdown-editor">
                  <div class="markdown-toolbar" role="toolbar" aria-label="Markdown 编辑工具栏">
                    <button
                      type="button"
                      class="markdown-tool"
                      title="二级标题"
                      aria-label="插入二级标题"
                      @click="insertMarkdownLine('## ', '标题')"
                    >
                      <ArtSvgIcon icon="ri:heading" />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="粗体"
                      aria-label="插入粗体"
                      @click="wrapMarkdown('**', '**', '粗体文本')"
                    >
                      <ArtSvgIcon icon="ri:bold" />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="斜体"
                      aria-label="插入斜体"
                      @click="wrapMarkdown('*', '*', '斜体文本')"
                    >
                      <ArtSvgIcon icon="ri:italic" />
                    </button>
                    <span class="markdown-tool-divider" aria-hidden="true"></span>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="引用"
                      aria-label="插入引用"
                      @click="insertMarkdownLine('> ', '引用内容')"
                    >
                      <ArtSvgIcon icon="ri:double-quotes-l" />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="无序列表"
                      aria-label="插入无序列表"
                      @click="insertMarkdownLine('- ', '列表项')"
                    >
                      <ArtSvgIcon icon="ri:list-unordered" />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="有序列表"
                      aria-label="插入有序列表"
                      @click="insertOrderedList"
                    >
                      <ArtSvgIcon icon="ri:list-ordered-2" />
                    </button>
                    <span class="markdown-tool-divider" aria-hidden="true"></span>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="插入链接"
                      aria-label="插入链接"
                      @click="openLinkDialog"
                    >
                      <ArtSvgIcon icon="ri:link" />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      :title="imageUploading ? '图片上传中' : '上传并插入图片'"
                      aria-label="插入图片"
                      :disabled="imageUploading"
                      @click="openImagePicker"
                    >
                      <ArtSvgIcon
                        :icon="imageUploading ? 'ri:loader-4-line' : 'ri:image-line'"
                        :class="{ 'is-spinning': imageUploading }"
                      />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="行内代码"
                      aria-label="插入行内代码"
                      @click="wrapMarkdown('`', '`', '代码')"
                    >
                      <ArtSvgIcon icon="ri:code-s-line" />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="插入代码块"
                      aria-label="插入代码块"
                      @click="openCodeDialog"
                    >
                      <ArtSvgIcon icon="ri:code-box-line" />
                    </button>
                    <span class="markdown-tool-divider" aria-hidden="true"></span>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="分隔线"
                      aria-label="插入分隔线"
                      @click="insertMarkdownDivider"
                    >
                      <ArtSvgIcon icon="ri:separator" />
                    </button>
                  </div>
                  <ElInput
                    ref="contentInputRef"
                    v-model="form.content"
                    type="textarea"
                    resize="none"
                    :placeholder="contentMarkdownPlaceholder"
                    class="markdown-input"
                  />
                </div>
                <div class="markdown-help">
                  <ArtSvgIcon icon="ri:information-line" />
                  <span>选中文字后点击工具按钮即可添加语法，内容会以 Markdown 原文保存。</span>
                  <span class="markdown-syntax"># 标题</span>
                  <span class="markdown-syntax">**粗体**</span>
                  <span class="markdown-syntax">[链接](URL)</span>
                </div>
              </div>
              <div v-else key="preview" class="markdown-preview markdown-body">
                <div
                  v-if="form.content.trim()"
                  class="markdown-preview-content"
                  v-html="contentPreviewHtml"
                ></div>
                <div v-else class="markdown-preview-empty">
                  <span><ArtSvgIcon icon="ri:file-text-line" /></span>
                  <strong>还没有可预览的内容</strong>
                  <p>切换到“编辑”并输入 Markdown 内容后，即可在这里查看效果。</p>
                  <ElButton @click="contentMode = 'edit'">开始编写</ElButton>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </ElFormItem>
    </ElForm>

    <div v-else class="announcement-preview-only">
      <div class="markdown-preview markdown-body">
        <div
          v-if="form.content.trim()"
          class="markdown-preview-content"
          v-html="contentPreviewHtml"
        ></div>
        <div v-else class="markdown-preview-empty">
          <span><ArtSvgIcon icon="ri:file-text-line" /></span>
          <strong>暂无公告内容</strong>
        </div>
      </div>
    </div>

    <input
      v-if="!isViewMode"
      ref="contentImageInputRef"
      type="file"
      accept="image/*"
      hidden
      @change="handleContentImageSelect"
    />
    <MarkdownLinkDialog
      v-model="linkDialogVisible"
      :initial-text="linkInitialText"
      @confirm="handleInsertLink"
    />
    <MarkdownCodeDialog
      v-model="codeDialogVisible"
      :initial-code="codeInitialCode"
      @confirm="handleInsertCodeBlock"
    />

    <template #footer>
      <ElButton v-if="isViewMode" type="primary" @click="visible = false">关闭</ElButton>
      <template v-else>
        <ElButton @click="visible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">保存</ElButton>
      </template>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ElMessage, type FormInstance, type FormRules, type InputInstance } from 'element-plus';
  import hljs from 'highlight.js';
  import MarkdownIt from 'markdown-it';
  import { fetchUploadWebsiteConfigImage } from '@/apis/setting';
  import '@/assets/styles/custom/one-dark-pro.scss';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import MarkdownCodeDialog from '@/views/system/setting/modules/markdown-code-dialog.vue';
  import MarkdownLinkDialog from '@/views/system/setting/modules/markdown-link-dialog.vue';

  interface MarkdownSelection {
    start: number;
    end: number;
    text: string;
  }

  interface MarkdownLinkValue {
    text: string;
    url: string;
  }

  interface MarkdownCodeValue {
    language: string;
    code: string;
  }

  export interface AnnouncementForm {
    title: string;
    content: string;
    type: number;
    priority: number;
    isEnabled: number;
    startTime: string | null;
    endTime: string | null;
  }

  interface Props {
    modelValue: boolean;
    mode?: 'add' | 'edit' | 'view';
    editData?: AnnouncementForm;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'submit', value: AnnouncementForm): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: 'add'
  });
  const emit = defineEmits<Emits>();
  const formRef = ref<FormInstance>();
  const contentInputRef = ref<InputInstance>();
  const contentImageInputRef = ref<HTMLInputElement>();
  const contentMode = ref<'edit' | 'preview'>('edit');
  const imageUploading = ref(false);
  const linkDialogVisible = ref(false);
  const codeDialogVisible = ref(false);
  const linkInitialText = ref('');
  const codeInitialCode = ref('');
  const pendingSelection = ref<MarkdownSelection>({ start: 0, end: 0, text: '' });
  const CONTENT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
  const CONTENT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const contentMarkdownPlaceholder = `# 公告标题

请输入公告内容……

## 主要内容

- 内容一
- 内容二`;

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  const isViewMode = computed(() => props.mode === 'view');
  const dialogTitle = computed(() => {
    if (props.mode === 'view') return '查看公告';
    if (props.mode === 'edit') return '编辑公告';
    return '新增公告';
  });

  const createDefaultForm = (): AnnouncementForm => ({
    title: '',
    content: '',
    type: 1,
    priority: 0,
    isEnabled: 1,
    startTime: null,
    endTime: null
  });

  const form = reactive<AnnouncementForm>(createDefaultForm());

  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, language) {
      const result =
        language && hljs.getLanguage(language)
          ? hljs.highlight(code, { language, ignoreIllegals: true })
          : hljs.highlightAuto(code);
      return `<pre class="hljs"><code>${result.value}</code></pre>`;
    }
  });
  const contentPreviewHtml = computed(() => markdown.render(form.content));

  const setContentSelection = (value: string, start: number, end: number): void => {
    form.content = value;
    nextTick(() => {
      const textarea = contentInputRef.value?.textarea;
      textarea?.focus();
      textarea?.setSelectionRange(start, end);
    });
  };

  const getContentSelection = (): MarkdownSelection => {
    const textarea = contentInputRef.value?.textarea;
    const start = textarea?.selectionStart ?? form.content.length;
    const end = textarea?.selectionEnd ?? start;
    return { start, end, text: form.content.slice(start, end) };
  };

  const insertAtSelection = (
    markdownText: string,
    selection: MarkdownSelection,
    block = false
  ): void => {
    const before =
      block && selection.start > 0 && form.content[selection.start - 1] !== '\n' ? '\n\n' : '';
    const after =
      block && selection.end < form.content.length && form.content[selection.end] !== '\n'
        ? '\n\n'
        : block
          ? '\n'
          : '';
    const inserted = `${before}${markdownText}${after}`;
    const value = `${form.content.slice(0, selection.start)}${inserted}${form.content.slice(selection.end)}`;
    const cursor = selection.start + inserted.length;
    setContentSelection(value, cursor, cursor);
  };

  const wrapMarkdown = (prefix: string, suffix: string, placeholder: string): void => {
    const selection = getContentSelection();
    const selected = selection.text || placeholder;
    const value = `${form.content.slice(0, selection.start)}${prefix}${selected}${suffix}${form.content.slice(selection.end)}`;
    const selectionStart = selection.start + prefix.length;
    setContentSelection(value, selectionStart, selectionStart + selected.length);
  };

  const insertMarkdownLine = (prefix: string, placeholder: string): void => {
    const selection = getContentSelection();
    const lineStart = form.content.lastIndexOf('\n', Math.max(0, selection.start - 1)) + 1;
    const nextLineBreak = form.content.indexOf('\n', selection.end);
    const lineEnd = nextLineBreak === -1 ? form.content.length : nextLineBreak;
    const block = form.content.slice(lineStart, lineEnd) || placeholder;
    const replacement = block
      .split('\n')
      .map((line) => `${prefix}${line}`)
      .join('\n');
    const value = `${form.content.slice(0, lineStart)}${replacement}${form.content.slice(lineEnd)}`;
    setContentSelection(value, lineStart + prefix.length, lineStart + replacement.length);
  };

  const insertOrderedList = (): void => {
    const selection = getContentSelection();
    const lineStart = form.content.lastIndexOf('\n', Math.max(0, selection.start - 1)) + 1;
    const nextLineBreak = form.content.indexOf('\n', selection.end);
    const lineEnd = nextLineBreak === -1 ? form.content.length : nextLineBreak;
    const block = form.content.slice(lineStart, lineEnd) || '列表项';
    const replacement = block
      .split('\n')
      .map((line, index) => `${index + 1}. ${line}`)
      .join('\n');
    const value = `${form.content.slice(0, lineStart)}${replacement}${form.content.slice(lineEnd)}`;
    setContentSelection(value, lineStart + 3, lineStart + replacement.length);
  };

  const openLinkDialog = (): void => {
    pendingSelection.value = getContentSelection();
    linkInitialText.value = pendingSelection.value.text;
    linkDialogVisible.value = true;
  };

  const handleInsertLink = ({ text, url }: MarkdownLinkValue): void => {
    const safeText = text.replaceAll(']', '\\]');
    insertAtSelection(`[${safeText}](${url})`, pendingSelection.value);
  };

  const openCodeDialog = (): void => {
    pendingSelection.value = getContentSelection();
    codeInitialCode.value = pendingSelection.value.text;
    codeDialogVisible.value = true;
  };

  const handleInsertCodeBlock = ({ language, code }: MarkdownCodeValue): void => {
    insertAtSelection(`\`\`\`${language}\n${code}\n\`\`\``, pendingSelection.value, true);
  };

  const openImagePicker = (): void => {
    pendingSelection.value = getContentSelection();
    contentImageInputRef.value?.click();
  };

  const handleContentImageSelect = async (event: Event): Promise<void> => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!CONTENT_IMAGE_TYPES.includes(file.type)) {
      ElMessage.warning('仅支持 JPG、PNG、GIF 或 WebP 图片');
      return;
    }
    if (file.size > CONTENT_IMAGE_MAX_SIZE) {
      ElMessage.warning('图片大小不能超过 5MB');
      return;
    }

    imageUploading.value = true;
    try {
      const url = await fetchUploadWebsiteConfigImage(file);
      const description = file.name.replace(/\.[^.]+$/, '').trim() || '图片';
      const safeDescription = description.replaceAll(']', '\\]');
      insertAtSelection(`![${safeDescription}](${url})`, pendingSelection.value, true);
      ElMessage.success('图片已上传并插入');
    } catch {
      // 上传失败由请求拦截器统一展示错误信息
    } finally {
      imageUploading.value = false;
    }
  };

  const insertMarkdownDivider = (): void => {
    const selection = getContentSelection();
    const before = selection.start > 0 && form.content[selection.start - 1] !== '\n' ? '\n\n' : '';
    const after =
      selection.end < form.content.length && form.content[selection.end] !== '\n' ? '\n\n' : '\n';
    const inserted = `${before}---${after}`;
    const value = `${form.content.slice(0, selection.start)}${inserted}${form.content.slice(selection.end)}`;
    const cursor = selection.start + inserted.length;
    setContentSelection(value, cursor, cursor);
  };

  const validateEndTime = (
    _rule: unknown,
    value: string | null,
    callback: (error?: Error) => void
  ): void => {
    if (value && form.startTime && new Date(value).getTime() < new Date(form.startTime).getTime()) {
      callback(new Error('结束时间不能早于开始时间'));
      return;
    }
    callback();
  };

  const validateContent = (
    _rule: unknown,
    value: string,
    callback: (error?: Error) => void
  ): void => {
    if (!value.trim()) {
      callback(new Error('请输入公告内容'));
      return;
    }
    callback();
  };

  const rules: FormRules<AnnouncementForm> = {
    title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择公告类型', trigger: 'change' }],
    priority: [{ required: true, message: '请输入优先级', trigger: 'change' }],
    isEnabled: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
    endTime: [{ validator: validateEndTime, trigger: 'change' }],
    content: [{ validator: validateContent, trigger: 'change' }]
  };

  const resetForm = (): void => {
    Object.assign(form, createDefaultForm());
    contentMode.value = 'edit';
    formRef.value?.clearValidate();
  };

  const handleSubmit = async (): Promise<void> => {
    if (isViewMode.value) return;
    await formRef.value?.validate();
    emit('submit', { ...form });
  };

  watch(
    () => props.modelValue,
    (open) => {
      if (!open) return;
      Object.assign(form, createDefaultForm(), props.editData || {});
      contentMode.value = isViewMode.value ? 'preview' : 'edit';
      nextTick(() => formRef.value?.clearValidate());
    }
  );
</script>

<style scoped>
  .effective-time-row {
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;
  }

  .effective-time-row :deep(.el-date-editor) {
    flex: 1;
    min-width: 0;
  }

  .effective-time-separator {
    color: var(--el-text-color-secondary);
  }

  @media (width <= 640px) {
    .effective-time-row {
      flex-direction: column;
      align-items: stretch;
    }

    .effective-time-separator {
      display: none;
    }
  }
</style>

<style lang="scss">
  .announcement-dialog {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    margin-bottom: 20px;

    .el-dialog__header,
    .el-dialog__footer {
      flex: none;
    }

    .el-dialog__body {
      flex: 1;
      min-height: 0;
      padding: 16px 0 !important;
      overflow: hidden;
    }

    .announcement-form {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .announcement-preview-only {
      display: flex;
      height: 100%;
      min-height: 0;
    }

    .announcement-content-item {
      flex: 1;
      min-height: 220px;
      margin-bottom: 0;

      .el-form-item__content {
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
    }

    .announcement-markdown {
      display: flex;
      flex: 1;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      height: 100%;
      min-height: 0;
    }

    .markdown-editor-heading {
      display: flex;
      flex: none;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      min-height: 40px;
      margin-bottom: 10px;
      font-size: 12px;
      color: var(--art-gray-500);
    }

    .markdown-mode-switch {
      position: relative;
      display: inline-grid;
      flex: none;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3px;
      padding: 3px;
      background: var(--art-gray-200);
      border-radius: 8px;

      &::before {
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: 3px;
        width: calc((100% - 9px) / 2);
        content: '';
        background: var(--default-box-color);
        border-radius: 6px;
        box-shadow: 0 1px 4px rgb(31 41 55 / 9%);
        transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
      }

      &.is-preview::before {
        transform: translateX(calc(100% + 3px));
      }

      button {
        position: relative;
        z-index: 1;
        display: inline-flex;
        gap: 5px;
        align-items: center;
        justify-content: center;
        height: 32px;
        padding: 0 12px;
        font-size: 12px;
        color: var(--art-gray-600);
        white-space: nowrap;
        cursor: pointer;
        background: transparent;
        border: 0;
        border-radius: 6px;
        transition:
          color 0.2s,
          transform 0.2s;

        &:hover {
          color: var(--art-gray-800);
        }

        &.active {
          font-weight: 500;
          color: var(--theme-color);
        }

        &:active {
          transform: scale(0.97);
        }
      }
    }

    .markdown-mode-content,
    .markdown-edit-pane {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
    }

    .markdown-pane-enter-active,
    .markdown-pane-leave-active {
      transition:
        opacity 0.18s ease,
        transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .markdown-pane-enter-from {
      opacity: 0;
      transform: translateY(7px);
    }

    .markdown-pane-leave-to {
      opacity: 0;
      transform: translateY(-4px);
    }

    .markdown-editor {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
      background: var(--default-box-color);
      border: 1px solid var(--art-card-border);
      border-radius: 8px;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;

      &:focus-within {
        border-color: var(--theme-color);
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-color) 12%, transparent);
      }
    }

    .markdown-toolbar {
      display: flex;
      flex: none;
      flex-wrap: wrap;
      gap: 3px;
      align-items: center;
      min-height: 47px;
      padding: 7px 9px;
      background: color-mix(in srgb, var(--art-gray-100) 72%, var(--default-box-color));
      border-bottom: 1px solid var(--art-card-border);
    }

    .markdown-tool {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      font-size: 16px;
      color: var(--art-gray-700);
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 6px;
      transition:
        color 0.18s,
        background-color 0.18s;

      &:hover,
      &:focus-visible {
        color: var(--theme-color);
        background: color-mix(in srgb, var(--theme-color) 11%, transparent);
        outline: none;
      }

      &:active {
        background: color-mix(in srgb, var(--theme-color) 17%, transparent);
      }

      &:disabled {
        color: var(--art-gray-400);
        cursor: not-allowed;
        background: transparent;
      }

      .is-spinning {
        animation: markdown-spin 0.8s linear infinite;
      }
    }

    .markdown-tool-divider {
      width: 1px;
      height: 20px;
      margin: 0 4px;
      background: var(--art-card-border);
    }

    .markdown-input {
      flex: 1;
      min-height: 0;
    }

    .markdown-input .el-textarea__inner {
      height: 100%;
      min-height: 0 !important;
      padding: 14px 16px 28px;
      font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
      font-size: 13px;
      line-height: 1.75;
      tab-size: 2;
      resize: none;
      background: transparent;
      border-radius: 0;
      box-shadow: none;

      &:focus {
        box-shadow: none;
      }
    }

    .markdown-help {
      display: flex;
      flex: none;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      width: 100%;
      min-height: 24px;
      margin-top: 7px;
      font-size: 11px;
      line-height: 1.5;
      color: var(--art-gray-500);

      > svg {
        flex-shrink: 0;
        font-size: 14px;
        color: var(--theme-color);
      }
    }

    .markdown-syntax {
      padding: 1px 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: var(--art-gray-600);
      background: var(--art-gray-200);
      border-radius: 4px;
    }

    .markdown-preview {
      flex: 1;
      min-height: 0;
      padding: 22px 24px;
      overflow: auto;
      background: var(--default-box-color);
      border: 1px solid var(--art-card-border);
      border-radius: 8px;
    }

    .markdown-preview-content {
      pre.hljs {
        padding: 16px 18px;
        color: #a6accd;
        background: #282c34;
      }

      pre.hljs code {
        display: block;
        padding: 0;
        color: inherit;
        background: transparent;
      }
    }

    .markdown-preview-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 220px;
      text-align: center;

      > span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 54px;
        height: 54px;
        margin-bottom: 14px;
        font-size: 25px;
        color: var(--theme-color);
        background: color-mix(in srgb, var(--theme-color) 10%, transparent);
        border-radius: 15px;
      }

      strong {
        font-size: 14px;
        font-weight: 600;
        color: var(--art-gray-800);
      }

      p {
        margin: 7px 0 16px;
        font-size: 12px;
        color: var(--art-gray-500);
      }
    }
  }

  @keyframes markdown-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (width <= 640px) {
    .announcement-dialog {
      height: calc(100vh - 24px);
      margin-top: 12px !important;
      margin-bottom: 12px;

      .el-dialog__body {
        overflow-y: auto;
      }

      .announcement-form {
        min-height: 680px;
      }
    }
  }
</style>
