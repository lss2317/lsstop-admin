<template>
  <section class="setting-panel about-panel">
    <div class="panel-heading">
      <span class="panel-icon"><ArtSvgIcon icon="ri:user-heart-line" /></span>
      <div>
        <h2>关于我</h2>
        <p>编辑博主个人介绍，并实时查看 Markdown 渲染效果</p>
      </div>
    </div>

    <ElCard class="art-card config-card markdown-card" :body-style="{ padding: '0' }">
      <div class="card-heading markdown-card-heading">
        <div>
          <h3>关于我内容</h3>
          <p>使用 Markdown 编写个人介绍，并查看博客前台的渲染效果</p>
        </div>
        <div class="markdown-heading-actions">
          <div
            class="markdown-mode-switch"
            :class="{ 'is-preview': aboutMode === 'preview' }"
            role="tablist"
            aria-label="关于我编辑模式"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="aboutMode === 'edit'"
              :class="{ active: aboutMode === 'edit' }"
              @click="aboutMode = 'edit'"
            >
              <ArtSvgIcon icon="ri:edit-line" />
              编辑
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="aboutMode === 'preview'"
              :class="{ active: aboutMode === 'preview' }"
              @click="aboutMode = 'preview'"
            >
              <ArtSvgIcon icon="ri:eye-line" />
              预览效果
            </button>
          </div>
        </div>
      </div>

      <div class="card-body markdown-card-body">
        <ElFormItem prop="about" class="markdown-form-item !mb-0">
          <div class="markdown-mode-content">
            <Transition name="markdown-pane" mode="out-in">
              <div v-if="aboutMode === 'edit'" key="edit" class="markdown-edit-pane">
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
                    ref="aboutInputRef"
                    v-model="form.about"
                    type="textarea"
                    :rows="12"
                    resize="vertical"
                    :placeholder="aboutMarkdownPlaceholder"
                    maxlength="5000"
                    show-word-limit
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
                  v-if="form.about?.trim()"
                  class="markdown-preview-content"
                  v-html="aboutPreviewHtml"
                ></div>
                <div v-else class="markdown-preview-empty">
                  <span><ArtSvgIcon icon="ri:file-text-line" /></span>
                  <strong>还没有可预览的内容</strong>
                  <p>切换到“编辑”并输入 Markdown 内容后，即可在这里查看效果。</p>
                  <ElButton @click="aboutMode = 'edit'">开始编写</ElButton>
                </div>
              </div>
            </Transition>
          </div>
        </ElFormItem>
      </div>
    </ElCard>

    <input
      ref="aboutImageInputRef"
      type="file"
      accept="image/*"
      class="image-file-input"
      @change="handleAboutImageSelect"
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
  </section>
</template>

