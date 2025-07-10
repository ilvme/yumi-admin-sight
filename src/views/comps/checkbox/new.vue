<script setup>
import { ref } from 'vue'
import CheckboxGroupNext from '@/views/comps/checkbox/checkbox-next.vue'

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
</script>

<template>
  <el-card header="复选框组一">
    <CheckboxGroupNext v-model:checked-list="checkedList" :all-list="allList" ref="cbRef" />

    <p style="margin-top: 30px">你现在了哪些水果呢？</p>

    <span v-if="allList.length === checkedList.length">你全都要！！！</span>
    <span v-else-if="checkedList.length === 0">一个不要，啥也不是</span>
    <template v-else>
      <li v-for="item in checkedList" :key="item">
        {{ allList.find((i) => i.id === item).label }}
      </li>
    </template>
  </el-card>
</template>

<style scoped>
.el-divider--horizontal {
  margin: 10px 0;
}
</style>
