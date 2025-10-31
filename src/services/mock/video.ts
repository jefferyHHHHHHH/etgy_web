import { delay } from '../_config'

const statuses = ['draft', 'in_review', 'approved', 'rejected', 'published', 'unpublished'] as const

function loadVideos() {
  try {
    const raw = localStorage.getItem('mock_videos')
    if (raw) return JSON.parse(raw)
  } catch {}
  const seeded = Array.from({ length: 24 }).map((_, i) => genVideo(i + 1))
  saveVideos(seeded)
  return seeded
}

function saveVideos(list: any[]) {
  try {
    localStorage.setItem('mock_videos', JSON.stringify(list))
  } catch {}
}

function genVideo(idx: number) {
  const status = statuses[idx % statuses.length]
  return {
    id: 'vid_' + idx,
    title: `示例视频 ${idx}`,
    desc: '用于演示的占位视频',
    tags: ['示例'],
    coverUrl: '',
    mediaUrls: { origin: 'cloud://mock/video.mp4' },
    duration: 1200,
    collegeId: 'c_001',
    status,
    createdBy: 'u_mock',
    createdAt: Date.now() - idx * 3600 * 1000,
  }
}

export async function list(params: any) {
  await delay(200)
  const all = loadVideos()
  const filtered = params?.status ? all.filter(v => v.status === params.status) : all
  const page = Number(params?.page || 1)
  const pageSize = Number(params?.pageSize || 10)
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { items, total: filtered.length }
}

export async function detail(q: { videoId: string }) {
  await delay(120)
  const all = loadVideos()
  const found = all.find(v => v.id === q.videoId)
  return found || null
}

export async function create(data: any) {
  await delay(200)
  const all = loadVideos()
  const id = 'vid_' + Date.now()
  const item = {
    id,
    title: data.title,
    desc: data.desc || '',
    tags: data.tags || [],
    coverUrl: data.coverUrl || '',
    mediaUrls: data.mediaUrls || { origin: '' },
    duration: Number(data.duration || 0),
    gradeRange: data.gradeRange || '',
    collegeId: data.collegeId || 'c_001',
    status: 'draft',
    createdBy: 'u_mock',
    createdAt: Date.now(),
  }
  all.unshift(item)
  saveVideos(all)
  return { videoId: id, status: 'draft' }
}

export async function update(data: any) {
  await delay(160)
  const all = loadVideos()
  const idx = all.findIndex(v => v.id === data.videoId)
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data, id: data.videoId }
    saveVideos(all)
  }
  return {}
}

export async function submitReview(data: { videoId: string }) {
  await delay(120)
  const all = loadVideos()
  const v = all.find(x => x.id === data.videoId)
  if (v && (v.status === 'draft' || v.status === 'rejected')) {
    v.status = 'in_review'
    saveVideos(all)
  }
  return {}
}

export async function review(data: {
  videoId: string
  result: 'approved' | 'rejected'
  reason?: string
}) {
  await delay(150)
  const all = loadVideos()
  const v = all.find(x => x.id === data.videoId)
  if (v && v.status === 'in_review') {
    v.status = data.result === 'approved' ? 'approved' : 'rejected'
    saveVideos(all)
  }
  return {}
}

export async function publish(data: { videoId: string }) {
  await delay(120)
  const all = loadVideos()
  const v = all.find(x => x.id === data.videoId)
  if (v && v.status === 'approved') {
    v.status = 'published'
    saveVideos(all)
  }
  return {}
}

export async function unpublish(data: { videoId: string }) {
  await delay(120)
  const all = loadVideos()
  const v = all.find(x => x.id === data.videoId)
  if (v && v.status === 'published') {
    v.status = 'unpublished'
    saveVideos(all)
  }
  return {}
}
