<script setup>
import { RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'

const router = useRouter()

// 获取路由配置
const routes = computed(() => {
  // 过滤掉不需要在菜单中显示的路由
  return router.options.routes.filter((route) => !route.hidden)
})
</script>

<template>
  <div id="app">
    <aside class="w-[240px]">
      <el-menu router default-active="/" class="sidebar">
        <template v-for="route in routes" :key="route.path">
          <el-sub-menu v-if="route.children" :index="route.path">
            <template #title>
              <el-icon v-if="route.meta.icon"><component :is="route.meta.icon" /></el-icon>
              <span>{{ route.meta.title }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item-group v-for="child in route.children" :key="child.path">
              <el-menu-item
                v-if="!child.children || child.children.length === 0"
                :index="route.path + '/' + child.path"
              >
                <el-icon v-if="child.meta.icon"><component :is="child.meta.icon" /></el-icon>
                <span>{{ child.meta.title }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-menu-item v-else :index="route.path">
            <el-icon v-if="route.meta.icon"><component :is="route.meta.icon" /></el-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  min-height: 100vh;
}

.sidebar:not(.el-menu--collapse) {
  min-height: 100vh;
}
</style>
