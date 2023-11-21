<template>
  <n-menu ref="menuInstRef" :options="menus" :value="selectedKey" @update:value="clickMenuItem" />
</template>

<script setup name="Menu">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserMultiple } from '@vicons/carbon';
import { NIcon } from 'naive-ui';
import { h } from 'vue';

const menuInstRef = ref(null);

// 当前路由
const currentRoute = useRoute();

const router = useRouter();

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menus = [
  {
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
  }
];

const selectedKey = ref('');

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    if (currentRoute.name.toString() !== 'login') {
      selectedKey.value = currentRoute.name.toString();
    }
  }
);

// 首次进入时候需要更新下Key
onMounted(() => {
  if (currentRoute.name.toString() !== 'login') {
    selectedKey.value = currentRoute.name.toString();
    // 展开对应的菜单
    menuInstRef.value?.showOption(currentRoute.name.toString());
  }
});

// 点击菜单
function clickMenuItem(key) {
  router.push(key);
}
</script>
