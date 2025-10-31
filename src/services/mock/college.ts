import { delay } from '../_config'

function load() {
  try {
    const raw = localStorage.getItem('mock_colleges')
    if (raw) return JSON.parse(raw)
  } catch {}
  const seeded = [
    { id: 'c_001', name: '教育学院', status: 'active', admins: [], createdAt: Date.now() },
    { id: 'c_002', name: '数学学院', status: 'active', admins: [], createdAt: Date.now() },
  ]
  save(seeded)
  return seeded
}
function save(list: any[]) {
  try {
    localStorage.setItem('mock_colleges', JSON.stringify(list))
  } catch {}
}

export async function list() {
  await delay(80)
  return load()
}

export async function upsert(p: any) {
  await delay(100)
  const all = load()
  const idx = all.findIndex((x: any) => x.id === p.id)
  if (idx >= 0) all[idx] = { ...all[idx], ...p }
  else all.unshift({ ...p, id: 'c_' + Date.now(), createdAt: Date.now() })
  save(all)
  return {}
}
