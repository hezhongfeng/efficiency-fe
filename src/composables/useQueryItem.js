import http from 'utils/http';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

export default function useQueryItem({ callback, formDisabled }) {
  const message = useMessage();
  const loading = ref(true);

  const queryItem = ({ url }) => {
    formDisabled.value = true;
    http
      .get(url)
      .then(({ data }) => {
        callback(data);
      })
      .catch(err => {
        message.warning(err.message);
      })
      .finally(() => {
        formDisabled.value = false;
        loading.value = false;
      });
  };

  return {
    loading,
    queryItem
  };
}
