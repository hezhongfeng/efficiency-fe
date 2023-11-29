import http from 'utils/http';
import { useMessage } from 'naive-ui';

export default function useQueryItem({ callback }) {
  const message = useMessage();

  const queryItem = ({ url }) => {
    http
      .get(url)
      .then(({ data }) => {
        callback(data);
      })
      .catch(err => {
        message.warning(err.message);
      });
  };

  return {
    queryItem
  };
}
