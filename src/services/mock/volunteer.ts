import { delay } from '../_config'

function load() {
  try {
    const raw = localStorage.getItem('mock_volunteers')
    if (raw) return JSON.parse(raw)
  } catch {}
  const seeded = Array.from({ length: 12 }).map((_, i) => ({
    uid: 'u_vol_' + (i + 1),
    name: `志愿者${i + 1}`,
    phone: '1380000' + String(100 + i),
    collegeId: 'c_001',
    status: 'active',
    createdAt: Date.now() - i * 86400000,
  }))
  save(seeded)
  return seeded
}
function save(list: any[]) {
  try {
    localStorage.setItem('mock_volunteers', JSON.stringify(list))
  } catch {}
}

export async function list(params: any) {
  await delay(150)
  const all = load()
  const page = Number(params?.page || 1)
  const pageSize = Number(params?.pageSize || 10)
  const start = (page - 1) * pageSize
  return { items: all.slice(start, start + pageSize), total: all.length }
}

export async function upsert(p: any) {
  await delay(120)
  const all = load()
  const idx = all.findIndex((x: any) => x.uid === p.uid)
  if (idx >= 0) all[idx] = { ...all[idx], ...p }
  else all.unshift({ ...p, uid: 'u_vol_' + Date.now(), createdAt: Date.now() })
  save(all)
  return {}
}
