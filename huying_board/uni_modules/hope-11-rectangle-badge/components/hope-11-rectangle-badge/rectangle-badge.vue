<template>
  <view class="rectangle-badge-container">
    <slot></slot>
    <view class="content"
      :class="`type-${type} position-${position} size-${size} ${plain ? 'plain' : ''} ${border ? 'border' : ''}`"
      :style="contentStyle" @click="onClick">
      {{ typeof(value) === 'string' ? value : value.label }}
      <view class="triangle" :style="triangleStyle"></view>
    </view>
  </view>
</template>
<script setup>
  import {
    computed
  } from 'vue';
  const props = defineProps({
    value: {
      type: [String, Object],
      default: '',
      required: true,
    },
    type: {
      type: String,
      default: 'default',
      validator: value => ['default', 'primary', 'success', 'warning', 'error'].includes(value),
    },
    position: {
      type: String,
      default: 'tr',
      validator: value => ['tl', 'bl', 'tr', 'br'].includes(value),
    },
    size: {
      type: String,
      default: 'default',
      validator: value => ['default', 'mini', 'middle', 'large'].includes(value)
    },
    plain: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    color: {
      type: Array,
      default: () => [],
      validator: value => !!value || value.length === 2
    },
    minWidth: {
      type: String,
      default: '',
    }
  })

  const contentStyle = computed(() => {
    const {
      color,
      plain,
      border,
      minWidth,
    } = props

    const style = {}

    if (Array.isArray(color) && color.length === 2) {
      if (plain && border) {
        style.backgroundColor = color[1]
        style.borderColor = color[0] + ' !important'
        style.color = color[0]
      } else if (plain && !border) {
        style.backgroundColor = color[1]
        style.borderColor = color[1] + ' !important'
        style.color = color[0]
      } else {
        style.backgroundColor = color[0]
        style.borderColor = color[0] + ' !important'
        style.color = 'white'
      }
    }

    if (minWidth) {
      style.minWidth = minWidth
    }

    return style
  })
  const triangleStyle = computed(() => {
    const {
      color,
      plain,
      border,
    } = props

    const style = {}
    if (plain && border) {
      style.backgroundColor = color[0]
    } else if (plain && !border) {
      style.backgroundColor = color[1]
    } else {
      style.backgroundColor = color[0]
    }

    return style
  })

  const emit = defineEmits(['click']);
  const onClick = () => {
    emit('click', props.value)
  }
