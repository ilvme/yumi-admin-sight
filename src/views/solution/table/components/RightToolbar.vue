<script setup>
import { Toast } from '@/utils/layer.js'

defineOptions('TableRightToolbar')

defineProps({
  exported: { type: Boolean, default: false },
  refreshed: { type: Boolean, default: true },
  columned: { type: Boolean, default: false },
})

function onCustomColumns() {
  Toast.comingSoon()
}

function onExport() {
  Toast.comingSoon()
}
</script>

<template>
  <div class="right-toolbar">
    <el-tooltip content="刷新">
      <el-button plain circle icon="Refresh" @click="$emit('refresh')" v-if="refreshed" />
    </el-tooltip>
    <el-tooltip content="自定义列">
      <el-button plain circle icon="Operation" @click="onCustomColumns" v-if="columned" />
    </el-tooltip>
    <el-tooltip content="导出">
      <el-button plain circle icon="Share" @click="onExport" v-if="exported" />
    </el-tooltip>
  </div>
</template>

<style scoped>
.right-toolbar {
  float: right;
}
.right-toolbar ::after {
  content: '';
  clear: both;
}
</style>
