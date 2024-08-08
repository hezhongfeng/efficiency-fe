<template>
  <div class="user-mgmt">
    <biz-table
      :operations="operations"
      :filters="filters"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :row-key="rowKey"
      :checked-row-keys="checkedRowKeys"
      @operate="onOperate"
      @filter-change="onFilterChange"
      @update:checked-row-keys="onCheckedRow"
      @update:page="onUpdatePage"
      @update:page-size="onUpdatePageSize"
    />
    <user-item v-if="showModel" :item-id="itemId" @model-show-change="onModelShowChange" @refresh-list="queryList" />
  </div>
</template>

<script setup name="user-mgmt">
import { h, ref, computed } from 'vue';
import urls from '@/common/urls';
import dayjs from 'dayjs';
import { NButton } from 'naive-ui';
import BizTable from '@/components/table/BizTable.vue';
import UserItem from './UserItem.vue';
import useQueryList from '@/composables/useQueryList';
import useDeleteList from '@/composables/useDeleteList';
import useChangeUserActiveState from './useChangeUserActiveState';

// 自定义列数据
const columns = [
  {
    type: 'selection'
  },
  {
    title: '姓',
    key: 'firstName'
  },
  {
    title: '名',
    key: 'lastName'
  },
  {
    title: '是否激活',
    key: 'isActive',
    render(row) {
      return row.isActive ? '已激活' : '未激活';
    }
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
        ),
        h(
          NButton,
          {
            size: 'small',
            onClick: () => onChangeUserActiveState(row),
            style: { marginRight: '5px' }
          },
          { default: () => '改变状态' }
        )
      ];
    }
  }
];

// 自定义右上角筛选
const filters = ref([
  {
    label: '是否激活',
    type: 'select',
    value: '0',
    class: 'filter-select',
    options: [
      {
        label: '全部',
        value: '0'
      },
      {
        label: '已激活',
        value: '1'
      },
      {
        label: '未激活',
        value: '2'
      }
    ]
  },
  {
    label: '',
    type: 'input',
    placeholder: '请输入姓氏',
    value: ''
  }
]);

// 筛选变化，需要重新查询列表
const onFilterChange = ({ index, type, value }) => {
  filters.value[index].value = value;
  queryList();
};

// 自定义查询列表参数
const parmas = computed(() => {
  return {
    isActive: filters.value[0].value,
    like: filters.value[1].value
  };
});

// 封装好的查询列表方法和返回的数据
const { data, loading, pagination, onUpdatePage, onUpdatePageSize, queryList } = useQueryList(urls.user.user, parmas);

// 经过处理的列表数据，用于在 table 中展示
const tableData = computed(() =>
  data.value.list.map(item => {
    return {
      ...item,
      createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };
  })
);

// 删除列表相关逻辑封装
const { checkedRowKeys, onCheckedRow, deleteList } = useDeleteList({
  content: '确定删除选中的用户？',
  url: urls.user.userDelete,
  callback: () => {
    queryList();
  }
});

// 列表中的快捷操作
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

// 触发操作函数
const onOperate = function (name) {
  operationFucs.get(name)();
};

// 新创建 item
const create = () => {
  showModel.value = true;
  itemId.value = 0;
};

const onModelShowChange = () => {
  showModel.value = !showModel.value;
};

const itemId = ref(0);

// 控制模态对话框
const showModel = ref(false);

// 编辑 item
const onEdit = row => {
  itemId.value = row.id;
  showModel.value = true;
};

const { changeUserActiveState } = useChangeUserActiveState();

// 改变激活状态
const onChangeUserActiveState = row => {
  changeUserActiveState({
    id: row.id,
    isActive: !row.isActive,
    loading,
    callback: () => {
      queryList();
    }
  });
};

// 指定 table 的 rowKey
const rowKey = row => row['id'];

// operation 函数集合
const operationFucs = new Map();
operationFucs.set('create', create);
operationFucs.set('delete', deleteList);
</script>

<style lang="scss">
.user-mgmt {
  height: 100%;
  .filter-select {
    .biz-select {
      width: 100px;
    }
  }
}
</style>
