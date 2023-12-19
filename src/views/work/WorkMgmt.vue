<template>
  <div class="work-mgmt">
    <biz-table
      :operations="operations"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :row-key="rowKey"
      :checked-row-keys="checkedRowKeys"
      @operate="onOperate"
      @update:checked-row-keys="onCheckedRow"
      @update:page="onUpdatePage"
      @update:page-size="onUpdatePageSize"
    />
    <work-item :show="showModel" :item-id="itemId" @model-show-change="onModelShowChange" @refresh-list="queryList" />
  </div>
</template>

<script setup name="work-mgmt">
import { h, ref, computed } from 'vue';
import BizTable from '@/components/table/BizTable.vue';
import WorkItem from './WorkItem.vue';
import { NButton } from 'naive-ui';
import useQueryList from '@/composables/useQueryList';
import useDeleteList from '@/composables/useDeleteList';
import urls from '@/common/urls';
import dayjs from 'dayjs';

const columns = [
  {
    type: 'selection'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '说明',
    key: 'desc'
  },
  {
    title: '创建时间',
    key: 'createdAt'
  },
  {
    title: '更新时间',
    key: 'updatedAt'
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => onEdit(row),
            style: { marginRight: '5px' }
          },
          { default: () => '编辑' }
        )
      ];
    }
  }
];

const { data, loading, pagination, onUpdatePage, onUpdatePageSize, queryList } = useQueryList(urls.work.work);

// 列表数据
const tableData = computed(() =>
  data.value.list.map(item => {
    return {
      ...item,
      createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };
  })
);

// 删除列表相关逻辑
const { checkedRowKeys, onCheckedRow, deleteList } = useDeleteList({
  content: '确定删除选中的Work？',
  url: urls.work.userDelete,
  callback: () => {
    queryList();
  }
});

const operations = computed(() => {
  return [
    {
      name: 'create',
      label: '新增',
      type: 'primary'
    },
    {
      name: 'delete',
      label: '删除',
      disabled: checkedRowKeys.value.length === 0
    }
  ];
});

const onOperate = function (name) {
  operationFucs.get(name)();
};

const create = () => {
  showModel.value = true;
  itemId.value = 0;
};

const onModelShowChange = () => {
  showModel.value = !showModel.value;
};

const itemId = ref(0);

const showModel = ref(false);

const onEdit = row => {
  itemId.value = row.id;
  showModel.value = true;
};

const rowKey = row => row['id'];

// operation 函数集合
const operationFucs = new Map();
operationFucs.set('create', create);
operationFucs.set('delete', deleteList);
</script>

<style lang="scss">
.work-mgmt {
  height: 100%;
}
</style>
