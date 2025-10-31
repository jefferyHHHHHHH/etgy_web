import { ElMessage, ElNotification } from 'element-plus'

export const notify = {
  success(message: string) {
    ElMessage.success(message)
  },
  info(message: string) {
    ElMessage.info(message)
  },
  warning(message: string) {
    ElMessage.warning(message)
  },
  error(message: string) {
    ElMessage.error(message)
  },
  detail(title: string, message: string) {
    ElNotification({ title, message, type: 'info' })
  },
}
