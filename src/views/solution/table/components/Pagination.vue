<script setup>
defineOptions({ name: 'Pagination' })

const emit = defineEmits(['pagination'])

defineProps({
  pageSizes: { type: Array, default: () => [5, 10, 20] },
  total: { type: Number, required: true },
})

const pageNum = defineModel('pageNum', { type: Number, required: true })
const pageSize = defineModel('pageSize', { type: Number, required: true })

const handleChange = (num, size) => {
  pageNum.value = num
  pageSize.value = size
  emit('pagination')
}
</script>

<template>
  <el-pagination
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    style="margin-top: 10px; float: right"
    layout="total, sizes, prev, pager, next, jumper"
    @change="handleChange"
  />
</template>

<style scoped></style>
