<script setup>
import { ref, useTemplateRef } from 'vue'
import { DArrowRight } from '@element-plus/icons-vue'
import { ElCollapseTransition } from 'element-plus'

defineOptions({ name: 'SearchForm' })

const emits = defineEmits(['reset', 'search'])

defineProps({
  // 是否开启高级搜索
  advanced: { type: Boolean, default: false },

  // 搜索表单数据
  modalData: { type: Object, default: () => {}, required: true },
})

const expanded = ref(false)

const formRef = useTemplateRef('formRef')

function onReset() {
  formRef.value.resetFields()
  emits('reset')
}
</script>

<template>
  <section class="flex justify-between">
    <el-form ref="formRef" :model="modalData" label-width="80px" inline label-position="left">
      <slot name="default" />

      <ElCollapseTransition>
        <div v-show="expanded">
          <slot name="advance" />
        </div>
      </ElCollapseTransition>
    </el-form>

    <div>
      <el-button plain type="primary" icon="Search" @click="$emit('search')">搜索</el-button>
      <el-button plain type="warning" icon="Refresh" @click="onReset">重置</el-button>
      <el-button plain v-if="advanced" @click="expanded = !expanded">
        <el-icon
          style="margin-right: 6px"
          :style="expanded ? 'transform: rotate(-90deg)' : 'transform: rotate(90deg)'"
        >
          <DArrowRight />
        </el-icon>

        高级搜索
      </el-button>
    </div>
  </section>
</template>

<style scoped></style>
