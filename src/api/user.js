import dayjs from 'dayjs'

const userList = [
  {
    id: 1,
    username: '张三',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '张三的描述',
    createTime: '2021-01-01',
  },
  {
    id: 2,
    username: '李四',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '李四的描述',
    createTime: '2022-01-01',
  },
  {
    id: 3,
    username: '王五',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '王五的描述',
    createTime: '2023-01-01',
  },
  {
    id: 4,
    username: '赵六',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '赵六的描述',
    createTime: '2024-01-01',
  },
  {
    id: 5,
    username: '孙七',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '孙七的描述',
    createTime: '2025-01-01',
  },
  {
    id: 6,
    username: '周八',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '周八的描述',
    createTime: '2026-01-01',
  },
  {
    id: 7,
    username: '吴九',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '吴九的描述',
    createTime: '2027-01-01',
  },
  {
    id: 8,
    username: '郑十',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '郑十的描述',
    createTime: '2028-01-01',
  },
  {
    id: 9,
    username: '王十',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '王十的描述',
    createTime: '2029-01-01',
  },
  {
    id: 10,
    username: '小十',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十的描述',
    createTime: '2030-01-01',
  },
  {
    id: 11,
    username: '小十一',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十一的描述',
    createTime: '2031-01-01',
  },
  {
    id: 12,
    username: '小十二',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十二的描述',
    createTime: '2032-01-01',
  },
  {
    id: 13,
    username: '小十三',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十三的描述',
    createTime: '2033-01-01',
  },
  {
    id: 14,
    username: '小十四',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十四的描述',
    createTime: '2034-01-01',
  },
  {
    id: 15,
    username: '小十五',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十五的描述',
    createTime: '2035-01-01',
  },
  {
    id: 16,
    username: '小十六',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十六的描述',
    createTime: '2036-01-01',
  },
  {
    id: 17,
    username: '小十七',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十七的描述',
    createTime: '2037-01-01',
  },
  {
    id: 18,
    username: '小十八',
    status: 0,
    email: 'ika@ocom',
    phone: '13321123431',
    desc: '小十八的描述',
    createTime: '2038-01-01',
  },
]

// 模拟异步查询请求，带分页参数，带搜索条件
export function reqUserList(params) {
  let list = [...userList]
  const { pageSize, pageNum } = params

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          total: list.length,
          list: list.slice((pageNum - 1) * pageSize, pageNum * params.pageSize),
        },
      })
    }, 500)
  })
}
