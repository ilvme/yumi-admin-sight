/**
 * 自定义指令，用于使表格自适应高度
 */
export default {
  mounted(el, binding, vnode) {
    calcHeight(el, binding, vnode)

    window.addEventListener('resize', () => {
      setTimeout(() => {
        calcHeight(el, binding, vnode)
      }, 250)
    })
  },

  unmounted(el, binding, vnode) {
    window.removeEventListener('resize', () => {
      setTimeout(() => {
        calcHeight(el, binding, vnode)
      }, 250)
    })
  },
}

/**
 * 计算表格最大高度，计算逻辑为：100vh - 表格到浏览器下方的距离 - 表格到浏览器上方的距离
 *
 * @param el 表格 dom
 * @param binding 表格 binding
 * @param vnode 表格虚拟对象
 */
function calcHeight(el, binding, vnode) {
  // 获取表格到浏览器视窗上方的距离
  const { y } = el.getBoundingClientRect()

  // 获取表格下方 DOM 结构所占高度
  const tableBottom = calcTableToBottom(binding.value)

  // 两个距离之和小于浏览器视口时，表格高度最大为浏览器视口高度减去两个距离
  if (window.innerHeight >= y + tableBottom) {
    console.log(window.innerHeight)
    vnode.ctx.props.maxHeight = `${window.innerHeight - y - tableBottom}px`
  } else {
    // 否则，表格高度最小为 100px
    vnode.ctx.props.maxHeight = `100px`
  }
}

function calcTableToBottom(bindings) {
  // 无分页
  if (bindings?.hasPagination === false) {
    return 20
  }

  // 无按钮
  if (bindings?.hasBtn === true) {
    return 60
  }

  // 无按钮且无分页
  return 50
}
