import { useMessage } from 'naive-ui';
import http from '@/utils/http';
import { ref } from 'vue';

export default function useUpdateItem({ formModel = ref({}), callback, formDisabled }) {
  const message = useMessage();
  const updateItem = ({ url }) => {
    formDisabled.value = true;
    http
      .put(url, formModel.value)
      .then(() => {
        message.success('更新成功!');
        callback();
      })
      .catch(err => {
        message.warning(err.message);
      })
      .finally(() => {
        formDisabled.value = false;
      });
  };

  return {
    updateItem
  };
}
