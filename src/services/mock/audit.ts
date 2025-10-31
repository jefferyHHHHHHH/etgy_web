import { delay } from '../_config'

export async function list(params: any) {
  await delay(120)
  const items = Array.from({ length: 20 }).map((_, i) => ({
    id: 'log_' + i,
    actorId: 'u_mock',
    action: ['login', 'video.review', 'video.publish'][i % 3],
    target: { type: ['user', 'video', 'video'][i % 3], id: i },
    createdAt: Date.now() - i * 3600 * 1000,
  }))
  return { items, total: items.length }
}
