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
    <user-item :show="showModel" :item-id="itemId" @model-show-change="onModelShowChange" @refresh-list="queryList" />
  </div>
</template>

<script setup name="user-mgmt">
import { h, ref, computed } from 'vue';
import BizTable from '@/components/table/BizTable.vue';
import UserItem from './UserItem.vue';
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
      return row.isActive ? '激活' : '未激活';
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
        )
      ];
    }
  }
];

const filters = ref([
  {
    label: '姓氏',
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

const onFilterChange = ({ index, type, value }) => {
  filters.value[index].value = value;
  queryList();
};

// 组织自定义参数
const parmas = computed(() => {
  return {
    isActive: filters.value[0].value,
    like: filters.value[1].value
  };
});

const { data, loading, pagination, onUpdatePage, onUpdatePageSize, queryList } = useQueryList(urls.user.user, parmas);

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
  content: '确定删除选中的用户？',
  url: urls.user.userDelete,
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
.user-mgmt {
  height: 100%;
  .filter-select {
    .biz-select {
      width: 100px;
    }
  }
}
</style>
