import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    component: Layout,
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
