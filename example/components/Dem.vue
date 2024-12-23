<template>
  <div class="">
    <!-- @slot 默认插槽 -->
    <slot></slot>
    <!-- 
      @slot 子插槽
      @binding {object} data 数据
      @binding {string} title 标题
    -->
    <slot name="child" :data="data" :title="title"></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineOptions({
  name: 'Demo',
});

const props = defineProps({
  /**
   * 音乐数据
   */
  musicData: {
    type: Object,
    default: () => ({}),
  },
  /**
   * 大小
   * @ignore 下面是可选值
   * @values small, medium, large, normal
   */
  size: {
    default: 'normal',
  },
});

const data = ref({});
const title = ref('hello world');

const show = (val, val2) => {
  console.log(val, val2);
};

const emit = defineEmits([
  /**
   * 提交数据
   * @param {string} val 名称入参
   * @param {number} val2 名称2
   */
  'submit',
  /**
   * 更新事件
   */
  'updateName',
]);

defineExpose({
  /**
   * 展示方法
   * @type {function}
   * @param {string} val 入参
   * @param {number} val2 入参2
   */
  show,
  /**
   * 暴露的标题
   * @type {string}
   */
  title,
});
</script>

<style scoped></style>
