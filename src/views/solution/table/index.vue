<script setup>
import { onMounted, ref } from 'vue'
import SearchForm from '@/views/solution/table/components/SearchForm.vue'
import TableRightToolbar from './components/RightToolbar.vue'
import { reqUserList } from '@/api/user.js'
import Pagination from '@/views/solution/table/components/Pagination.vue'

const queryParams = ref({
  username: '', // 姓名
  status: undefined, // 状态
  email: '',
  phone: '',
  desc: '', // 描述
  createTimeList: [], // 时间范围
  pageNum: 1,
  pageSize: 10,
})

const tableData = ref([])
const total = ref(0)
const loading = ref(false)

onMounted(async () => {
  await init()
})

async function init() {
  loading.value = true
  const { data } = await reqUserList(queryParams.value)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

// 重置
const handleReset = () => {
  // 如果有 el-form 无法自动重置的初始值，则需要手动初始化全选框的选中状态
  // 注意：必须设定 el-form-item 的 prop 属性，且必须与表单数据对象中的属性名一致，否则不会生效
  init()
}

// 搜索
const handleSearch = () => {
  // 请求后端，进行搜素
  init()
}
</script>

<template>
  <el-alert style="margin-bottom: 10px" type="success" center>
    特性支持：自适应表格高度、通用自定义操作、自定义高级搜索
  </el-alert>
  <!-- 表单搜索区域 -->
  <SearchForm advanced :modalData="queryParams" @reset="handleReset" @search="handleSearch">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="queryParams.username" clearable style="width: 200px" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="queryParams.status" clearable style="width: 100px">
        <el-option label="正常" :value="1" />
        <el-option label="禁用" :value="2" />
      </el-select>
    </el-form-item>

    <template #advance>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="queryParams.desc" clearable style="width: 200px" />
      </el-form-item>

      <el-form-item label="创建时间" prop="createTimeList">
        <el-date-picker
          v-model="queryParams.createTimeList"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 400px"
        />
      </el-form-item>
    </template>
  </SearchForm>

  <!-- 中间按钮区域 -->
  <section style="margin: 5px 0">
    <el-button plain type="primary" icon="Plus">添加</el-button>
    <el-button plain type="danger" icon="Delete">删除</el-button>

    <!-- 表格操作 -->
    <TableRightToolbar @refresh="init" />
  </section>

  <!-- 表格区域 -->
  <el-table :data="tableData" border v-loading="loading" v-autoHeight style="width: 100%">
    <el-table-column type="selection" width="50" />
    <el-table-column label="姓名" prop="username" min-width="100px" />
    <el-table-column label="状态" prop="status" min-width="80px">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 1">正常</el-tag>
        <el-tag v-else type="danger">禁用</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="邮箱" prop="email" min-width="120px" />
    <el-table-column label="手机号" prop="phone" min-width="120px" />
    <el-table-column label="描述" prop="desc" min-width="160px" />
    <el-table-column label="创建时间" prop="createTime" min-width="120px" />
    <el-table-column label="操作" width="150px">
      <template #default="scope">
        <el-button size="small" link plain type="primary" icon="Edit">编辑</el-button>
        <el-button size="small" link plain type="danger" icon="Delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页区域 -->
  <Pagination
    :total="total"
    v-model:page-num="queryParams.pageNum"
    v-model:page-size="queryParams.pageSize"
    @pagination="init"
  />
</template>

<style scoped></style>
