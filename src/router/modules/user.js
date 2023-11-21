import { UserMultiple } from '@vicons/carbon';
import { NIcon } from 'naive-ui';
import { h } from 'vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const route = {
  name: 'User',
  meta: {
    title: '用户',
    icon: renderIcon(UserMultiple)
  },
  children: [
    {
      path: 'user-mgmt',
      name: 'user-mgmt',
      meta: {
        title: '用户管理',
        permissions: ['admin']
      },
      component: () => import('@/views/user/UserMgmt.vue')
    }
  ]
};

export default route;
