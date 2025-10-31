import { http } from '../utils/http'
import { USE_MOCK } from './_config'
import * as mock from './mock/volunteer'

export function listVolunteers(q: any) {
  return USE_MOCK ? mock.list(q) : http.get('/volunteer/list', q)
}

export function upsertVolunteer(p: any) {
  return USE_MOCK ? mock.upsert(p) : http.post('/volunteer/create', p)
}
