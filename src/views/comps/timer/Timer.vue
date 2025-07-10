<script setup>
import { ref, useTemplateRef } from 'vue'

defineOptions({ name: 'SimpleTimer' })

const timer = ref({
  name: '',
  desc: '',

  isCycle: 1, // 1: 关闭, 2: 每天, 3: 每周, 4: 每月, 5: 自定义

  dayTypeTime: null, // 每天的时间

  weekTypeWeeks: null, // 每周的星期
  weekTypeTime: null, // 每周的时间

  monthTypeDays: null, // 每月的日期
  monthTypeTime: null, // 每月的时间

  cronExp: null, // cron 表达式
})

const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  desc: [{ required: false, message: '请输入任务描述', trigger: 'blur' }],
}

const timerDetailList = ref([])
const timerRef = useTemplateRef('timerRef')
function onSave() {
  timerRef.value.validate((valid) => {
    if (valid) {
      timerDetailList.value.push(`任务名称：${timer.value.name}`)
      timerDetailList.value.push(`任务描述：${timer.value.desc}`)

      // 构建
      timerDetailList.value.push(`周期执行详情：xxxTODO`)
    } else {
      console.log('error submit!!')
      return false
    }
  })
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
      <el-form-item label="周期性配置" required>
        <el-select v-model="timer.isCycle" style="width: 200px">
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
            v-model="timer.weekTypeTime"
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
