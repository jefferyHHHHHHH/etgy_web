export interface UserProfile {
  id: string
  name: string
  role: 'admin' | 'user' | 'guest'
}