<script setup lang="ts">
  import { fetchUploadWebsiteConfigImage } from '@/apis/setting';
  import type { WebsiteConfigItem } from '@/apis/setting/types';
  import { ElMessage, type InputInstance } from 'element-plus';
  import hljs from 'highlight.js';
  import MarkdownIt from 'markdown-it';
  import '@/assets/styles/custom/one-dark-pro.scss';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import MarkdownCodeDialog from './markdown-code-dialog.vue';
  import MarkdownLinkDialog from './markdown-link-dialog.vue';

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

  const ABOUT_MAX_LENGTH = 5000;
  const ABOUT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
  const ABOUT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const form = defineModel<WebsiteConfigItem>({ required: true });
  const aboutInputRef = ref<InputInstance>();
  const aboutImageInputRef = ref<HTMLInputElement>();
  const aboutMode = ref<'edit' | 'preview'>('edit');
  const imageUploading = ref(false);
  const linkDialogVisible = ref(false);
  const codeDialogVisible = ref(false);
  const linkInitialText = ref('');
  const codeInitialCode = ref('');
  const pendingSelection = ref<MarkdownSelection>({ start: 0, end: 0, text: '' });

  const aboutMarkdownPlaceholder = `# 关于我

你好，我是……

## 创作方向

- 技术分享
- 生活记录`;

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
  const aboutPreviewHtml = computed(() => markdown.render(form.value.about ?? ''));

  const setAboutSelection = (value: string, start: number, end: number) => {
    form.value.about = value;
    nextTick(() => {
      const textarea = aboutInputRef.value?.textarea;
      textarea?.focus();
      textarea?.setSelectionRange(start, end);
    });
  };

  /** 获取编辑器当前选区，供弹窗确认或异步上传完成后在原位置插入内容。 */
  const getAboutSelection = (): MarkdownSelection => {
    const textarea = aboutInputRef.value?.textarea;
    const content = form.value.about ?? '';
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? start;
    return { start, end, text: content.slice(start, end) };
  };

  /** 在指定选区插入 Markdown，并将光标移动到插入内容之后。 */
  const insertAtSelection = (markdownText: string, selection: MarkdownSelection, block = false) => {
    const content = form.value.about ?? '';
    const before =
      block && selection.start > 0 && content[selection.start - 1] !== '\n' ? '\n\n' : '';
    const after =
      block && selection.end < content.length && content[selection.end] !== '\n'
        ? '\n\n'
        : block
          ? '\n'
          : '';
    const inserted = `${before}${markdownText}${after}`;
    const value = `${content.slice(0, selection.start)}${inserted}${content.slice(selection.end)}`;

    if (value.length > ABOUT_MAX_LENGTH) {
      ElMessage.warning(`关于我内容不能超过 ${ABOUT_MAX_LENGTH} 个字符`);
      return false;
    }

    const cursor = selection.start + inserted.length;
    setAboutSelection(value, cursor, cursor);
    return true;
  };

  /** 为当前选区包裹 Markdown 语法；未选中文字时插入示例内容并保持选中。 */
  const wrapMarkdown = (prefix: string, suffix: string, placeholder: string) => {
    const textarea = aboutInputRef.value?.textarea;
    const content = form.value.about ?? '';
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = content.slice(start, end) || placeholder;
    const value = `${content.slice(0, start)}${prefix}${selected}${suffix}${content.slice(end)}`;
    const selectionStart = start + prefix.length;
    setAboutSelection(value, selectionStart, selectionStart + selected.length);
  };

  /** 为选区所在的完整行添加前缀，支持一次处理多行。 */
  const insertMarkdownLine = (prefix: string, placeholder: string) => {
    const textarea = aboutInputRef.value?.textarea;
    const content = form.value.about ?? '';
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? start;
    const lineStart = content.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const nextLineBreak = content.indexOf('\n', end);
    const lineEnd = nextLineBreak === -1 ? content.length : nextLineBreak;
    const block = content.slice(lineStart, lineEnd) || placeholder;
    const replacement = block
      .split('\n')
      .map((line) => `${prefix}${line}`)
      .join('\n');
    const value = `${content.slice(0, lineStart)}${replacement}${content.slice(lineEnd)}`;
    setAboutSelection(value, lineStart + prefix.length, lineStart + replacement.length);
  };

  const insertOrderedList = () => {
    const textarea = aboutInputRef.value?.textarea;
    const content = form.value.about ?? '';
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? start;
    const lineStart = content.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const nextLineBreak = content.indexOf('\n', end);
    const lineEnd = nextLineBreak === -1 ? content.length : nextLineBreak;
    const block = content.slice(lineStart, lineEnd) || '列表项';
    const replacement = block
      .split('\n')
      .map((line, index) => `${index + 1}. ${line}`)
      .join('\n');
    const value = `${content.slice(0, lineStart)}${replacement}${content.slice(lineEnd)}`;
    setAboutSelection(value, lineStart + 3, lineStart + replacement.length);
  };

  /** 打开链接弹窗，选中的文字会自动作为链接文案。 */
  const openLinkDialog = () => {
    pendingSelection.value = getAboutSelection();
    linkInitialText.value = pendingSelection.value.text;
    linkDialogVisible.value = true;
  };

  const handleInsertLink = ({ text, url }: MarkdownLinkValue) => {
    const safeText = text.replaceAll(']', '\\]');
    insertAtSelection(`[${safeText}](${url})`, pendingSelection.value);
  };

  /** 打开代码块弹窗，选中的内容会自动带入代码输入框。 */
  const openCodeDialog = () => {
    pendingSelection.value = getAboutSelection();
    codeInitialCode.value = pendingSelection.value.text;
    codeDialogVisible.value = true;
  };

  const handleInsertCodeBlock = ({ language, code }: MarkdownCodeValue) => {
    insertAtSelection(`\`\`\`${language}\n${code}\n\`\`\``, pendingSelection.value, true);
  };

  /** 选择图片前保存当前光标位置，上传完成后仍插入到用户原来的编辑位置。 */
  const openImagePicker = () => {
    pendingSelection.value = getAboutSelection();
    aboutImageInputRef.value?.click();
  };

  /** 上传网站配置图片，并将返回的访问地址转换为 Markdown 图片语法。 */
  const handleAboutImageSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!ABOUT_IMAGE_TYPES.includes(file.type)) {
      ElMessage.warning('仅支持 JPG、PNG、GIF 或 WebP 图片');
      return;
    }
    if (file.size > ABOUT_IMAGE_MAX_SIZE) {
      ElMessage.warning('图片大小不能超过 5MB');
      return;
    }

    imageUploading.value = true;
    try {
      const url = await fetchUploadWebsiteConfigImage(file);
      const description = file.name.replace(/\.[^.]+$/, '').trim() || '图片';
      const safeDescription = description.replaceAll(']', '\\]');
      if (insertAtSelection(`![${safeDescription}](${url})`, pendingSelection.value, true)) {
        ElMessage.success('图片已上传并插入');
      }
    } catch {
      // 上传失败由请求拦截器统一展示错误信息
    } finally {
      imageUploading.value = false;
    }
  };

  const insertMarkdownDivider = () => {
    const textarea = aboutInputRef.value?.textarea;
    const content = form.value.about ?? '';
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? start;
    const before = start > 0 && content[start - 1] !== '\n' ? '\n\n' : '';
    const after = end < content.length && content[end] !== '\n' ? '\n\n' : '\n';
    const inserted = `${before}---${after}`;
    const value = `${content.slice(0, start)}${inserted}${content.slice(end)}`;
    const cursor = start + inserted.length;
    setAboutSelection(value, cursor, cursor);
  };
