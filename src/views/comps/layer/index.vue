<script setup>
import { Layer, Modal, Toast } from '@/utils/layer.js'

// 测试 Toast
function onToastShow(type) {
  switch (type) {
    case 'info':
      Toast.info('你点击了 info 类型')
      return
    case 'warning':
      Toast.warning('你点击了 warning 类型')
      return
    case 'error':
      Toast.error('你点击了 error 类型')
      return
    case 'success':
      Toast.success('你点击了 success 类型')
      return
    case 'empty':
      Toast.empty()
      return
    case 'comingSoon':
      Toast.comingSoon()
      return
    case 'cancel':
      Toast.cancel()
      return
  }
}

// 测试 Layer
function onLayerShow(type) {
  switch (type) {
    case 'info':
      Layer.info('接口返回提示，用处不大')
      return
    case 'warning':
      Layer.warning('接口返回警告，用处不大')
      return
    case 'error':
      Layer.error('500 错误')
      return
    case 'success':
      Layer.success('添加成功~')
      return
    case 'confirm':
      Layer.confirm('你确认要吃屎吗？')
        .then(() => {
          Toast.success('对，我确定要吃')
        })
        .catch(() => {
          Toast.info('滚你丫的')
        })
  }
}

// 测试加载
function onLoadingShow(type) {
  switch (type) {
    case 'save':
      const saving = Modal.loading('正在保存…… （请坚持 3 秒证明你可以）')

      setTimeout(() => {
        saving.close()
        Toast.success('保存成功')
      }, 3000)
      return
    case 'loading':
      const loading = Modal.loading('正在加载文件，请稍后……')

      setTimeout(() => {
        loading.close()
        Toast.success('下载成功')
      }, 3000)
      return
  }
}
</script>

<template>
  <main class="flex flex-col gap-2">
    <h1 class="text-2xl h-12">弹出层展示</h1>
    <el-card header="Toast 前端提示">
      <el-button @click="onToastShow('info')" type="info" plain>提示</el-button>
      <el-button @click="onToastShow('warning')" type="warning" plain>警告</el-button>
      <el-button @click="onToastShow('error')" type="danger" plain>错误</el-button>
      <el-button @click="onToastShow('success')" type="success" plain>成功</el-button>

      <el-button @click="onToastShow('empty')" type="warning" plain>请至少勾选一行数据</el-button>
      <el-button @click="onToastShow('comingSoon')" type="warning" plain>该功能即将上线</el-button>
      <el-button @click="onToastShow('cancel')" type="info" plain>您已取消操作</el-button>
    </el-card>

    <el-card header="Layer 后端接口响应">
      <el-button @click="onLayerShow('info')" type="info" plain>接口提示</el-button>
      <el-button @click="onLayerShow('warning')" type="warning" plain>接口警告</el-button>
      <el-button @click="onLayerShow('error')" type="danger" plain>接口错误</el-button>
      <el-button @click="onLayerShow('success')" type="success" plain>接口成功</el-button>
      <el-button @click="onLayerShow('confirm')" type="primary" plain>功能确认弹窗</el-button>
    </el-card>

    <el-card header="全局加载">
      <el-button @click="onLoadingShow('save')" type="success" plain>保存</el-button>
      <el-button @click="onLoadingShow('loading')" type="primary" plain>点击加载</el-button>
    </el-card>
  </main>
</template>

<style scoped></style>
