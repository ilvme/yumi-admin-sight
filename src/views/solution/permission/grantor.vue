<script setup>
import { Coin, Document } from '@element-plus/icons-vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { DATABASE_PRIVILEGE_ALL, grantStore } from '@/views/solution/permission/grant.js'
import { reqDbList, reqPrivilege, reqTableList, reqGrant } from '@/api/grant.js'
import { Layer, Toast } from '@/utils/layer.js'

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

const dbChangeCount = computed(() => grantStore.modifiedDbCacheKeys().length)
const tableChangeCount = computed(() => grantStore.modifiedTableCacheKeys().length)

// 权限
const privBoxLoading = ref(false)
const privilegesObj = ref({})
const privileges = ref({
  alterChecked: '0',
  createChecked: '0',
  createViewChecked: '0',
  deleteChecked: '0',
  dropChecked: '0',
  grantOptionChecked: '0',
  indexChecked: '0',
  insertChecked: '0',
  referencesChecked: '0',
  selectChecked: '0',
  showViewChecked: '0',
  triggerChecked: '0',
  updateChecked: '0',

  alterRoutineChecked: '0',
  createRoutineChecked: '0',
  createTemporaryTablesChecked: '0',
  executeChecked: '0',
  fileChecked: '0',
  lockTablesChecked: '0',
})

const ready = ref(false)
onMounted(async () => {
  ready.value = false
  const { data } = await reqDbList()
  dbList.value = data
  console.log(data)

  grantStore.initBaseData({})
})

onBeforeUnmount(() => {
  reset()
})

const confirmLoading = ref(false)
async function onConfirm() {
  const data = grantStore.buildRes()
  if (data.privList.length === 0) {
    Toast.warning('您尚未进行任何权限分配')
    return
  }

  confirmLoading.value = true
  const res = await reqGrant(data)
  Toast.success('')
  confirmLoading.value = false
}

// 重置全部权限
function onResetPriv() {
  Layer.confirm('重置会将当前您已经配置但尚未保存的权限配置全部丢失，是否继续')
    .then(() => {
      grantStore.privList = []
      codeToPriv(privilegesObj.value.oldPrivCode)
    })
    .catch(() => {
      Toast.cancel()
    })
}

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
      const { data } = await reqPrivilege({ key: cacheKey.value })
      console.log('dddd', data)
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

function codeToPriv(code) {
  const [
    alterChecked,
    createChecked,
    createViewChecked,
    deleteChecked,
    dropChecked,
    grantOptionChecked,
    indexChecked,
    insertChecked,
    referencesChecked,
    selectChecked,
    showViewChecked,
    triggerChecked,
    updateChecked,
    alterRoutineChecked,
    createRoutineChecked,
    createTemporaryTablesChecked,
    executeChecked,
    fileChecked,
    lockTablesChecked,
  ] = code

  privileges.value.alterChecked = alterChecked
  privileges.value.createChecked = createChecked
  privileges.value.createViewChecked = createViewChecked
  privileges.value.deleteChecked = deleteChecked
  privileges.value.dropChecked = dropChecked
  privileges.value.grantOptionChecked = grantOptionChecked
  privileges.value.indexChecked = indexChecked
  privileges.value.insertChecked = insertChecked
  privileges.value.referencesChecked = referencesChecked
  privileges.value.selectChecked = selectChecked
  privileges.value.showViewChecked = showViewChecked
  privileges.value.triggerChecked = triggerChecked
  privileges.value.updateChecked = updateChecked
  privileges.value.alterRoutineChecked = alterRoutineChecked
  privileges.value.createRoutineChecked = createRoutineChecked
  privileges.value.createTemporaryTablesChecked = createTemporaryTablesChecked
  privileges.value.executeChecked = executeChecked
  privileges.value.fileChecked = fileChecked
  privileges.value.lockTablesChecked = lockTablesChecked
}

function handleChange() {
  const privCode = Object.values(privileges.value).join('')

  grantStore.updatePrivCache({
    key: cacheKey.value,
    privCode,
    oldPrivCode: privilegesObj.value.oldPrivCode,
  })
}

// 背景色运算
function privStyle(index) {
  const colorList = []
  const privObj = grantStore.getCachePrivByKey(cacheKey.value)
  if (!privObj) {
    return 'inherit'
  }

  const { privCode } = privObj

  // privCode 与 oldPrivCode 按位比较，如果相同，color 为 inherit。不同的话，privCode 的对应位为 1，则 color 为 绿色，否则为红色
  for (let i = 0; i < privCode.length; i++) {
    const oldItem = privilegesObj.value.oldPrivCode[i]
    const newItem = privCode[i]

    if (oldItem === newItem) {
      colorList.push('inherit')
    } else {
      colorList.push(oldItem === '1' ? '#ff00001c' : '#0080001a')
    }
  }

  return colorList[index]
}

function reset() {
  grantStore.reset()
  filterDbText.value = ''
  filterTableText.value = ''
}
</script>

<template>
  <el-card header="权限分配器">
    <main class="flex gap-2 border-1 min-h-[550px]" style="border-color: var(--el-border-color)">
      <!-- 库选择区域 -->
      <section class="w-3/8 p-2 border-r" style="border-color: var(--el-border-color)">
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
      <section class="w-3/8 p-2 border-r" style="border-color: var(--el-border-color)">
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
      <section class="w-2/8 p-2">
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
            <el-checkbox
              true-value="1"
              false-value="0"
              label="alter"
              v-model="privileges.alterChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(0) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="create"
              v-model="privileges.createChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(1) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="create View"
              v-model="privileges.createViewChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(2) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="delete"
              v-model="privileges.deleteChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(3) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="drop"
              v-model="privileges.dropChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(4) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="grant option"
              v-model="privileges.grantOptionChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(5) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="index"
              v-model="privileges.indexChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(6) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="insert"
              v-model="privileges.insertChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(7) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="references"
              v-model="privileges.referencesChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(8) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="select"
              v-model="privileges.selectChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(9) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="show view"
              v-model="privileges.showViewChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(10) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="trigger"
              v-model="privileges.triggerChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(11) }"
            />

            <el-checkbox
              true-value="1"
              false-value="0"
              label="update"
              v-model="privileges.updateChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(12) }"
            />
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
            <el-checkbox
              true-value="1"
              false-value="0"
              label="alter routine"
              v-model="privileges.alterRoutineChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(13) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="create routine"
              v-model="privileges.createRoutineChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(14) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="create temporary tables"
              v-model="privileges.createTemporaryTablesChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(15) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="execute"
              v-model="privileges.executeChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(16) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="file"
              v-model="privileges.fileChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(17) }"
            />
            <el-checkbox
              true-value="1"
              false-value="0"
              label="lock tables"
              v-model="privileges.lockTablesChecked"
              @change="handleChange"
              :style="{ backgroundColor: privStyle(18) }"
            />
          </div>
        </div>

        <!-- 未选择表时空显示 -->
        <div v-if="currentClickType !== 2">
          <el-empty description="请先选中表后显示权限~" />
        </div>
      </section>
    </main>

    <section>
      您已对
      <span class="change-count">{{ dbChangeCount }}</span> 个库对象的权限进行了修改，
      <span class="change-count">{{ tableChangeCount }}</span>
      个表对象的权限进行了修改，点击下方确认按钮即可保存修改。
    </section>

    <section class="flex justify-end gap-2 mt-2">
      <el-button type="success" @click="onResetPriv" :disabled="grantStore.privList.length === 0">
        全部重置
      </el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
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
