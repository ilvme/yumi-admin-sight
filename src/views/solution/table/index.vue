<script setup>
import { onMounted, ref } from 'vue'
import SearchForm from '@/views/solution/table/components/SearchForm.vue'
import { reqUserList } from '@/api/user.js'

const queryParams = ref({
  username: '', // 姓名
  status: undefined, // 状态
  email: '',
  phone: '',
  desc: '', // 描述
  createTimeList: [], // 时间范围
  pageNum: 1,
  pageSize: 5,
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
  queryParams.value = {
    username: '', // 姓名
    status: '', // 状态
    desc: '', // 描述
    createTimeList: [], // 时间范围
  }
}

// 搜索
const handleSearch = () => {
  // 请求后端，进行搜素
  init()
}

// 分页
const handlePageChange = (pageNum, pageSize) => {
  queryParams.value.pageNum = pageNum
  queryParams.value.pageSize = pageSize
  init()
}
</script>

<template>
  <el-card>
    <!-- 表单搜索区域 -->
    <SearchForm advanced :modalData="queryParams" @reset="handleReset" @search="handleSearch">
      <el-form-item label="姓名">
        <el-input v-model="queryParams.username" clearable style="width: 200px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" clearable style="width: 100px">
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="2" />
        </el-select>
      </el-form-item>

      <template #advance>
        <el-form-item label="描述">
          <el-input v-model="queryParams.desc" clearable style="width: 200px" />
        </el-form-item>

        <el-form-item label="创建时间">
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
  </el-card>

  <!-- 中间按钮区域 -->
  <section style="margin: 5px 0">
    <el-button plain type="primary" icon="Plus">添加</el-button>
    <el-button plain type="danger" icon="Delete">删除</el-button>

    <div class="right-toolbar">
      <el-tooltip content="刷新">
        <el-button plain circle icon="Refresh" @click="init" />
      </el-tooltip>
      <el-tooltip content="导出">
        <el-button plain circle icon="Share" />
      </el-tooltip>
      <el-tooltip content="自定义列">
        <el-button plain circle icon="Operation" />
      </el-tooltip>
    </div>
  </section>

  <!-- 表格区域 -->
  <el-table :data="tableData" border v-loading="loading">
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
  <el-pagination
    v-model:current-page="queryParams.pageNum"
    v-model:page-size="queryParams.pageSize"
    :total="total"
    :page-sizes="[3, 5, 10, 20]"
    style="margin-top: 20px; text-align: right"
    layout="total, sizes, prev, pager, next, jumper"
    @change="handlePageChange"
  />
</template>

<style scoped>
.right-toolbar {
  float: right;
}
.right-toolbar ::after {
  content: '';
  clear: both;
}
</style>
