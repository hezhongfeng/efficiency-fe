import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/layout/index.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        meta: {
          title: 'home-view',
          permissions: ['admin']
        },
        component: () => import('@/views/home/HomeView.vue')
      },
      {
        path: '/user-mgmt',
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
  history: createWebHashHistory(),
  routes
});

export default router;
