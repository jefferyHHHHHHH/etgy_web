import { delay } from '../_config'

export async function login(data: { username: string; password: string }) {
  await delay(300)
  return {
    token: 'mock-jwt-' + Date.now(),
    user: { uid: 'u_' + Date.now(), roleIds: ['r_admin'] },
    permissions: [
      'menu.view:*',
      'video.viewAll',
      'video.create',
      'video.updateOwn',
      'video.deleteOwn',
      'video.review',
      'video.publish',
      'video.unpublish',
      'live.apply.viewAll',
      'live.apply.review',
      'volunteer.view',
      'volunteer.manage',
      'college.view',
      'college.manage',
      'role.manage',
      'audit.view',
    ],
  }
}

export async function logout() {
  await delay(100)
  return {}
}

export async function me() {
  await delay(100)
  return {
    user: { uid: 'u_mock', roleIds: ['r_admin'] },
    permissions: [
      'menu.view:*',
      'video.viewAll',
      'video.create',
      'video.updateOwn',
      'video.deleteOwn',
      'video.review',
      'video.publish',
      'video.unpublish',
      'live.apply.viewAll',
      'live.apply.review',
      'volunteer.view',
      'volunteer.manage',
      'college.view',
      'college.manage',
      'role.manage',
      'audit.view',
    ],
  }
}
