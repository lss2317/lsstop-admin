<template>
  <section class="setting-panel">
    <div class="panel-heading">
      <span class="panel-icon"><ArtSvgIcon icon="ri:global-line" /></span>
      <div>
        <h2>博客信息</h2>
        <p>设置博主头像、用户默认头像和博客基本信息</p>
      </div>
    </div>

    <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
      <div class="card-heading">
        <div>
          <h3>头像设置</h3>
          <p>分别设置博主个人头像和用户默认头像</p>
        </div>
      </div>

      <div class="media-grid">
        <div class="media-setting">
          <ElUpload
            class="avatar-upload"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="(file: UploadFile) => emit('avatarChange', 'siteAvatar', file)"
          >
            <div class="avatar-frame">
              <ElImage
                v-if="form.siteAvatar"
                :src="form.siteAvatar"
                class="avatar-preview"
                fit="cover"
              />
              <div v-else class="avatar-placeholder">
                <ArtSvgIcon icon="ri:image-add-line" />
              </div>
              <span class="avatar-mask">
                <ArtSvgIcon icon="ri:camera-line" />
                更换
              </span>
            </div>
          </ElUpload>
          <div class="media-copy">
            <strong>博主头像</strong>
            <p>展示在博客首页、侧边栏和“关于我”页面</p>
            <span>建议上传主体居中的 1:1 图片，支持 JPG、PNG、GIF 或 WebP，不超过 5MB</span>
          </div>
        </div>

        <div class="media-setting">
          <ElUpload
            class="avatar-upload"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="(file: UploadFile) => emit('avatarChange', 'defaultUserAvatar', file)"
          >
            <div class="avatar-frame">
              <ElImage
                v-if="form.defaultUserAvatar"
                :src="form.defaultUserAvatar"
                class="avatar-preview"
                fit="cover"
              />
              <div v-else class="avatar-placeholder">
                <ArtSvgIcon icon="ri:user-add-line" />
              </div>
              <span class="avatar-mask">
                <ArtSvgIcon icon="ri:camera-line" />
                更换
              </span>
            </div>
          </ElUpload>
          <div class="media-copy">
            <strong>用户默认头像</strong>
            <p>新用户注册或后台创建用户时，未设置头像将使用</p>
            <span>同时用于头像缺失场景；支持 JPG、PNG、GIF 或 WebP，不超过 5MB</span>
          </div>
        </div>
      </div>
    </ElCard>

    <ElCard class="art-card config-card" :body-style="{ padding: '0' }">
      <div class="card-heading">
        <div>
          <h3>基本信息</h3>
          <p>用于博客首页、文章详情、页脚和友情链接资料</p>
        </div>
      </div>

      <div class="card-body">
        <ElRow :gutter="20">
          <ElCol :xs="24" :md="12">
            <ElFormItem label="博客名称" prop="siteName">
              <ElInput
                v-model="form.siteName"
                placeholder="请输入博客名称"
                clearable
                maxlength="50"
              >
                <template #prefix>
                  <ArtSvgIcon icon="ri:book-open-line" class="basic-input-icon is-blog" />
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :md="12">
            <ElFormItem label="博主名称" prop="siteAuthor">
              <ElInput
                v-model="form.siteAuthor"
                placeholder="请输入博主名称"
                clearable
                maxlength="50"
              >
                <template #prefix>
                  <ArtSvgIcon icon="ri:user-star-line" class="basic-input-icon is-author" />
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :md="12">
            <ElFormItem label="博客创建时间" prop="siteStartTime">
              <ElDatePicker
                v-model="form.siteStartTime"
                type="datetime"
                value-format="YYYY-MM-DDTHH:mm:ss"
                placeholder="请选择博客创建时间"
                :prefix-icon="CalendarEventIcon"
                class="w-full"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24">
            <ElFormItem label="博客简介" prop="siteIntro">
              <ElInput
                v-model="form.siteIntro"
                type="textarea"
                :rows="4"
                resize="none"
                placeholder="用一句简短的话介绍你的博客"
                maxlength="500"
                show-word-limit
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </div>
    </ElCard>
  </section>
</template>

<script setup lang="ts">
  import type { WebsiteConfigItem } from '@/apis/setting/types';
  import type { UploadFile } from 'element-plus';
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';
  import type { AvatarField } from '../types';

  const CalendarEventIcon = () =>
    h(ArtSvgIcon, { icon: 'ri:calendar-event-line', class: 'basic-input-icon is-date' });

  const form = defineModel<WebsiteConfigItem>({ required: true });
  const emit = defineEmits<{
    avatarChange: [field: AvatarField, file: UploadFile];
  }>();
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

    :deep(.basic-input-icon) {
      font-size: 18px;

      &.is-blog {
        color: var(--theme-color);
      }

      &.is-author {
        color: #8b5cf6;
      }

      &.is-date {
        color: #f59e0b;
      }
    }
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    padding: 20px 22px 22px;
  }

  .media-setting {
    display: flex;
    gap: 16px;
    align-items: center;
    min-width: 0;
    padding: 16px;
    background: var(--art-gray-100);
    border: 1px solid var(--art-card-border);
    border-radius: calc(var(--custom-radius) / 2 + 5px);
  }

  .avatar-frame,
  .avatar-preview,
  .avatar-placeholder {
    width: 88px;
    height: 88px;
    border-radius: 13px;
  }

  .avatar-frame {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      .avatar-mask {
        opacity: 1;
      }

      .avatar-preview,
      .avatar-placeholder {
        transform: scale(1.04);
      }
    }
  }

  .avatar-preview,
  .avatar-placeholder {
    transition: transform 0.25s ease;
  }

  .avatar-placeholder {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: var(--art-gray-500);
    background: var(--default-box-color);
    border: 1px dashed var(--art-gray-400);
  }

  .avatar-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #fff;
    background: rgb(15 23 42 / 56%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .media-copy {
    min-width: 0;

    strong {
      font-size: 14px;
      font-weight: 600;
      color: var(--art-gray-800);
    }

    p {
      margin-top: 5px;
      font-size: 12px;
      line-height: 1.6;
      color: var(--art-gray-600);
    }

    span {
      display: block;
      margin-top: 8px;
      font-size: 11px;
      line-height: 1.5;
      color: var(--art-gray-500);
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

  @media screen and (width <= 980px) {
    .media-grid {
      grid-template-columns: 1fr;
    }

    .media-setting {
      min-height: 122px;
    }
  }

  @media screen and (width <= 760px) {
    .panel-heading {
      margin-bottom: 12px;
    }
  }

  @media screen and (width <= 520px) {
    .card-heading,
    .card-body,
    .media-grid {
      padding-right: 16px;
      padding-left: 16px;
    }

    .media-setting {
      align-items: flex-start;
      padding: 14px;
    }

    .avatar-frame,
    .avatar-preview,
    .avatar-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 11px;
    }

    .media-copy span {
      display: none;
    }
  }
</style>
