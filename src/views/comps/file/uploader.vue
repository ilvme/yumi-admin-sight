<script setup>
import { computed } from 'vue'
import { Layer } from '@/utils/layer.js'

defineOptions({ name: 'FileUploader' })

const emits = defineEmits(['success'])

const props = defineProps({
  multiple: { type: Boolean, default: false },
  suffix: { type: [String, Array], default: () => [] },
  url: { type: String, required: true }, // 请求 URL
  data: { type: Object, default: null }, // 上传时附带的额外参数
  text: { type: String, default: '上传' },
  icon: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const loading = defineModel('loading', { default: false })

const headers = computed(() => {
  return { Authorization: 'Bearer ' + 'your token' }
})

const action = computed(() => import.meta.env.VITE_APP_BASE_API + props.url)

const handleError = () => {
  Layer.error('上传失败，请重试')
  loading.value = false
}

const handleSuccess = (res) => {
  loading.value = false
  if (res.code !== 0) {
    Layer.error(res.message)
    return
  }

  Layer.success('上传成功')
  emits('success', res.data)
}

const handleBeforeUpload = (file) => {
  loading.value = true

  const realSuffix = typeof props.suffix === 'string' ? [props.suffix] : props.suffix

  // 不校验格式，直接返回
  if (realSuffix.length === 0) {
    return true
  }

  const isValid = realSuffix.some((suffix) => file.name.endsWith(suffix))

  if (!isValid) {
    Layer.error(`请上传 [${realSuffix.join(', ')}] 格式的文件`)
    loading.value = false
    return false
  }
  return true
}
</script>

<template>
  <el-upload
    :multiple="multiple"
    :action="action"
    :data="data"
    :on-error="handleError"
    :on-success="handleSuccess"
    :before-upload="handleBeforeUpload"
    :show-file-list="false"
    :headers="headers"
  >
    <el-button :loading="loading" :icon="icon" type="success" plain :disabled="disabled">
      {{ text }}
    </el-button>
  </el-upload>
</template>

<style scoped></style>
