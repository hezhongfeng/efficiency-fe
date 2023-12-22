# efficiency-fe

说说前端开发最常用的场景--增删改查的逻辑复用。

可能每个人的具体工作内容不一致，但是应该都完成过这样的工作内容：

1. 列表查询，带分页和过滤条件
2. 新增，修改，查看，删除
3. 进行一些快捷操作，比如：激活、通过

这些最基础的工作可能占用了我们很大的时间和精力，下面来讨论下如何逻辑复用，提高工作效率

## 需求分析

一个后台管理中心，绝大部分都是这种管理页面，那么首先是把这些逻辑尽可能的复用，其次需要有一些定制化的能力

### 统一复用

1. 发起 http 请求
2. 后端接口参数校验返回的信息

### 列表的查询过程

1. 页面加载后的首次列表查询
2. 页面 loading 状态的维护
3. 翻页的逻辑和翻页后的列表重新查询
4. 过滤条件和模糊搜索的逻辑，还有对应的列表重新查询

### 新增 Item、查询 Item、修改 Item

 1. form 在提交过程的禁用状态
 2. 发起网络请求
 3. 后端接口返回的信息提示
 4. 列表重新查询

### 删除 Item

1. 删除按钮状态的维护(需要至少一个选中删除按钮才可用)
2. 发起网络请求
3. 后端接口返回的信息提示
4. 列表重新查询

### 定制化的内容

1. table 的列数据
2. item 的属性，也就是具体的表单
3. 快捷操作
4. 列表的过滤条件

## 成果展示

```vue
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
import urls from '@/common/urls';
import dayjs from 'dayjs';
import { NButton } from 'naive-ui';
import BizTable from '@/components/table/BizTable.vue';
import UserItem from './UserItem.vue';
import useQueryList from '@/composables/useQueryList';
import useDeleteList from '@/composables/useDeleteList';

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

// 自定义右上角筛选
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

```
