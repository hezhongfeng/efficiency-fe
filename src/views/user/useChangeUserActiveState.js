import { useDialog, useMessage } from 'naive-ui';
import http from 'utils/http';
import urls from '@/common/urls';

export default function useChangeUserActiveState() {
  const dialog = useDialog();
  const message = useMessage();

  const changeUserActiveState = ({ id, isActive, loading, callback }) => {
    dialog.create({
      title: '确定改变激活状态？',
      content: '改变 user 激活状态',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        const params = {
          isActive
        };
        loading.value = true;
        http
          .post(urls.user.user + `/${id}/active`, params)
          .then(() => {
            message.success('操作成功!');
            callback();
          })
          .catch(err => {
            message.warning(err.message);
          })
          .finally(() => {
            loading.value = true;
          });
      }
    });
  };

  return {
    changeUserActiveState
  };
}
