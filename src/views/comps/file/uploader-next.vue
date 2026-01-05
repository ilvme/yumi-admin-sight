<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios'

defineOptions({ name: 'UploaderNext' })

// 合法文件列表（仅.sql/.txt）
const validFileList = ref([])

// 上传进度
const uploadProgress = ref(0)

// 原生input Ref
const fileInputRef = ref(null)

const folderInputRef = ref(null)

// 浏览器兼容提示
const showBrowserTip = ref(false)

// 选择上传方式
const handleUploadType = (command) => {
  if (command === 'file') {
    showBrowserTip.value = false
    fileInputRef.value?.click() // 触发文件多选
  } else if (command === 'folder') {
    showBrowserTip.value = true
    folderInputRef.value?.click() // 触发文件夹选择
  }
}

// 处理文件多选（单个/多个文件）
const handleFileSelect = (e) => {
  const files = e.target.files
  if (!files.length) return
  filterValidFiles(files, false)
  e.target.value = '' // 清空input，避免重复选择不触发change
}

// 处理文件夹选择（遍历所有文件）
const handleFolderSelect = (e) => {
  const files = e.target.files
  if (!files.length) return
  filterValidFiles(files, true)
  e.target.value = '' // 清空input
}

// 过滤合法文件（.sql/.txt，≤100MB）
const filterValidFiles = (files, isFolder) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  const newValidFiles = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = file.name.toLowerCase()
    const fileType = fileName.endsWith('.sql') ? '.sql' : '.txt'

    // 1. 格式校验
    // if (!fileName.endsWith('.sql') && !fileName.endsWith('.txt')) {
    //   ElMessage.warning(`${file.name} 格式非法（仅支持.sql/.txt），已过滤`)
    //   continue
    // }

    // 2. 大小校验
    // if (file.size > maxSize) {
    //   ElMessage.warning(`${file.name} 大小超过100MB，已过滤`)
    //   continue
    // }

    // 3. 构建合法文件对象
    newValidFiles.push({
      name: file.name,
      raw: file, // 原始File对象
      type: fileType,
      size: file.size,
      relativePath: isFolder ? file.webkitRelativePath : '', // 文件夹上传才保留相对路径
    })
  }

  // 合并到文件列表（去重：避免重复选择同一文件）
  newValidFiles.forEach((newFile) => {
    const isDuplicate = validFileList.value.some(
      (item) => item.name === newFile.name && item.relativePath === newFile.relativePath,
    )
    if (!isDuplicate) {
      validFileList.value.push(newFile)
    }
  })

  ElMessage.info(
    `本次筛选出 ${newValidFiles.length} 个合法文件，总计 ${validFileList.value.length} 个`,
  )
}

// 移除单个文件
const handleRemoveFile = (file) => {
  validFileList.value = validFileList.value.filter(
    (item) => item.name !== file.name || item.relativePath !== file.relativePath,
  )
}

