import http from 'utils/http';
import { useMessage } from 'naive-ui';

export default function useQueryItem({ callback, formDisabled }) {
  const message = useMessage();

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
      });
  };

  return {
    queryItem
  };
}
