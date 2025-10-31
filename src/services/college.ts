import { http } from '../utils/http'
import { USE_MOCK } from './_config'
import * as mock from './mock/college'

export function listColleges() {
  return USE_MOCK ? mock.list() : http.get('/college/list')
}

export function upsertCollege(p: any) {
  return USE_MOCK ? mock.upsert(p) : http.post('/college/create', p)
}
