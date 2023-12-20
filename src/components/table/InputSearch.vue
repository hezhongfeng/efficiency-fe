<template>
  <n-input-group class="input-search">
    <n-input :placeholder="placeholder || '请输入'" v-model:value="value" />
    <n-button type="primary" ghost @click="onClick"> 搜索 </n-button>
  </n-input-group>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  placeholder: {
    type: String
  }
});

const value = ref('');

const emit = defineEmits(['search']);

const onClick = () => {
  emit('search', value.value);
};
</script>

<style lang="scss">
.input-search {
}
</style>
