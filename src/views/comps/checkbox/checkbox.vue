<script setup>
import { ref, watch } from 'vue'

defineOptions({ name: 'CheckboxGroup' })

const props = defineProps({
  allList: { type: Array, default: () => [], required: true },
  checkList: { type: Array, default: () => [], required: true },
})

// checkAll 与 isIndeterminate 为 false，即空状态
// checkAll 为 true，isIndeterminate 为 false，即全选状态
// checkAll 为 false，isIndeterminate 为 true，即半选状态
const checkedList = ref([])
const isIndeterminate = ref(false)
const checkAll = ref(false)

watch(
  () => props.checkList,
  (val) => {
    initChecked(val)
  },
  { immediate: true },
)

const handleCheckAllChange = (val) => {
  checkedList.value = val ? props.allList.map((item) => item.id) : []
  isIndeterminate.value = false
}

const handleSingleChange = (val) => {
  const checkedCount = val.length
  checkAll.value = checkedCount === props.allList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.allList.length
}

// 手动初始化全选框的选中状态
function initChecked(val) {
  checkedList.value = props.allList.map((item) => item.id).filter((id) => val.includes(id))

  const length = checkedList.value.length

  if (length > 0 && length < props.allList.length) {
    isIndeterminate.value = true
  } else if (length === props.allList.length) {
    isIndeterminate.value = false
    checkAll.value = true
  } else {
    isIndeterminate.value = false
    checkAll.value = false
  }
}

defineExpose({ checkedList })
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
