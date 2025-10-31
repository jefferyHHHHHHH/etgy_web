import { http } from '../utils/http'
import { USE_MOCK } from './_config'
import * as mock from './mock/audit'

export function listAudits(q: any) {
  return USE_MOCK ? mock.list(q) : http.get('/audit/list', q)
}
