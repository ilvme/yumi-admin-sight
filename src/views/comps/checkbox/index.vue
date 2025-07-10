<script setup>
import { ref, useTemplateRef, watch } from 'vue'
import CheckboxGroup from '@/views/comps/checkbox/checkbox.vue'

const allList = [
  { id: 1, label: '苹果' },
  { id: 2, label: '香蕉' },
  { id: 3, label: '橘子' },
  { id: 4, label: '西瓜' },
  { id: 5, label: '荔枝' },
  { id: 6, label: '哈密瓜' },
  { id: 7, label: '葡萄' },
  { id: 8, label: '桃子' },
  { id: 9, label: '大枣' },
  { id: 10, label: '杏子' },
]
const checkedList = ref([1, 2])

const cbRef = useTemplateRef('cbRef')

function getCheckedList() {
  checkedList.value = cbRef.value.checkedList
}
</script>

<template>
  <el-card header="复选框组">
    <CheckboxGroup :check-list="checkedList" :all-list="allList" ref="cbRef" />

    <el-divider />

    你现在了哪些水果呢？
    <el-button type="primary" plain size="small" @click="getCheckedList">点我获取</el-button>
    <li v-for="item in checkedList" :key="item" style="margin-right: 10px">
      {{ allList.find((i) => i.id === item).label }}
    </li>
  </el-card>
</template>

<style scoped>
.el-divider--horizontal {
  margin: 10px 0;
}
</style>
