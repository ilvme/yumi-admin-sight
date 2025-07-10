<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const route = useRoute()
const router = useRouter()

// 获取路由配置
const routes = computed(() => {
  // 过滤掉不需要在菜单中显示的路由
  return router.options.routes.filter((route) => !route.hidden)
})

const isDev = import.meta.env.MODE === 'development'
onMounted(() => {
  // 非开发环境，添加网站离开提示
  if (!isDev) {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault()
      e.returnValue = ''
    })
  }
})

onBeforeUnmount(() => {
  if (!isDev) {
    window.removeEventListener('beforeunload', (e) => {
      e.preventDefault()
      e.returnValue = ''
    })
  }
})
</script>

<template>
  <el-config-provider size="default" :locale="zhCn">
    <div id="app">
      <aside class="w-[240px]">
        <el-menu router :default-active="route.path" class="sidebar" unique-opened>
          <template v-for="route in routes" :key="route.path">
            <el-sub-menu v-if="route.children" :index="route.path">
              <template #title>
                <el-icon v-if="route.meta.icon">
                  <component :is="route.meta.icon" />
                </el-icon>
                <span>{{ route.meta.title }}</span>
              </template>

              <!-- 二级菜单 -->
              <template v-for="child in route.children" :key="child.path">
                <el-menu-item
                  v-if="!child.children || child.children.length === 0"
                  :index="route.path + '/' + child.path"
                >
                  <el-icon v-if="child.meta.icon"><component :is="child.meta.icon" /></el-icon>
                  <span>{{ child.meta.title }}</span>
                </el-menu-item>
              </template>
            </el-sub-menu>

            <el-menu-item v-else :index="route.path">
              <el-icon v-if="route.meta.icon"><component :is="route.meta.icon" /></el-icon>
              <span>{{ route.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <main class="flex-1 p-2.5">
        <RouterView />
      </main>
    </div>
  </el-config-provider>
</template>

<style scoped>
#app {
  display: flex;
  min-height: 100vh;
}
.sidebar .el-menu-item {
  height: 40px;
  line-height: 40px;
}

:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
}
.sidebar:not(.el-menu--collapse) {
  min-height: 100vh;
}
</style>
