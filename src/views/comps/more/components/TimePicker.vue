<script setup>
import { ref } from 'vue'

defineOptions({ name: 'TimePicker' })

const timeRange = ref([])

const shortcuts = [
  {
    text: '1 小时',
    value: () => [new Date(new Date().getTime() - 60 * 60 * 1000), new Date()],
  },
  {
    text: '3 小时',
    value: () => [new Date(new Date().getTime() - 3 * 60 * 60 * 1000), new Date()],
  },
  {
    text: '6 小时',
    value: () => [new Date(new Date().getTime() - 6 * 60 * 60 * 1000), new Date()],
  },
  {
    text: '1 天',
    value: () => [new Date(new Date().getTime() - 24 * 60 * 60 * 1000), new Date()],
  },
  {
    text: '1 周',
    value: () => [new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()],
  },
]
</script>

<template>
  <el-card header="时间选择器" style="width: fit-content">
    <el-date-picker
      v-model="timeRange"
      :shortcuts="shortcuts"
      :disabled-date="
        (date) => date.getTime() > Date.now() || date.getTime() < new Date('2025-01-01').getTime()
      "
      value-format="YYYY-MM-DD HH:mm:ss"
      type="datetimerange"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      range-separator="——"
    />

    <p style="margin: 20px 0">你选择的时间是：{{ timeRange }}</p>
  </el-card>
</template>

<style scoped></style>
