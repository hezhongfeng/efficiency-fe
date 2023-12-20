<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="dialog"
    :title="title"
    class="work-item"
    positive-text="确认"
    negative-text="取消"
    @update:show="onChangeModel"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :disabled="formDisabled" :model="formModel" class="form" :rules="rules">
      <n-form-item label="名称" path="name">
        <n-input v-model:value="formModel.name" placeholder="请输入 work 名称" />
      </n-form-item>
      <n-form-item label="说明" path="desc">
        <n-input v-model:value="formModel.desc" placeholder="请输入 work 说明" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup name="work-item">
import { ref, toRefs, watch, computed } from 'vue';
import urls from '@/common/urls';
import useCreateItem from '@/composables/useCreateItem';
import useUpdateItem from '@/composables/useUpdateItem';
import useQueryItem from '@/composables/useQueryItem';

const props = defineProps({
  itemId: {
    type: Number,
    required: true
  },
  show: Boolean
});

const { itemId, show } = toRefs(props);

const emit = defineEmits(['model-show-change', 'refresh-list']);

const formModel = ref({
  name: null,
  desc: null
});

const { formDisabled, createItem } = useCreateItem({
  url: urls.work.work,
  formModel,
  callback: () => {
    emit('model-show-change');
    emit('refresh-list');
  }
});

const { updateItem } = useUpdateItem({
  formModel,
  callback: () => {
    emit('model-show-change');
    emit('refresh-list');
  },
  formDisabled
});

const { queryItem } = useQueryItem({
  formDisabled,
  callback: data => {
    formModel.value.name = data.name;
    formModel.value.desc = data.desc;
  }
});

const formRef = ref(null);

const onChangeModel = () => {
  emit('model-show-change');
};

const title = computed(() => {
  return itemId.value ? '编辑Work' : '新增Work';
});

watch(show, val => {
  if (val) {
    if (itemId.value) {
      queryItem({ url: `${urls.work.work}/${itemId.value}` });
    } else {
      reSetFormDate();
    }
  }
});

// reset form 数据
const reSetFormDate = () => {
  formModel.value.name = null;
  formModel.value.desc = null;
};

const submitCallback = () => {
  formRef.value.validate(errors => {
    if (!errors) {
      if (itemId.value) {
        updateItem({ url: `${urls.work.work}/${itemId.value}` });
      } else {
        createItem();
      }
    } else {
      console.log(errors);
    }
  });

  // 禁止默认的关闭 model 行为
  return false;
};

const rules = {
  name: { required: true, message: '请输入', trigger: 'blur' }
};
</script>

<style lang="scss">
.work-item {
  .form {
    margin-top: 20px;
  }
}
</style>
