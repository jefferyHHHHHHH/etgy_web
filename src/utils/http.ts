import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from '../types/api'
import { notify } from './notify'
import { useUserStore } from '../stores/modules/user'
import { pinia } from '../stores'

export interface ExtendedAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  ignoreCancel?: boolean
  retry?: number
  showError?: boolean
}

const baseURL = import.meta.env.VITE_API_BASE
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 15000)

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout,
  withCredentials: false,
})

// 记录未完成请求以去重/取消
const pendingControllers = new Map<string, AbortController>()

function buildKey(config: AxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [
    method,
    url,
    JSON.stringify(params),
    typeof data === 'string' ? data : JSON.stringify(data),
  ].join('&')
}

function addPending(config: ExtendedAxiosRequestConfig) {
  if (config.ignoreCancel) return
  const key = buildKey(config)
  // 已有同一请求则取消旧的
  const prev = pendingControllers.get(key)
  if (prev) prev.abort()
  const controller = new AbortController()
  config.signal = controller.signal
  pendingControllers.set(key, controller)
}

function removePending(config: AxiosRequestConfig) {
  const key = buildKey(config)
  const controller = pendingControllers.get(key)
  if (controller) {
    pendingControllers.delete(key)
  }
}

function getAuthToken(): string | null {
  try {
    const userStore = useUserStore(pinia)
    return userStore.token
  } catch {
    return null
  }
}

instance.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
  addPending(config)
  const token = getAuthToken()
  if (token) {
    config.headers = Object.assign({}, config.headers, {
      Authorization: `Bearer ${token}`,
    })
  }
  // 标准头
  config.headers = Object.assign({ 'X-Requested-With': 'XMLHttpRequest' }, config.headers)
  return config
})

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    removePending(response.config)

    const contentType = String(response.headers['content-type'] || '')
    // 直接返回非 JSON（如文件流）
    if (!contentType.includes('application/json')) return response.data as any

    const body = response.data as ApiResponse
    // 兼容后端不同字段命名
    const code = (body as any).code
    const msg = (body.message || (body as any).msg) as string | undefined

    if (typeof code === 'number') {
      if (code === 0) return body.data as any
      // 业务错误
      if ((response.config as ExtendedAxiosRequestConfig).showError !== false) {
        notify.error(msg ?? '业务错误')
      }
      return Promise.reject({ code, message: msg, response })
    }

    // 无 code 视为已经是 data
    return body as any
  },
  async (error: AxiosError) => {
    const config = error.config as ExtendedAxiosRequestConfig | undefined
    if (config) removePending(config)

    const status = error.response?.status
    if (status === 401) {
      try {
        const userStore = useUserStore(pinia)
        await userStore.logout()
        // 懒导入路由，避免循环依赖
        const { default: router } = await import('../router')
        router.replace('/').catch(() => {})
      } catch {}
    }

    // 简易重试（默认 0 次）
    if (config && (config.retry ?? 0) > 0) {
      config.retry = (config.retry as number) - 1
      return instance(config)
    }

    const message = error.message || '网络错误'
    if (!config || config.showError !== false) notify.error(message)
    return Promise.reject(error)
  }
)

export const http = {
  get<T = any>(url: string, params?: any, config?: ExtendedAxiosRequestConfig) {
    return instance.get<T>(url, { params, ...(config || {}) })
  },
  post<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) {
    return instance.post<T>(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) {
    return instance.put<T>(url, data, config)
  },
  patch<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) {
    return instance.patch<T>(url, data, config)
  },
  delete<T = any>(url: string, params?: any, config?: ExtendedAxiosRequestConfig) {
    return instance.delete<T>(url, { params, ...(config || {}) })
  },
}

export default instance
