import { createRouter, createWebHistory } from 'vue-router'
import { House, Menu, Setting, Discount, Orange } from '@element-plus/icons-vue'

const routes = [
  {
    path: '/',
    name: 'Homepage',
    meta: { title: '首页', icon: House },
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/comps',
    name: 'Components',
    meta: { title: '组件', icon: Menu },
    component: () => import('@/views/comps/index.vue'),
    children: [
      {
        path: 'layer',
        name: 'Layer',
        meta: { title: '弹出层展示组件' },
        component: () => import('@/views/comps/layer/index.vue'),
      },
      {
        path: 'file',
        name: 'File',
        meta: { title: '文件操作组件' },
        component: () => import('@/views/comps/file/index.vue'),
      },
      {
        path: 'checkbox',
        name: 'Checkbox',
        meta: { title: '复选框组件' },
        component: () => import('@/views/comps/checkbox/index.vue'),
      },
      {
        path: 'timer',
        name: 'Timer',
        meta: { title: '定时配置组件' },
        component: () => import('@/views/comps/timer/index.vue'),
      },
      {
        path: 'download',
        name: 'Download',
        meta: { title: '文件下载组件' },
        component: () => import('@/views/comps/download/index.vue'),
      },
      {
        path: 'chart',
        name: 'Chart',
        meta: { title: '图表' },
        component: () => import('@/views/comps/download/index.vue'),
      },
    ],
  },
  {
    path: '/solution',
    name: 'Solution',
    meta: { title: '解决方案', icon: Orange },
    children: [
      {
        path: 'table',
        name: 'TableSearch',
        meta: { title: '数据表格综合应用' },
        component: () => import('@/views/solution/table/index.vue'),
      },
      {
        path: 'download',
        name: 'Download',
        meta: { title: '二次密码验证' },
        component: () => import('@/views/comps/download/index.vue'),
      },
    ],
  },
  {
    path: '/tools',
    name: 'Tools',
    meta: { title: '工具方法', icon: Discount },
    children: [
      {
        path: 'pagination',
        name: 'Pagination',
        meta: { title: '时间类' },
        component: () => import('@/views/comps/timer/index.vue'),
      },
      {
        path: 'download',
        name: 'Download',
        meta: { title: '表单校验、正则' },
        component: () => import('@/views/comps/download/index.vue'),
      },
    ],
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { title: '设置', icon: Setting },
    component: () => import('@/views/settings/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
