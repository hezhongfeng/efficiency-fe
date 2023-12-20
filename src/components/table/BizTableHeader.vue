<template>
  <div class="biz-table-header">
    <biz-table-operations :operations="operations" @operate="onOperate"> </biz-table-operations>
    <biz-table-filters :filters="filters" @filter-change="onFilterChange"></biz-table-filters>
  </div>
</template>

<script setup>
import BizTableOperations from './BizTableOperations.vue';
import BizTableFilters from './BizTableFilters.vue';

defineProps({
  operations: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['operate', 'filter-change']);

const onOperate = name => {
  emit('operate', name);
};

const onFilterChange = ({ index, type, value }) => {
  console.log(30);
  emit('filter-change', { index, type, value });
};
</script>

<style lang="scss">
.biz-table-header {
  display: flex;
  justify-content: space-between;
}
</style>
