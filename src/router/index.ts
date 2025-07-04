import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Homepage',
    meta: { title: '首页' },
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/components',
    name: 'Components',
    meta: { title: '组件' },
    children: [
      {
        path: 'pagination',
        name: 'Pagination',
        meta: { title: '分页组件' },
        component: () => import('@/views/comps/pagination/index.vue'),
      },
      {
        path: 'download',
        name: 'Download',
        meta: { title: '文件下载组件' },
        component: () => import('@/views/comps/download/index.vue'),
      },
    ],
  },
  {
    path: '/solution',
    name: 'Solution',
    meta: { title: '解决方案' },
    children: [
      {
        path: 'pagination',
        name: 'Pagination',
        meta: { title: '步骤' },
        component: () => import('@/views/comps/pagination/index.vue'),
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
    name: 'Components',
    meta: { title: '工具方法' },
    children: [
      {
        path: 'pagination',
        name: 'Pagination',
        meta: { title: '时间类' },
        component: () => import('@/views/comps/pagination/index.vue'),
      },
      {
        path: 'download',
        name: 'Download',
        meta: { title: '表单校验、正则' },
        component: () => import('@/views/comps/download/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
