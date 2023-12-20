<template>
  <n-input-group class="input-search">
    <n-input :placeholder="placeholder || '请输入'" v-model:value="value" />
    <n-button @click="onClick">
      <template #icon>
        <n-icon><Search /></n-icon>
      </template>
    </n-button>
  </n-input-group>
</template>

<script setup>
import { ref } from 'vue';
import { Search } from '@vicons/carbon';

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
