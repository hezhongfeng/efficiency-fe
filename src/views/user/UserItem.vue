<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="dialog"
    :title="title"
    class="user-item"
    positive-text="确认"
    negative-text="取消"
    @update:show="onChangeModel"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :disabled="formDisabled" :model="model" class="form" :rules="rules">
      <n-form-item label="姓" path="firstName">
        <n-input v-model:value="model.firstName" placeholder="请输入" />
      </n-form-item>
      <n-form-item label="名" path="lastName">
        <n-input v-model:value="model.lastName" placeholder="请输入" />
      </n-form-item>
      <n-form-item label="是否激活" path="isActive">
        <n-switch v-model:value="model.isActive" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup name="user-item">
import { ref, toRefs, watch, computed } from 'vue';
import http from '@/utils/http';
import urls from '@/common/urls';
import { useMessage } from 'naive-ui';
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

const model = ref({
  firstName: null,
  lastName: null,
  isActive: true
});

const params = {
  firstName: model.value.firstName,
  lastName: model.value.lastName,
  isActive: model.value.isActive
};

const { formDisabled, createItem } = useCreateItem({
  url: urls.user.user,
  params,
  callback: () => {
    emit('model-show-change');
    emit('refresh-list');
  }
});

const { updateItem } = useUpdateItem({
  url: `${urls.user.user}/${itemId.value}`,
  params,
  callback: () => {
    emit('model-show-change');
    emit('refresh-list');
  },
  formDisabled
});

const { queryItem } = useQueryItem({
  url: `${urls.user.user}/${itemId.value}`,
  callback: data => {
    model.value.firstName = data.firstName;
    model.value.lastName = data.lastName;
    model.value.isActive = data.isActive;
  }
});

const formRef = ref(null);

const message = useMessage();

const onChangeModel = () => {
  emit('model-show-change');
};

const title = computed(() => {
  return itemId.value ? '编辑用户' : '新增用户';
});

watch(show, val => {
  if (val) {
    if (itemId.value) {
      getUser();
    } else {
      reSetDate();
    }
  }
});

// reset 数据
const reSetDate = () => {
  model.value.firstName = null;
  model.value.lastName = null;
  model.value.isActive = true;
};

const getUser = () => {
  formDisabled.value = true;
  http
    .get(`${urls.user.user}/${itemId.value}`)
    .then(({ data }) => {
      model.value.firstName = data.firstName;
      model.value.lastName = data.lastName;
      model.value.isActive = data.isActive;
    })
    .catch(err => {
      message.warning(err.message);
    })
    .finally(() => {
      formDisabled.value = false;
    });
};

const updateUser = () => {
  formDisabled.value = true;
  const params = {
    firstName: model.value.firstName,
    lastName: model.value.lastName,
    isActive: model.value.isActive
  };
  http
    .put(`${urls.user.user}/${itemId.value}`, params)
    .then(() => {
      message.success('更新成功!');
      emit('model-show-change');
      emit('refresh-list');
    })
    .catch(err => {
      message.warning(err.message);
    })
    .finally(() => {
      formDisabled.value = false;
    });
};

const submitCallback = () => {
  formRef.value.validate(errors => {
    if (!errors) {
      if (itemId.value) {
        updateItem();
        // updateUser();
      } else {
        // createUser();
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
