<script setup>
import { useDark } from '@vueuse/core'

const isDark = useDark()

function handleThemeChange() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <el-card header="网站设置">
    <el-switch
      v-model="isDark"
      active-icon="Moon"
      inactive-icon="Sunny"
      @change="handleThemeChange"
    />
  </el-card>
</template>

<style scoped></style>
