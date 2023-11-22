<template>
  <n-menu ref="menuInstRef" :options="menus" :value="selectedKey" @update:value="clickMenuItem" />
</template>

<script setup name="Menu">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserMultiple, Home } from '@vicons/carbon';
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
    label: 'home',
    key: '/',
    icon: renderIcon(Home),
    children: [
      {
        key: '/',
        name: 'home-view',
        label: 'home-view'
      }
    ]
  },
  {
    label: '用户',
    key: '/user',
    icon: renderIcon(UserMultiple),
    children: [
      {
        key: '/user-mgmt',
        name: 'user-mgmt',
        label: '用户管理'
      }
    ]
  }
];

const selectedKey = ref('/');

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    if (currentRoute.fullPath !== 'login') {
      selectedKey.value = currentRoute.fullPath;
    }
  }
);

// 首次进入时候需要更新下Key
onMounted(() => {
  if (currentRoute.fullPath !== 'login') {
    selectedKey.value = currentRoute.fullPath;
    // 展开对应的菜单
    menuInstRef.value?.showOption(currentRoute.fullPath);
  }
});

// 点击菜单
function clickMenuItem(key) {
  router.push(key);
}
</script>
