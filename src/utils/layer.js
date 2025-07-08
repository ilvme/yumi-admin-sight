import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const PLAIN = true
const DURATION = 3000

/**
 * Toast 用于纯前端提示
 */
export const Toast = {
  empty: () => {
    ElMessage.warning({ message: '请至少勾选一行数据', duration: DURATION, plain: PLAIN })
  },
  comingSoon: () => {
    ElMessage.warning({ message: '该功能即将上线', duration: DURATION, plain: PLAIN })
  },
  cancel: () => {
    ElMessage.info({ message: '您已取消操作', duration: DURATION, plain: PLAIN })
  },
  info: (message) => {
    ElMessage.info({ message, duration: DURATION, plain: PLAIN })
  },
  success: (message) => {
    ElMessage.success({ message, duration: DURATION, plain: PLAIN })
  },
  warning: (message) => {
    ElMessage.warning({ message, duration: DURATION, plain: PLAIN })
  },
  error: (message) => {
    ElMessage.error({ message, duration: DURATION, plain: PLAIN })
  },
}

export const Layer = {
  info: (message, options) => {
    ElNotification.info({ message, ...options })
  },
  warning: (message, options) => {
    ElNotification.warning({ message, ...options })
  },
  error: (message, options) => {
    ElNotification.error({ message, ...options })
  },
  success: (message, options) => {
    ElNotification.success({ message, ...options })
  },
  confirm: (message, title, options) => {
    title = title ?? '系统提示'
    const type = options?.type ?? 'warning'
    const closeOnClickModal = options?.closeOnClickModal || false
    const closeOnPressEscape = options?.closeOnPressEscape || false
    const closeOnHashChange = options?.closeOnHashChange || false
    const showClose = options?.showClose || true
    const showCancelButton = options?.showCancelButton || true
    const showConfirmButton = options?.showConfirmButton || true
    const cancelButtonText = options?.cancelButtonText || '取消'
    const confirmButtonText = options?.confirmButtonText || '确定'
    return ElMessageBox.confirm(message, title, {
      type,
      closeOnClickModal,
      closeOnPressEscape,
      closeOnHashChange,
      showClose,
      showCancelButton,
      showConfirmButton,
      cancelButtonText,
      confirmButtonText,
    })
  },
}

/**
 * Modal 用于全局加载弹窗
 */
export const Modal = {
  loading(text, background = 'rgba(0, 0, 0, 0.7)', lock = true) {
    return ElLoading.service({ text, background, lock })
  },
}
