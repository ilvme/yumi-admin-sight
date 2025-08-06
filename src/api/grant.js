const datasourceId = 1
const allList = [
  { dbName: '%(ALL)', tableNameList: ['%(ALL)'] },
  { dbName: 'db_1', tableNameList: ['%(ALL)', 'table_1', 'table_2'] },
  { dbName: 'db_2', tableNameList: ['%(ALL)', 'table_1', 'table_2'] },
  { dbName: 'db_3', tableNameList: ['%(ALL)', 'table_1', 'table_2'] },
  { dbName: 'db_4', tableNameList: ['%(ALL)', 'table_1', 'table_2'] },
  { dbName: 'db_5', tableNameList: ['%(ALL)', 'table_1', 'table_2'] },
  { dbName: 'db_6', tableNameList: ['%(ALL)', 'table_1', 'table_2'] },
]

// 获取 数据库列表
export function reqDbList(filterText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        // data: allList.map((item) => item.dbName).filter((item) => item.includes(filterText)),
        data: allList.map((item) => item.dbName),
      })
    }, 500)
  })
}

// 获取 表列表
export function reqTableList({ dbName, filterText }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: allList.find((item) => item.dbName === dbName).tableNameList,
      })
    }, 500)
  })
}

// 获取权限信息
export function reqPrivilege(key) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          key,
          oldPrivCode: '111110000000000000',
          privCode: '111110000000000000',
        },
      })
    }, 500)
  })
}

export function reqGrant(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data,
      })
    }, 500)
  })
}