// 批量上传核心逻辑
const handleBatchUpload = async () => {
  if (validFileList.value.length === 0) {
    ElMessage.warning('暂无合法文件可上传')
    return
  }

  // 确认上传
  try {
    await ElMessageBox.confirm(
      `即将上传 ${validFileList.value.length} 个.sql/.txt文件，是否确认？`,
      '上传确认',
      { type: 'info' },
    )
  } catch (e) {
    ElMessage.info('已取消上传')
    return
  }

  const loading = ElLoading.service({ text: '文件上传中，请稍候...' })
  uploadProgress.value = 0

  try {
    // 构建FormData：文件数组 + 相对路径数组
    const formData = new FormData()
    validFileList.value.forEach((item, index) => {
      formData.append('files', item.raw) // 文件数组
      // formData.append(`relativePaths[${index}]`, item.relativePath || '') // 对应相对路径
      formData.append(`relativePaths`, item.relativePath || '') // 对应相对路径
    })
    console.log('formData', formData.entries())
    // 发送上传请求
    const res = await axios.post(
      '/api/batch/upload', // 替换为你的后端接口
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + localStorage.getItem('token'), // 可选：携带Token
        },
        // 监听上传进度
        onUploadProgress: (e) => {
          if (e.total > 0) {
            uploadProgress.value = Math.round((e.loaded / e.total) * 100)
          }
        },
        timeout: 60000, // 超时设为60秒（适配大文件）
      },
    )

    // 上传成功处理
    ElMessage.success(`上传成功！共上传 ${validFileList.value.length} 个文件`)
    validFileList.value = []
    uploadProgress.value = 0
  } catch (error) {
    // 错误处理
    if (error.message.includes('timeout')) {
      ElMessage.error('上传超时，请检查网络或减小文件体积')
    } else if (error.response) {
      ElMessage.error(`上传失败：${error.response.data.message || '接口异常'}`)
    } else {
      ElMessage.error('上传失败：网络异常，请重试')
    }
    uploadProgress.value = 0
  } finally {
    loading.close()
  }
}
</script>

<template>
  <div class="upload-container" style="margin: 20px">
    <!-- 上传方式选择 -->
    <ElDropdown @command="handleUploadType">
      <ElButton type="primary" icon="Upload">
        选择上传方式 <ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
      </ElButton>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem command="file">选择文件（支持多选）</ElDropdownItem>
          <ElDropdownItem command="folder">选择文件夹</ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>

    <!-- 浏览器兼容提示 -->
    <div
      v-if="showBrowserTip"
      class="browser-tip"
      style="margin: 10px 0; color: #f56c6c; font-size: 12px"
    >
      ⚠️ 文件夹上传仅支持 Chrome/Edge/Safari 浏览器，Firefox 需手动开启配置
    </div>

    <!-- 原生文件选择input（隐藏：文件多选） -->
    <input
      ref="fileInputRef"
      type="file"
      multiple
      class="hidden-input"
      @change="handleFileSelect"
    />
    <!--      accept=".sql,.txt"-->

    <!-- 原生文件夹选择input（隐藏：文件夹上传） -->
    <input
      ref="folderInputRef"
      type="file"
      webkitdirectory
      directory
      class="hidden-input"
      @change="handleFolderSelect"
    />
    <!--      accept=".sql,.txt"-->

    <!-- 上传按钮（无合法文件时禁用） -->
    <ElButton
      type="success"
      style="margin-left: 16px; margin-top: 10px"
      @click="handleBatchUpload"
      :disabled="validFileList.length === 0"
      icon="el-icon-circle-check"
    >
      批量上传（{{ validFileList.length }}个合法文件）
    </ElButton>

    <!-- 上传进度 -->
    <div v-if="uploadProgress > 0" style="margin-top: 10px">
      <ElProgress :percentage="uploadProgress" status="success" />
      <span style="font-size: 12px; color: #666; margin-left: 10px">
        上传进度：{{ uploadProgress }}%
      </span>
    </div>

    <!-- 合法文件列表 -->
    <ElTable
      max-height="200px"
      v-if="validFileList.length > 0"
      :data="validFileList"
      border
      size="small"
      style="width: 100%; margin-top: 15px"
    >
      <ElTableColumn prop="name" label="文件名" min-width="200" />
      <ElTableColumn prop="type" label="文件类型" width="100" />
      <ElTableColumn prop="size" label="大小(MB)" width="120">
        <template #default="scope">
          {{ (scope.row.size / 1024 / 1024).toFixed(2) }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="relativePath" label="相对路径" min-width="300">
        <template #default="scope">
          {{ scope.row.relativePath || '根目录' }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="80">
        <template #default="scope">
          <ElButton type="text" @click="handleRemoveFile(scope.row)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<style scoped>
/* 隐藏原生input */
.hidden-input {
  display: none;
}
/* 适配下拉菜单样式 */
.el-dropdown {
  display: inline-block;
}
</style>
