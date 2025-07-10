<script setup>
import { ref, useTemplateRef } from 'vue'

defineOptions({ name: 'SimpleTimer' })

const timer = ref({
  name: 'task1',
  desc: '',

  isCycle: 1, // 1: 关闭, 2: 每天, 3: 每周, 4: 每月, 5: 自定义

  dayTypeTime: null, // 每天的时间

  weekTypeWeeks: [], // 每周的星期
  weekTypeTime: null, // 每周的时间

  monthTypeDays: [], // 每月的日期
  monthTypeTime: null, // 每月的时间

  cronExp: null, // cron 表达式
})

// 周期状态验证器
const cycleValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择周期'))
  }

  //  每天，校验
  if (timer.value.isCycle === 2 && !timer.value.dayTypeTime) {
    callback(new Error('请选择每天时间'))
  }

  // 每周，校验
  if (
    timer.value.isCycle === 3 &&
    (!timer.value.weekTypeTime || timer.value.weekTypeWeeks.length === 0)
  ) {
    callback(new Error('请选择每周时间'))
  }

  // 每月，校验
  if (
    timer.value.isCycle === 4 &&
    (!timer.value.monthTypeTime || timer.value.monthTypeTime.length === 0)
  ) {
    callback(new Error('请设置时间或天'))
  }

  // cron 校验
  if (timer.value.isCycle === 5) {
    if (!timer.value.cronExp) {
      callback(new Error('请填写 Cron'))
    }

    // 请求后端方法或调用后端接口校验 Cron 是否符合规范
    // const valid = await reqCronValid(timer.value.cronExp)
    // if (!valid) {
    //   callback(new Error('Cron 格式不正确'))
    // }
  }

  callback()
}

const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  isCycle: [{ required: true, validator: cycleValidator, trigger: 'blur' }],
}

const timerDetailList = ref([])
const timerRef = useTemplateRef('timerRef')
function onSave() {
  timerRef.value.validate((valid) => {
    if (valid) {
      detailBuild()
    } else {
      return false
    }
  })
}

// 周期类型变化，清除验证
const handleCycleChange = () => {
  timerRef.value.clearValidate()
}

// 构建输出
function detailBuild() {
  timerDetailList.value = []
  timerDetailList.value.push(`任务名称：${timer.value.name}`)
  timerDetailList.value.push(`任务描述：${timer.value.desc}`)

  let cycleText = ''
  switch (timer.value.isCycle) {
    case 1:
      cycleText = `未开启周期执行，需手动执行`
      break
    case 2:
      cycleText = `周期类型：每天 ${timer.value.dayTypeTime}`
      break
    case 3:
      cycleText = `周期类型：每周的星期 ${timer.value.weekTypeWeeks}，时间： ${timer.value.weekTypeTime}`
      break
    case 4:
      cycleText = `周期类型：每月的第 ${timer.value.monthTypeDays} 天，时间为： ${timer.value.monthTypeTime}`
      break
    case 5:
      cycleText = `周期类型：Cron ${timer.value.cronExp}`
      break
    default:
      timerDetailList.value.push(`周期类型：自定义`)
  }

  timerDetailList.value.push(`周期状态：${cycleText}`)
}
</script>

<template>
  <el-card header="定时配置器（1）">
    <el-form
      label-width="100px"
      :model="timer"
      ref="timerRef"
      label-position="right"
      :rules="rules"
    >
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="timer.name" style="width: 200px" />
      </el-form-item>
      <el-form-item label="任务描述" prop="desc">
        <el-input
          type="textarea"
          :rows="3"
          resize="none"
          v-model="timer.desc"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="周期性配置" prop="isCycle" :inline-message="true">
        <el-select v-model="timer.isCycle" style="width: 200px" @change="handleCycleChange">
          <el-option label="关闭" :value="1" />
          <el-option label="每天" :value="2" />
          <el-option label="每周" :value="3" />
          <el-option label="每月" :value="4" />
          <el-option label="自定义" :value="5" />
        </el-select>

        <!-- 每天 -->
        <el-time-picker
          v-if="timer.isCycle === 2"
          v-model="timer.dayTypeTime"
          placeholder="请选择时间"
          format="HH:mm"
          value-format="HH:mm"
          style="width: 160px"
        />

        <!-- 每周 -->
        <template v-if="timer.isCycle === 3">
          <el-select
            v-model="timer.weekTypeWeeks"
            multiple
            collapse-tags
            placeholder="选择星期，支持多选"
            style="width: 180px"
          >
            <el-option label="周一" :value="1" />
            <el-option label="周二" :value="2" />
            <el-option label="周三" :value="3" />
            <el-option label="周四" :value="4" />
            <el-option label="周五" :value="5" />
            <el-option label="周六" :value="6" />
            <el-option label="周日" :value="7" />
          </el-select>
          <el-time-picker
            v-model="timer.weekTypeTime"
            placeholder="请选择时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 160px"
          />
        </template>

        <!-- 每月 -->
        <template v-if="timer.isCycle === 4">
          <el-select
            v-model="timer.monthTypeDays"
            multiple
            collapse-tags
            placeholder="选择天，支持多选"
            style="width: 160px"
          >
            <el-option v-for="i in 28" :label="i" :value="i" />
          </el-select>
          <el-time-picker
            v-model="timer.monthTypeTime"
            placeholder="请选择时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 160px"
          />
        </template>

        <template v-if="timer.isCycle === 5">
          <el-input placeholder="请输入 Cron 表达式" v-model="timer.cronExp" style="width: 240px" />
        </template>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="onSave">保存</el-button>

    <p style="margin: 10px 0" v-for="item in timerDetailList">{{ item }}</p>
  </el-card>
</template>

<style scoped></style>
