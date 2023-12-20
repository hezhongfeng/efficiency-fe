<template>
  <div class="biz-table-filters">
    <div v-for="(filter, index) of filters" :key="index" class="filter-wrap">
      <label class="filter-label" v-if="filter.label" :class="filter.class">{{ filter.label }}</label>
      <!-- 选择器 -->
      <div v-if="filter.type === 'select'" class="biz-select" :class="filter.class">
        <n-select :value="filter.value" :options="filter.options" @update:value="handleChange(index, filter.type, $event)" />
      </div>
      <!-- 搜索框 -->
      <div v-if="filter.type === 'input'" class="biz-input" :class="filter.class">
        <input-search :placeholder="filter.placeholder" @search="handleChange(index, filter.type, $event)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSearch from './InputSearch.vue';

defineProps({
  filters: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['filter-change']);

const handleChange = (index, type, value) => {
  console.log('type, value', index, type, value);
  // 搜索框
  if (type === 'input') {
    emit('filter-change', {
      index,
      type,
      value
    });
  } else if (type === 'select') {
    emit('filter-change', {
      index,
      type,
      value: value[0]
    });
  }
};
</script>

<style lang="scss">
.biz-table-filters {
  margin-right: 10px;
  display: flex;
  .filter-wrap:not(:first-child) {
    margin-left: 10px;
  }
  .filter-wrap {
    display: flex;
    align-items: center;
    .filter-label {
      margin-right: 6px;
    }
    .ant-calendar-picker {
      width: 220px;
    }
    .ant-calendar-range-picker-input {
      height: 100%;
    }
  }
}
</style>
