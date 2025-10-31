import type { Directive } from 'vue'
import { usePermsStore } from '../stores/modules/perms'
import { pinia } from '../stores'

export const vPermission: Directive = {
  mounted(el, binding) {
    const need: string[] = binding.value || []
    const perms = usePermsStore(pinia)
    const ok = need.length === 0 || need.some(p => perms.has(p))
    if (!ok) {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  },
}