</script>

<style scoped lang="scss">
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
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    font-size: 19px;
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 11%, transparent);
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

  .card-body {
    padding: 22px;
  }

  .markdown-card-heading {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .markdown-heading-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .markdown-mode-switch {
    position: relative;
    display: inline-grid;
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

  .markdown-card-body {
    padding-top: 20px;
  }

  .markdown-form-item :deep(.el-form-item__content) {
    display: block;
  }

  .markdown-mode-content {
    min-height: 520px;
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

  .image-file-input {
    display: none;
  }

  .markdown-tool-divider {
    width: 1px;
    height: 20px;
    margin: 0 4px;
    background: var(--art-card-border);
  }

  .markdown-input :deep(.el-textarea__inner) {
    min-height: 460px !important;
    padding: 14px 16px 28px;
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
    font-size: 13px;
    line-height: 1.75;
    tab-size: 2;
    background: transparent;
    border-radius: 0;
    box-shadow: none;

    &:focus {
      box-shadow: none;
    }
  }

  .markdown-preview {
    min-height: 520px;
    padding: 26px 28px;
    overflow: auto;
    background: var(--default-box-color);
    border: 1px solid var(--art-card-border);
    border-radius: 8px;
  }

  .markdown-preview-content {
    :deep(pre.hljs) {
      padding: 16px 18px;
      color: #a6accd;
      background: #282c34;
    }

    :deep(pre.hljs code) {
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
    min-height: 466px;
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
      font-size: 12px !important;
      color: var(--art-gray-500) !important;
    }
  }

  .markdown-help {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    width: 100%;
    margin-top: 9px;
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

  @keyframes markdown-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media screen and (width <= 760px) {
    .panel-heading {
      margin-bottom: 12px;
    }
  }

  @media screen and (width <= 520px) {
    .card-heading,
    .card-body {
      padding-right: 16px;
      padding-left: 16px;
    }

    .markdown-card-heading {
      align-items: flex-start;
    }

    .markdown-heading-actions {
      align-items: flex-end;
    }

    .markdown-mode-switch button {
      padding: 0 9px;
    }

    .markdown-preview {
      min-height: 400px;
      padding: 20px 16px;
    }

    .markdown-preview-empty {
      min-height: 346px;
    }

    .markdown-mode-content {
      min-height: 400px;
    }

    .markdown-input :deep(.el-textarea__inner) {
      min-height: 350px !important;
    }
  }
</style>
