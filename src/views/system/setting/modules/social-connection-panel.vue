<template>
  <section class="setting-panel">
    <div class="panel-heading">
      <span class="panel-icon"><ArtSvgIcon icon="ri:links-line" /></span>
      <div>
        <h2>社交与连接</h2>
        <p>设置博客首页展示的社交主页和聊天室连接地址</p>
      </div>
    </div>

    <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
      <div class="card-heading">
        <div>
          <h3>社交主页</h3>
          <p>填写后会在博客首页的个人信息区域展示对应入口</p>
        </div>
      </div>
      <div class="card-body">
        <div class="social-link-list">
          <ElFormItem label="QQ 链接" prop="qqUrl" class="social-link-item">
            <div class="link-input-row">
              <ElInput
                v-model="form.qqUrl"
                placeholder="https://wpa.qq.com/xxx"
                clearable
                maxlength="200"
              >
                <template #prefix>
                  <ArtSvgIcon icon="ri:qq-fill" class="social-input-icon is-qq" />
                </template>
              </ElInput>
              <ElButton
                class="link-open-button"
                :disabled="!isHttpUrl(form.qqUrl)"
                aria-label="打开 QQ 链接"
                title="在新窗口打开"
                native-type="button"
                @click="openExternalLink(form.qqUrl)"
              >
                <ArtSvgIcon icon="ri:external-link-line" />
              </ElButton>
            </div>
          </ElFormItem>

          <ElFormItem label="GitHub 链接" prop="githubUrl" class="social-link-item">
            <div class="link-input-row">
              <ElInput
                v-model="form.githubUrl"
                placeholder="https://github.com/xxx"
                clearable
                maxlength="200"
              >
                <template #prefix>
                  <ArtSvgIcon icon="ri:github-fill" class="social-input-icon is-github" />
                </template>
              </ElInput>
              <ElButton
                class="link-open-button"
                :disabled="!isHttpUrl(form.githubUrl)"
                aria-label="打开 GitHub 链接"
                title="在新窗口打开"
                native-type="button"
                @click="openExternalLink(form.githubUrl)"
              >
                <ArtSvgIcon icon="ri:external-link-line" />
              </ElButton>
            </div>
          </ElFormItem>

          <ElFormItem label="Gitee 链接" prop="giteeUrl" class="social-link-item">
            <div class="link-input-row">
              <ElInput
                v-model="form.giteeUrl"
                placeholder="https://gitee.com/xxx"
                clearable
                maxlength="200"
              >
                <template #prefix>
                  <ArtSvgIcon icon="ri:gitee-fill" class="social-input-icon is-gitee" />
                </template>
              </ElInput>
              <ElButton
                class="link-open-button"
                :disabled="!isHttpUrl(form.giteeUrl)"
                aria-label="打开 Gitee 链接"
                title="在新窗口打开"
                native-type="button"
                @click="openExternalLink(form.giteeUrl)"
              >
                <ArtSvgIcon icon="ri:external-link-line" />
              </ElButton>
            </div>
          </ElFormItem>
        </div>
      </div>
    </ElCard>

    <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
      <div class="card-heading">
        <div>
          <h3>聊天室连接</h3>
          <p>供博客聊天室建立实时消息连接</p>
        </div>
      </div>
      <div class="card-body">
        <ElFormItem label="WebSocket 基础地址" prop="websocketUrl" class="!mb-0">
          <ElInput
            v-model="form.websocketUrl"
            placeholder="wss://example.com"
            clearable
            maxlength="200"
          >
            <template #prefix>
              <ArtSvgIcon icon="ri:signal-tower-fill" class="social-input-icon is-websocket" />
            </template>
          </ElInput>
          <p class="field-help">
            <ArtSvgIcon icon="ri:information-line" />
            <span>省略协议时前台会使用 ws://，并自动拼接 /ws/chat；生产环境建议使用 wss://。</span>
          </p>
        </ElFormItem>
      </div>
    </ElCard>
  </section>
</template>

<script setup lang="ts">
  import type { WebsiteConfigItem } from '@/apis/setting/types';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  const form = defineModel<WebsiteConfigItem>({ required: true });

  const isHttpUrl = (value: unknown): boolean => {
    if (typeof value !== 'string' || !value.trim()) return false;

    try {
      const url = new URL(value.trim());
      return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
    } catch {
      return false;
    }
  };

  const openExternalLink = (value: unknown) => {
    if (!isHttpUrl(value)) return;
    if (typeof value !== 'string') return;
    window.open(value.trim(), '_blank', 'noopener,noreferrer');
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

    :deep(.el-form-item__label) {
      padding-bottom: 7px;
      font-weight: 500;
      line-height: 1.3;
      color: var(--art-gray-700);
    }
  }

  .social-link-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .link-input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 40px;
    gap: 10px;
    width: 100%;
  }

  .link-open-button {
    align-self: stretch;
    width: 40px;
    height: auto;
    min-height: 40px;
    padding: 0;
    margin: 0;
    font-size: 17px;
  }

  .field-help {
    display: flex;
    gap: 5px;
    align-items: flex-start;
    width: 100%;
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--art-gray-600);

    :deep(.art-svg-icon) {
      flex-shrink: 0;
      margin-top: 1px;
      font-size: 15px;
      color: var(--theme-color);
    }
  }

  .social-input-icon {
    flex-shrink: 0;
    font-size: 20px;

    &.is-qq {
      color: #12b7f5;
    }

    &.is-github {
      color: var(--art-gray-800);
    }

    &.is-gitee {
      color: #c71d23;
    }

    &.is-websocket {
      font-size: 19px;
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

  @media screen and (width <= 760px) {
    .panel-heading {
      margin-bottom: 12px;
    }

    .social-link-item {
      margin-bottom: 18px;
    }
  }

  @media screen and (width <= 520px) {
    .card-heading,
    .card-body {
      padding-right: 16px;
      padding-left: 16px;
    }
  }
</style>
