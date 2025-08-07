import { reactive } from 'vue'

export const DATABASE_PRIVILEGE_ALL = '%(ALL)'
export const DATABASE_PRIVILEGE_KEY_SEPARATOR = '|'
export const PRIVILEGE_META = [
  'ALTER',
  'CREATE',
  'CREATE VIEW',
  'DELETE',
  'DROP',
  'GRANT OPTION',
  'INDEX',
  'INSERT',
  'REFERENCES',
  'SELECT',
  'SHOW VIEW',
  'TRIGGER',
  'UPDATE',
  'ALTER ROUTINE',
  'CREATE ROUTINE',
  'CREATE TEMPORARY TABLES',
  'EXECUTE',
  'FILE',
  'LOCK TABLES',
]

export const grantStore = reactive({
  datasourceId: undefined,
  username: undefined,
  host: undefined,

  privList: [],

  // 获取缓存的权限
  getCachePrivByKey(key) {
    return this.privList.find((item) => item.key === key)
  },

  // 初始化值
  initBaseData({ datasourceId = 2, username = 'zy1', host = 'ym_zy' }) {
    this.datasourceId = datasourceId
    this.username = username
    this.host = host
  },

  // 更新缓存值
  updatePrivCache({ key, privCode, oldPrivCode }) {
    const keyIndex = this.privList.findIndex((item) => item.key === key)
    if (privCode === oldPrivCode) {
      if (keyIndex !== -1) {
        this.privList.splice(keyIndex, 1)
      }
      return
    }

    if (keyIndex === -1) {
      // 1. 不存在，直接添加
      this.privList.push({ privCode, oldPrivCode, key })
    } else {
      // 2. 存在，但是与初始值一致，直接移除该元素
      const current = this.privList[keyIndex]
      if (current.oldPrivCode === privCode) {
        this.privList.splice(keyIndex, 1)
      } else {
        // 3. 存在，但是不一致，更新该元素
        this.privList[keyIndex].privCode = privCode
      }
    }
  },

  // 修改的 database CacheKey 列表
  modifiedDbCacheKeys() {
    return this.privList
      .map((item) => item.key)
      .filter((key) => {
        const [, tableName] = key.split('|')
        return tableName === DATABASE_PRIVILEGE_ALL
      })
  },

  // 修改的 tableName CacheKey 列表
  modifiedTableCacheKeys() {
    return this.privList
      .map((item) => item.key)
      .filter((key) => {
        const [, tableName] = key.split('|')
        return tableName !== DATABASE_PRIVILEGE_ALL
      })
  },

  // 构建请求参数
  buildRes() {
    return {
      datasourceId: this.datasourceId,
      username: this.username,
      host: this.host,
      privList: this.privList,
    }
  },

  // 重置
  reset() {},
})

const demo = {
  datasourceId: 1,
  username: 'user1',
  host: 'localhost',
  privList: [
    { privCode: '1111100000', oldPrivCode: '0000000000', key: 'db_sims|t_student' },
    { privCode: '1010101010', oldPrivCode: '0000000000', key: 'db_sims|%(ALL)' },
    { privCode: '1010101010', oldPrivCode: '0000000000', key: '%(ALL)|%(ALL)' },
  ],
}
