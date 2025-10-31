export interface ApiResponse<T = unknown> {
  code: number
  message?: string
  msg?: string
  data: T
}

export type ApiResult<T = unknown> = T

export interface PageQuery {
  page?: number
  pageSize?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
}
