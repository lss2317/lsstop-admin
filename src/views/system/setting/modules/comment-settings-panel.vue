<template>
  <section class="setting-panel">
    <div class="panel-heading">
      <span class="panel-icon"><ArtSvgIcon icon="ri:chat-settings-line" /></span>
      <div>
        <h2>评论与留言</h2>
        <p>设置访客评论和留言的审核、邮件通知与敏感词处理规则</p>
      </div>
    </div>

    <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
      <div class="card-heading">
        <div>
          <h3>内容审核</h3>
          <p>控制访客内容公开前是否需要站长确认</p>
        </div>
        <span class="card-heading-icon"><ArtSvgIcon icon="ri:shield-check-line" /></span>
      </div>
      <div class="setting-rows">
        <div class="switch-row">
          <div>
            <strong>评论审核</strong>
            <p>开启后，新评论需要站长审核通过才会公开展示</p>
          </div>
          <ElSwitch v-model="form.enableCommentReview" :active-value="1" :inactive-value="0" />
        </div>
        <div class="switch-row">
          <div>
            <strong>留言审核</strong>
            <p>开启后，新留言需要站长审核通过才会公开展示</p>
          </div>
          <ElSwitch v-model="form.enableMessageReview" :active-value="1" :inactive-value="0" />
        </div>
      </div>
    </ElCard>

    <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
      <div class="card-heading">
        <div>
          <h3>邮件通知</h3>
          <p>选择需要通过邮件及时提醒的互动事件</p>
        </div>
        <span class="card-heading-icon"><ArtSvgIcon icon="ri:mail-send-line" /></span>
      </div>
      <div class="setting-rows">
        <div class="switch-row">
          <div>
            <strong>新评论通知</strong>
            <p>有新评论公开发布时，向站长发送提醒邮件</p>
          </div>
          <ElSwitch v-model="form.enableCommentEmailNotice" :active-value="1" :inactive-value="0" />
        </div>
        <div class="switch-row">
          <div>
            <strong>评论审核结果通知</strong>
            <p>评论审核通过后，向评论用户发送结果通知</p>
          </div>
          <ElSwitch
            v-model="form.enableCommentReviewNotice"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
        <div class="switch-row">
          <div>
            <strong>留言审核结果通知</strong>
            <p>留言审核通过后，向留言用户发送结果通知</p>
          </div>
          <ElSwitch
            v-model="form.enableMessageReviewNotice"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
      </div>
    </ElCard>

    <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
      <div class="card-heading">
        <div>
          <h3>敏感词策略</h3>
          <p>分别设置评论和留言命中敏感词后的处理方式</p>
        </div>
        <span class="card-heading-icon"><ArtSvgIcon icon="ri:filter-3-line" /></span>
      </div>
      <div class="card-body policy-body">
        <ElRow :gutter="20">
          <ElCol :xs="24" :md="12">
            <ElFormItem label="评论处理策略" prop="commentIllegalPolicy">
              <ElSelect v-model="form.commentIllegalPolicy" class="w-full">
                <ElOption
                  v-for="item in illegalPolicyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <p class="field-help">{{ getIllegalPolicyDescription(form.commentIllegalPolicy) }}</p>
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :md="12">
            <ElFormItem label="留言处理策略" prop="messageIllegalPolicy" class="!mb-0">
              <ElSelect v-model="form.messageIllegalPolicy" class="w-full">
                <ElOption
                  v-for="item in illegalPolicyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <p class="field-help">{{ getIllegalPolicyDescription(form.messageIllegalPolicy) }}</p>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </div>
    </ElCard>
  </section>
</template>

<script setup lang="ts">
  import type { WebsiteConfigItem } from '@/apis/setting/types';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  const form = defineModel<WebsiteConfigItem>({ required: true });

  /** 敏感词处理选项：0-拦截 1-转审核 2-替换发布 */
  const illegalPolicyOptions = [
    { label: '拦截', value: 0, description: '拒绝发布，并提示用户修改内容后重试。' },
    { label: '转审核', value: 1, description: '内容进入待审核列表，由站长决定是否发布。' },
    { label: '替换发布', value: 2, description: '替换命中的敏感内容后直接发布。' }
  ];

  const getIllegalPolicyDescription = (value: number) =>
    illegalPolicyOptions.find((item) => item.value === value)?.description ?? '';
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

  .card-heading-icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    font-size: 17px;
    color: var(--art-gray-600);
    background: var(--art-gray-200);
    border-radius: 9px;
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

  .setting-rows {
    padding: 0 22px;
  }

  .switch-row {
    display: flex;
    gap: 28px;
    align-items: center;
    justify-content: space-between;
    min-height: 76px;
    padding: 14px 2px;
    border-bottom: 1px solid var(--art-card-border);

    &:last-child {
      border-bottom: 0;
    }

    > div {
      min-width: 0;
    }

    strong {
      font-size: 13px;
      font-weight: 500;
      color: var(--art-gray-800);
    }

    p {
      margin-top: 5px;
      font-size: 12px;
      line-height: 1.5;
      color: var(--art-gray-500);
    }

    :deep(.el-switch) {
      flex-shrink: 0;
    }
  }

  .field-help {
    width: 100%;
    margin-top: 8px;
    font-size: 11px;
    line-height: 1.5;
    color: var(--art-gray-500);
  }

  .policy-body :deep(.el-form-item) {
    margin-bottom: 0;
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

    .card-heading-icon {
      display: none;
    }

    .setting-rows {
      padding: 0 16px;
    }

    .switch-row {
      gap: 18px;
    }
  }
</style>
