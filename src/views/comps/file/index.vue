<script setup>
import FileUploader from '@/views/comps/file/uploader.vue'
</script>

<template>
  <el-card header="文件上传组件">
    <FileUploader url="" :suffix="['xls, csv, xlsx']" multiple />
  </el-card>
</template>

<style scoped></style>
