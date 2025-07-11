<script setup>
import { useTemplateRef, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import echarts from '../echart.js'
import { useDebounceFn } from '@vueuse/core'

defineOptions({ name: 'BaseChart' })
const emits = defineEmits(['click'])

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: String, default: '300px' },
  width: { type: String, default: '100%' },
  loading: { type: Boolean, default: false },
})

// 图表 DOM 节点
const chartRef = useTemplateRef('chartRef')

// 图表实例
const chartInstance = shallowRef(null)

function initChart() {
  chartInstance.value = echarts.getInstanceByDom(chartRef.value)

  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartRef.value)

    chartInstance.value.on('click', (params) => {
      console.log(params)
      emits('click', params)
    })

    draw()
  }
}

function draw() {
  if (props.loading) {
    chartInstance.value.showLoading()
  } else {
    chartInstance.value.hideLoading()
    chartInstance.value.setOption(props.option, true)
  }
}

watch([() => props.option, () => props.loading], draw)

function resize() {
  if (chartInstance.value) {
    chartInstance.value.resize({ animation: { duration: 200 } })
  }
}
const debounceResize = useDebounceFn(resize, 200, { maxWait: 800 })

onMounted(() => {
  initChart()
  window.addEventListener('resize', debounceResize)
})

onBeforeUnmount(() => {
  destroy()
  window.removeEventListener('resize', debounceResize)
})

// 销毁图表
function destroy() {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
}

defineExpose({ debounceResize })
</script>

<template>
  <div
    style="background-color: #fdf6f0"
    ref="chartRef"
    :style="{
      width: props.width ?? '100%',
      height: props.height ?? '300%',
    }"
  />
</template>

<style scoped></style>
