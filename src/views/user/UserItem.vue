<template>
  <n-modal
    :mask-closable="false"
    :show="true"
    preset="dialog"
    :title="title"
    class="user-item"
    positive-text="确认"
    negative-text="取消"
    @update:show="onChangeModel"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :disabled="formDisabled" :model="formModel" class="form" :rules="rules">
      <n-form-item label="姓" path="firstName">
        <n-input v-model:value="formModel.firstName" placeholder="请输入姓氏" />
      </n-form-item>
      <n-form-item label="名" path="lastName">
        <n-input v-model:value="formModel.lastName" placeholder="请输入名字" />
      </n-form-item>
      <n-form-item label="是否激活" path="isActive">
        <n-switch v-model:value="formModel.isActive" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup name="user-item">
import { ref, toRefs, computed, onMounted } from 'vue';
import urls from '@/common/urls';
import useCreateItem from '@/composables/useCreateItem';
import useUpdateItem from '@/composables/useUpdateItem';
import useQueryItem from '@/composables/useQueryItem';

const props = defineProps({
  itemId: {
    type: Number,
    required: true
  }
});

const { itemId } = toRefs(props);

const emit = defineEmits(['model-show-change', 'refresh-list']);

const formModel = ref({
  firstName: null,
  lastName: null,
  isActive: true
});

const { formDisabled, createItem } = useCreateItem({
  url: urls.user.user,
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
    formModel.value.firstName = data.firstName;
    formModel.value.lastName = data.lastName;
    formModel.value.isActive = data.isActive;
  }
});

const formRef = ref(null);

const onChangeModel = () => {
  emit('model-show-change');
};

const title = computed(() => {
  return itemId.value ? '编辑用户' : '新增用户';
});

onMounted(() => {
  if (itemId.value) {
    queryItem.value = true;
    queryItem({ url: `${urls.user.user}/${itemId.value}` });
  }
});

const submitCallback = () => {
  formRef.value.validate(errors => {
    if (!errors) {
      if (itemId.value) {
        updateItem({ url: `${urls.user.user}/${itemId.value}` });
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
  firstName: { required: true, message: '请输入', trigger: 'blur' },
  lastName: { required: true, message: '请输入', trigger: 'blur' }
};
</script>

<style lang="scss">
.user-item {
  .form {
    margin-top: 20px;
  }
}
</style>
