<script setup>
import FileUploader from '@/views/comps/file/uploader.vue'
import UploaderNext from '@/views/comps/file/uploader-next.vue'
</script>

<template>
  <el-card header="文件上传组件">
    <FileUploader url="" :suffix="['xls, csv, xlsx']" multiple />
  </el-card>

  <el-divider />

  <el-card header="文件上传，支持多选、文件夹上传">
    <UploaderNext />
  </el-card>
</template>

<style scoped></style>
