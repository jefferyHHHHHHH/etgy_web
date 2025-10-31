import { http } from '../utils/http'
import { USE_MOCK } from './_config'
import * as mock from './mock/video'

export function listVideos(q: any) {
  return USE_MOCK ? mock.list(q) : http.get('/video/list', q)
}

export function getVideoDetail(q: { videoId: string }) {
  return USE_MOCK ? mock.detail(q) : http.get('/video/detail', q)
}

export function createVideo(p: any) {
  return USE_MOCK ? mock.create(p) : http.post('/video/create', p)
}

export function updateVideo(p: any) {
  return USE_MOCK ? mock.update(p) : http.post('/video/update', p)
}

export function submitVideoReview(p: { videoId: string }) {
  return USE_MOCK ? mock.submitReview(p) : http.post('/video/submitReview', p)
}

export function reviewVideo(p: {
  videoId: string
  result: 'approved' | 'rejected'
  reason?: string
}) {
  return USE_MOCK ? mock.review(p) : http.post('/video/review', p)
}

export function publishVideo(p: { videoId: string }) {
  return USE_MOCK ? mock.publish(p) : http.post('/video/publish', p)
}

export function unpublishVideo(p: { videoId: string }) {
  return USE_MOCK ? mock.unpublish(p) : http.post('/video/unpublish', p)
}
