<script setup>
import { ref, watch } from 'vue'

defineOptions({ name: 'CheckboxGroupNext' })

const props = defineProps({
  allList: { type: Array, default: () => [], required: true },
})

// checkAll 与 isIndeterminate 为 false，即空状态
// checkAll 为 true，isIndeterminate 为 false，即全选状态
// checkAll 为 false，isIndeterminate 为 true，即半选状态
const checkedList = defineModel('checkedList', { default: () => [], type: Array })
const isIndeterminate = ref(false)
const checkAll = ref(false)

const handleCheckAllChange = (val) => {
  checkedList.value = val ? props.allList.map((item) => item.id) : []
  isIndeterminate.value = false
}

const handleSingleChange = (val) => {
  const checkedCount = val.length
  checkAll.value = checkedCount === props.allList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.allList.length
}
</script>

<template>
  <el-checkbox
    label="全选"
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  />
  <el-checkbox-group v-model="checkedList" @change="handleSingleChange">
    <el-checkbox v-for="item in allList" :key="item.id" :value="item.id" :label="item.label" />
  </el-checkbox-group>
</template>