</script>
<style lang="scss" scoped>
  $default-color: #8f939c;
  $default-color-light: #e9e9eb;
  $primary-color: #2979ff;
  $primary-color-light: #d4e4ff;
  $success-color: #18bc37;
  $success-color-light: #d1f2d7;
  $warning-color: #f3a73f;
  $warning-color-light: #fdedd9;
  $error-color: #e43d33;
  $error-color-light: #fad8d6;

  .rectangle-badge-container {
    position: relative;

    .content {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;

      padding: 4rpx 12rpx;
      font-size: 24rpx;
      line-height: 32rpx;

      border-width: 1rpx;
      border-style: solid;

      background-color: $default-color;
      border-color: $default-color;
      color: white;

      top: -8rpx;
      right: -8rpx;
      border-radius: 8rpx 8rpx 0 8rpx;

      & .triangle {
        content: '';
        position: absolute;
        width: 9rpx;
        height: 9rpx;
        filter: brightness(.75);

        background-color: $default-color;

        top: auto;
        right: -1rpx;
        bottom: -9rpx;
        left: auto;
        clip-path: polygon(0 0, 100% 0, 0 100%);
      }

      &.plain {
        background-color: $default-color-light;
        border-color: $default-color-light;
        color: $default-color;

        & .triangle {
          background-color: $default-color-light;
        }
      }

      &.border {
        border-color: $default-color;

        & .triangle {
          background-color: $default-color;
        }
      }

    }

    .type-default {
      background-color: $default-color;
      border-color: $default-color;

      & .triangle {
        background-color: $default-color;
      }

      &.plain {
        background-color: $default-color-light;
        border-color: $default-color-light;
        color: $default-color;

        & .triangle {
          background-color: $default-color-light;
        }
      }

      &.border {
        border-color: $default-color !important;

        & .triangle {
          background-color: $default-color;
        }
      }
    }

    .type-primary {
      background-color: $primary-color;
      border-color: $primary-color;

      & .triangle {
        background-color: $primary-color;
      }

      &.plain {
        background-color: $primary-color-light;
        border-color: $primary-color-light;
        color: $primary-color;

        & .triangle {
          background-color: $primary-color-light;
        }
      }

      &.border {
        border-color: $primary-color !important;

        & .triangle {
          background-color: $primary-color;
        }
      }
    }

    .type-success {
      background-color: $success-color;
      border-color: $success-color;

      & .triangle {
        background-color: $success-color;
      }

      &.plain {
        background-color: $success-color-light;
        border-color: $success-color-light;
        color: $success-color;

        & .triangle {
          background-color: $success-color-light;
        }
      }

      &.border {
        border-color: $success-color !important;

        & .triangle {
          background-color: $success-color;
        }
      }
    }

    .type-warning {
      background-color: $warning-color;
      border-color: $warning-color;

      & .triangle {
        background-color: $warning-color;
      }

      &.plain {
        background-color: $warning-color-light;
        border-color: $warning-color-light;
        color: $warning-color;

        & .triangle {
          background-color: $warning-color-light;
        }
      }

      &.border {
        border-color: $warning-color !important;

        & .triangle {
          background-color: $warning-color;
        }
      }
    }

    .type-error {
      background-color: $error-color;
      border-color: $error-color;

      & .triangle {
        background-color: $error-color;
      }

      &.plain {
        background-color: $error-color-light;
        border-color: $error-color-light;
        color: $error-color;

        & .triangle {
          background-color: $error-color-light;
        }
      }

      &.border {
        border-color: $error-color !important;

        & .triangle {
          background-color: $error-color;
        }
      }
    }

    .position-tl {
      top: -8rpx;
      right: auto;
      bottom: auto;
      left: -8rpx;
      border-radius: 8rpx 8rpx 8rpx 0;

      & .triangle {
        top: auto;
        right: auto;
        bottom: -9rpx;
        left: -1rpx;
        clip-path: polygon(0 0, 100% 0, 100% 100%);
      }
    }

    .position-bl {
      top: auto;
      right: auto;
      bottom: -8rpx;
      left: -8rpx;
      border-radius: 0 8rpx 8rpx 8rpx;

      & .triangle {
        top: -9rpx;
        right: auto;
        bottom: auto;
        left: -1rpx;
        clip-path: polygon(100% 100%, 100% 0, 0 100%);
      }
    }

    .position-tr {
      top: -8rpx;
      right: -8rpx;
      bottom: auto;
      left: auto;
      border-radius: 8rpx 8rpx 0 8rpx;

      & .triangle {
        top: auto;
        right: -1rpx;
        bottom: -9rpx;
        left: auto;
        clip-path: polygon(0 0, 100% 0, 0 100%);
      }
    }

    .position-br {
      top: auto;
      right: -8rpx;
      bottom: -8rpx;
      left: auto;
      border-top-right-radius: 0;
      border-radius: 8rpx 0 8rpx 8rpx;

      & .triangle {
        top: -9rpx;
        right: -1rpx;
        bottom: auto;
        left: auto;
        clip-path: polygon(100% 100%, 0 0, 0 100%);
      }
    }

    .size-default {
      padding: 4rpx 12rpx;
      font-size: 24rpx;
      line-height: 36rpx;
    }

    .size-mini {
      padding: 3rpx 10rpx;
      font-size: 20rpx;
      line-height: 30rpx;
    }

    .size-middle {
      padding: 5rpx 14rpx;
      font-size: 28rpx;
      line-height: 42rpx;
    }

    .size-large {
      padding: 5rpx 16rpx;
      font-size: 32rpx;
      line-height: 48rpx;
    }

  }
</style>