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
        <ElRow :gutter="20">
          <ElCol :xs="24">
            <ElFormItem label="QQ 链接" prop="qqUrl">
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
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24">
            <ElFormItem label="GitHub 链接" prop="githubUrl">
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
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24">
            <ElFormItem label="Gitee 链接" prop="giteeUrl" class="!mb-0">
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
            </ElFormItem>
          </ElCol>
        </ElRow>
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
          <p class="field-help">前台会自动拼接 /ws/chat，生产环境请使用加密协议 wss://。</p>
        </ElFormItem>
      </div>
    </ElCard>
  </section>
</template>

<script setup lang="ts">
  import type { WebsiteConfigItem } from '@/apis/setting/types';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  const form = defineModel<WebsiteConfigItem>({ required: true });
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

  .field-help {
    width: 100%;
    margin-top: 8px;
    font-size: 11px;
    line-height: 1.5;
    color: var(--art-gray-500);
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
  }

  @media screen and (width <= 520px) {
    .card-heading,
    .card-body {
      padding-right: 16px;
      padding-left: 16px;
    }
  }
</style>
