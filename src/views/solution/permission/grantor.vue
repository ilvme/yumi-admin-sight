<script setup>
import { Coin, Document } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { DATABASE_PRIVILEGE_ALL, grantStore } from '@/views/solution/permission/grant.js'
import { reqDbList, reqPrivilege, reqTableList } from '@/api/grant.js'

// 库
const currentDbName = ref(DATABASE_PRIVILEGE_ALL)
const dbBoxLoading = ref(false)
const dbMenuKey = ref(new Date().getTime())
const dbList = ref([])
const filterDbText = ref('')
const filterDbList = computed(() =>
  dbList.value.filter((item) => item.includes(filterDbText.value)),
)

// 表
const currentTableName = ref(DATABASE_PRIVILEGE_ALL)
const tableBoxLoading = ref(false)
const tableMenuKey = ref(new Date().getTime())
const tableList = ref([])
const filterTableText = ref('')
const filterTableList = computed(() =>
  tableList.value.filter((item) => item.includes(filterTableText.value)),
)

// 权限
const privBoxLoading = ref(false)
const privilegesObj = ref({})
const privileges = ref({})

const ready = ref(false)
onMounted(async () => {
  ready.value = false
  const { data } = await reqDbList()
  dbList.value = data
  console.log(data)

  grantStore.initBaseData({})
})

const currentClickType = ref(1) // 1-db 2-table

// 点击 db 事件处理
async function onSelectDb(dbName) {
  try {
    tableBoxLoading.value = true
    currentClickType.value = 1
    currentDbName.value = dbName

    tableMenuKey.value = new Date().getTime()
    const { data } = await reqTableList({ dbName })
    tableList.value = data
  } catch (e) {
    console.error(e)
  }
  tableBoxLoading.value = false
}

const cacheKey = computed(() => `${currentDbName.value}|${currentTableName.value}`)

// 点击 table 事件处理
async function onSelectTable(tableName) {
  try {
    privBoxLoading.value = true
    currentClickType.value = 2
    currentTableName.value = tableName

    const cachedPrivs = grantStore.getCachePrivByKey(cacheKey.value)
    // 如果有操作过，直接请求缓存
    if (cachedPrivs) {
      codeToPriv(cachedPrivs.privCode)
      privilegesObj.value = {
        key: cacheKey.value,
        privCode: cachedPrivs.privCode,
        oldPrivCode: cachedPrivs.oldPrivCode,
      }
    } else {
      // 否则请求接口
      const data = await reqPrivilege({ key: cacheKey.value })
      privilegesObj.value = data
      codeToPriv(data.privCode)
    }
  } catch (e) {
    console.error(e)
  }
  privBoxLoading.value = false
}

// 判断是否修改
function isChanged(type, val) {
  if (type === 1) {
    const dbCacheKeys = grantStore.modifiedDbCacheKeys()
    const index = dbCacheKeys.findIndex((key) => key.split('|')[0] === val)

    return index > -1
  }
  if (type === 2) {
    const tableCacheKeys = grantStore.modifiedTableCacheKeys()
    const index = tableCacheKeys.findIndex(
      (key) => key.split('|')[1] === val && key.split('|')[0] === currentDbName.value,
    )
    return index > -1
  }
  return false
}

function codeToPriv(code) {}
</script>

<template>
  <el-card header="权限分配器">
    <main class="flex gap-2 border-1 min-h-[300px]">
      <!-- 库选择区域 -->
      <section class="w-2/5 p-2 border-r">
        <el-form-item label="数据库" size="small">
          <el-input suffix-icon="Search" v-model="filterDbText" />
        </el-form-item>

        <el-scrollbar v-loading="dbBoxLoading">
          <el-menu style="border: none" @select="onSelectDb" :key="dbMenuKey">
            <el-menu-item v-for="dbName in filterDbList" :key="dbName" :index="dbName">
              <template #title>
                <el-icon><Coin /></el-icon>
                <span :class="{ changed: isChanged(1, dbName) }">{{ dbName }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </section>

      <!-- 表选择区域 -->
      <section class="w-2/5 p-2 border-r">
        <el-form-item label="表" size="small">
          <el-input suffix-icon="Search" />
        </el-form-item>

        <el-scrollbar v-loading="tableBoxLoading">
          <el-menu
            style="border: none"
            @select="onSelectTable"
            :key="tableMenuKey"
            v-if="[1, 2].includes(currentClickType)"
          >
            <el-menu-item v-for="tableName in filterTableList" :key="tableName" :index="tableName">
              <template #title>
                <el-icon><Document /></el-icon>
                <span :class="{ changed: isChanged(2, tableName) }">{{ tableName }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </section>

      <!-- 权限操作区域 -->
      <section class="w-1/5 p-2">
        <!-- 表权限 -->
        <div v-if="currentClickType === 2 && !privBoxLoading">
          <div class="flex justify-between items-center">
            <el-text size="small">基础权限</el-text>

            <div class="gap-1">
              <el-button link type="primary">重置</el-button>
              <el-button link type="primary">全选</el-button>
              <el-button link type="primary">全不选</el-button>
            </div>
          </div>

          <div class="flex flex-col">
            <el-checkbox true-label="1" false-label="0" label="create" />
            <el-checkbox true-label="1" false-label="0" label="create" />
          </div>
        </div>

        <!-- 其他权限 -->
        <div v-if="currentClickType === 2 && !privBoxLoading">
          <div class="flex justify-between items-center">
            <el-text size="small">其他权限</el-text>

            <div class="gap-1">
              <el-button link type="primary">重置</el-button>
              <el-button link type="primary">全选</el-button>
              <el-button link type="primary">全不选</el-button>
            </div>
          </div>

          <div class="flex flex-col">
            <el-checkbox true-label="1" false-label="0" label="create" />
            <el-checkbox true-label="1" false-label="0" label="create" />
          </div>
        </div>

        <!-- 未选择表时空显示 -->
        <div v-if="currentClickType !== 2">
          <el-empty description="请先选中表后显示权限~" />
        </div>
      </section>
    </main>

    <section>信息提示区域</section>

    <section class="flex justify-end gap-2 mt-2">
      <el-button>取消</el-button>
      <el-button type="success">全部重置</el-button>
      <el-button type="primary">确定</el-button>
    </section>
  </el-card>
</template>

<style scoped>
.changed {
  color: #faad14;
}

.change-count {
  color: var(--el-color-primary);
  text-decoration: underline;
}

.el-menu-item {
  height: 30px;
  line-height: 30px;
  padding-left: 2px;
  font-size: 14px;
}

.el-menu-item .el-icon {
  margin-right: 1px;
}

.el-checkbox {
  margin-bottom: 3px;
  width: 100%;
  height: 22px;
}
</style>
