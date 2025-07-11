<script setup>
import BaseChart from './components/base.vue'
import { onMounted, ref, useTemplateRef } from 'vue'

const option = ref({})
const loading = ref(false)

onMounted(() => {
  draw()
})

function draw() {
  option.value = null
  resize()
  loading.value = true
  setTimeout(() => {
    setOp()
    loading.value = false
  }, 2000)
}

function setOp() {
  option.value = {
    title: {
      text: 'ECharts 入门示例',
    },
    toolbox: {
      feature: {
        saveAsImage: { show: true },
        dataView: { show: true },
        mark: { show: true },
        restore: { show: true },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['销量', '销量2'],
    },
    xAxis: {
      data: [
        '衬衫',
        '羊毛衫',
        '雪纺衫',
        '裤子',
        '高跟鞋',
        '袜子',
        '运动鞋',
        '运动裤',
        '运动袜',
        '运动包',
      ],
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'line',
        data: [1, 220, 36, 50, 30, 60, 55, 510, 120, 220],
      },
      {
        name: '销量2',
        type: 'line',
        data: [50, 210, 326, 120, 150, 260, 5, 10, 320, 20],
      },
    ],
  }
}

const chartRef1 = useTemplateRef('chartRef1')
const chartRef2 = useTemplateRef('chartRef2')
const resize = () => {
  chartRef1.value.debounceResize()
  chartRef2.value.debounceResize()
}
</script>

<template>
  <el-button plain type="success" @click="draw">重新加载</el-button>

  <el-splitter @resize="resize" style="width: 100%">
    <el-splitter-panel>
      <BaseChart :option="option" :loading="loading" ref="chartRef1" height="300px" />
    </el-splitter-panel>

    <el-splitter-panel>
      <BaseChart :option="option" :loading="loading" ref="chartRef2" height="300px" />
    </el-splitter-panel>
  </el-splitter>
</template>

<style scoped></style>
