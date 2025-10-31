import { http } from '../utils/http'
import { USE_MOCK } from './_config'
import * as mock from './mock/live'

export function getLiveApplications(q: any) {
  return USE_MOCK ? mock.list(q) : http.get('/live/apply/list', q)
}

export function reviewLiveApplication(p: {
  id: string
  result: 'approved' | 'rejected'
  reason?: string
}) {
  return USE_MOCK ? mock.review(p) : http.post('/live/apply/review', p)
}
