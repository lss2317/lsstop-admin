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
          <span class="markdown-badge">
            <ArtSvgIcon icon="ri:markdown-line" />
            Markdown
          </span>
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
                      title="链接"
                      aria-label="插入链接"
                      @click="insertMarkdownLink"
                    >
                      <ArtSvgIcon icon="ri:link" />
                    </button>
                    <button
                      type="button"
                      class="markdown-tool"
                      title="图片"
                      aria-label="插入图片"
                      @click="insertMarkdownImage"
                    >
                      <ArtSvgIcon icon="ri:image-line" />
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
                      title="代码块"
                      aria-label="插入代码块"
                      @click="wrapMarkdown('```\n', '\n```', '代码')"
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
  </section>
</template>

<script setup lang="ts">
  import type { WebsiteConfigItem } from '@/apis/setting/types';
  import type { InputInstance } from 'element-plus';
  import MarkdownIt from 'markdown-it';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  const form = defineModel<WebsiteConfigItem>({ required: true });
  const aboutInputRef = ref<InputInstance>();
  const aboutMode = ref<'edit' | 'preview'>('edit');

  const aboutMarkdownPlaceholder = `# 关于我

你好，我是……

## 创作方向

- 技术分享
- 生活记录`;

  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
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

  const insertMarkdownLink = () => wrapMarkdown('[', '](https://)', '链接文字');
  const insertMarkdownImage = () => wrapMarkdown('![', '](https://)', '图片描述');

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

  .markdown-badge {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    height: 21px;
    padding: 0 7px;
    font-size: 10px;
    font-weight: 500;
    line-height: 21px;
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--theme-color) 18%, transparent);
    border-radius: 5px;
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

    .markdown-badge {
      display: none;
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
