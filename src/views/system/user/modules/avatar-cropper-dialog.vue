<template>
  <ElDialog
    v-model="visible"
    title="裁剪头像"
    width="432px"
    align-center
    append-to-body
    :close-on-click-modal="false"
    class="avatar-cropper-dialog"
    @close="handleCancel"
  >
    <!-- 裁剪区域 -->
    <div class="cropper-content">
      <canvas
        ref="canvasRef"
        :width="canvasSize * 2"
        :height="canvasSize * 2"
        :style="{
          width: canvasSize + 'px',
          height: canvasSize + 'px',
          cursor: isDragging ? 'grabbing' : 'grab'
        }"
        @mousedown="startDrag"
        @touchstart.prevent="startDrag"
        @touchmove.prevent="onDrag"
        @touchend="endDrag"
        @wheel.prevent="onWheel"
      />

      <!-- 缩放控制 -->
      <div class="cropper-controls">
        <ArtSvgIcon
          icon="ri:zoom-out-line"
          class="zoom-icon"
          :class="{ disabled: !ready }"
          @click="zoomOut"
        />
        <ElSlider
          v-model="scale"
          :min="minScale"
          :max="maxScale"
          :step="0.01"
          :disabled="!ready"
          :show-tooltip="false"
          class="zoom-slider"
        />
        <ArtSvgIcon
          icon="ri:zoom-in-line"
          class="zoom-icon"
          :class="{ disabled: !ready }"
          @click="zoomIn"
        />
      </div>
    </div>

    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" :disabled="!ready" @click="handleSave">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue';

  interface Props {
    modelValue: boolean;
    imageFile: File | null;
    outputSize?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    outputSize: 400
  });

  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    save: [dataURL: string];
    close: [];
  }>();

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  // 常量定义
  const CANVAS_SIZE = 360;
  const RETINA_SCALE = 2;
  const MASK_PADDING = 20;
  const CROP_DIAMETER = CANVAS_SIZE - MASK_PADDING;
  const ZOOM_STEP = 0.1;
  const WHEEL_ZOOM_STEP = 0.05;

  // Canvas 相关
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const canvasSize = CANVAS_SIZE;
  const image = ref<HTMLImageElement | null>(null);

  // 缩放相关
  const scale = ref(1);
  const minScale = ref(1);
  const maxScale = computed(() => Math.max(minScale.value * 2, minScale.value + 1));

  // 位置相关
  const posX = ref(0);
  const posY = ref(0);

  // 拖拽相关
  const isDragging = ref(false);
  const dragStartX = ref(0);
  const dragStartY = ref(0);
  const startPosX = ref(0);
  const startPosY = ref(0);

  // 竞态控制
  let loadId = 0;

  // 初始化完成状态
  const ready = ref(false);

  // 监听弹窗打开
  watch(visible, async (val) => {
    if (val) {
      await nextTick();
      if (props.imageFile) loadImage(props.imageFile);
    } else {
      resetState();
    }
  });

  // 监听 imageFile 变化
  watch(
    () => props.imageFile,
    (file) => {
      if (visible.value && file) loadImage(file);
    }
  );

  // 重置状态
  const resetState = () => {
    loadId++;
    ready.value = false;
    image.value = null;
    scale.value = 1;
    minScale.value = 1;
    posX.value = 0;
    posY.value = 0;
    isDragging.value = false;
    dragStartX.value = 0;
    dragStartY.value = 0;
    startPosX.value = 0;
    startPosY.value = 0;
    removeWindowListeners();
  };

  // 加载图片
  const loadImage = (file: File) => {
    const currentLoadId = ++loadId;
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      if (currentLoadId !== loadId) return;
      image.value = img;
      initCropper();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      if (currentLoadId !== loadId) return;
      visible.value = false;
      emit('close');
    };

    img.src = url;
  };

  // 初始化裁剪器
  const initCropper = async () => {
    if (!image.value) return;

    const img = image.value;
    const scaleX = canvasSize / img.width;
    const scaleY = canvasSize / img.height;
    minScale.value = Math.max(scaleX, scaleY);

    posX.value = 0;
    posY.value = 0;

    await nextTick();
    scale.value = minScale.value;
    ready.value = true;
  };

  // 绘制画布
  const draw = () => {
    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image.value) return;

    const img = image.value;
    const displaySize = canvasSize * RETINA_SCALE;
    const maskRadius = displaySize / 2 - MASK_PADDING;

    ctx.clearRect(0, 0, displaySize, displaySize);

    // 填充背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, displaySize, displaySize);

    // 计算图片绘制参数
    const imgWidth = img.width * scale.value * RETINA_SCALE;
    const imgHeight = img.height * scale.value * RETINA_SCALE;
    const imgX = (displaySize - imgWidth) / 2 + posX.value * RETINA_SCALE;
    const imgY = (displaySize - imgHeight) / 2 + posY.value * RETINA_SCALE;

    // 绘制图片
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    // 绘制圆形遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, displaySize, displaySize);

    // 裁剪出圆形区域
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(displaySize / 2, displaySize / 2, maskRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 重新绘制圆形区域内的图片
    ctx.save();
    ctx.beginPath();
    ctx.arc(displaySize / 2, displaySize / 2, maskRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
    ctx.restore();

    // 绘制圆形边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(displaySize / 2, displaySize / 2, maskRadius, 0, Math.PI * 2);
    ctx.stroke();
  };

  // 监听缩放变化
  watch(scale, () => {
    constrainPosition();
    draw();
  });

  // 限制位置不超出边界
  const constrainPosition = () => {
    if (!image.value) return;
    const img = image.value;
    const imgWidth = img.width * scale.value;
    const imgHeight = img.height * scale.value;
    const maxOffsetX = Math.max(0, (imgWidth - canvasSize) / 2);
    const maxOffsetY = Math.max(0, (imgHeight - canvasSize) / 2);
    posX.value = Math.max(-maxOffsetX, Math.min(maxOffsetX, posX.value));
    posY.value = Math.max(-maxOffsetY, Math.min(maxOffsetY, posY.value));
  };

  // 拖拽事件
  const startDrag = (e: MouseEvent | TouchEvent) => {
    const point = 'touches' in e ? e.touches[0] : e;
    if (!point) return;
    isDragging.value = true;
    dragStartX.value = point.clientX;
    dragStartY.value = point.clientY;
    startPosX.value = posX.value;
    startPosY.value = posY.value;
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    const point = 'touches' in e ? e.touches[0] : e;
    if (!point) return;
    posX.value = startPosX.value + (point.clientX - dragStartX.value);
    posY.value = startPosY.value + (point.clientY - dragStartY.value);
    constrainPosition();
    draw();
  };

  const onWindowMouseMove = (e: MouseEvent) => onDrag(e);
  const onWindowMouseUp = () => endDrag();

  const endDrag = () => {
    isDragging.value = false;
    removeWindowListeners();
  };

  const removeWindowListeners = () => {
    window.removeEventListener('mousemove', onWindowMouseMove);
    window.removeEventListener('mouseup', onWindowMouseUp);
  };

  onUnmounted(() => removeWindowListeners());

  // 滚轮缩放
  const onWheel = (e: WheelEvent) => {
    const delta = e.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP;
    scale.value = Math.max(minScale.value, Math.min(maxScale.value, scale.value + delta));
  };

  // 缩放按钮
  const zoomIn = () => {
    if (!ready.value) return;
    scale.value = Math.min(maxScale.value, scale.value + ZOOM_STEP);
  };

  const zoomOut = () => {
    if (!ready.value) return;
    scale.value = Math.max(minScale.value, scale.value - ZOOM_STEP);
  };

  // 保存裁剪结果
  const handleSave = () => {
    if (!image.value) return;

    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) return;

    const size = props.outputSize;
    outputCanvas.width = size;
    outputCanvas.height = size;

    const img = image.value;
    const ratio = size / CROP_DIAMETER;

    const imgWidth = img.width * scale.value * ratio;
    const imgHeight = img.height * scale.value * ratio;
    const imgX = (size - imgWidth) / 2 + posX.value * ratio;
    const imgY = (size - imgHeight) / 2 + posY.value * ratio;

    outputCtx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    const dataURL = outputCanvas.toDataURL('image/jpeg', 0.92);
    emit('save', dataURL);
    visible.value = false;
  };

  // 取消
  const handleCancel = () => {
    visible.value = false;
    emit('close');
  };
</script>

<style scoped lang="scss">
  .cropper-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    canvas {
      touch-action: none;
      border-radius: 8px;
    }
  }

  .cropper-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin-top: 20px;
  }

  .zoom-icon {
    font-size: 20px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: color 0.2s;
    flex-shrink: 0;

    &:hover:not(.disabled) {
      color: var(--el-text-color-primary);
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  .zoom-slider {
    flex: 1;
  }
</style>
