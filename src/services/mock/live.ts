import { delay } from '../_config'

function genApplication(i: number) {
  const status = (['pending', 'approved', 'rejected'] as const)[i % 3]
  return {
    id: 'live_' + i,
    subject: `公开课 ${i}`,
    startTime: Date.now() + i * 3600 * 1000,
    endTime: Date.now() + (i * 3600 + 1800) * 1000,
    collegeId: 'c_001',
    applicantId: 'u_vol_' + i,
    status,
    createdAt: Date.now() - i * 7200 * 1000,
  }
}

export async function list(params: any) {
  await delay(200)
  const all = Array.from({ length: 23 }).map((_, i) => genApplication(i + 1))
  const filtered = params?.status ? all.filter(v => v.status === params.status) : all
  const page = Number(params?.page || 1)
  const pageSize = Number(params?.pageSize || 10)
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { items, total: filtered.length }
}

export async function review(p: { id: string; result: 'approved' | 'rejected'; reason?: string }) {
  await delay(150)
  return {}
}
