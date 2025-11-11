export function useHotkeys(
  keys: string,
  handler: (event: KeyboardEvent) => void,
  options?: { preventDefault?: boolean }
) {
  const normalized = keys.toLowerCase().replace(/\s+/g, '')
  const pressed = new Set<string>()

  function onKeydown(e: KeyboardEvent) {
    const combo: string[] = []
    if (e.ctrlKey || e.metaKey) combo.push('ctrl')
    if (e.shiftKey) combo.push('shift')
    if (e.altKey) combo.push('alt')
    combo.push(e.key.toLowerCase())
    const current = combo.join('+')
    if (current === normalized) {
      if (options?.preventDefault) e.preventDefault()
      handler(e)
    }
  }

  window.addEventListener('keydown', onKeydown)
  return () => window.removeEventListener('keydown', onKeydown)
}

export function useHotkeys(
  keys: string,
  handler: (event: KeyboardEvent) => void,
  options?: { preventDefault?: boolean }
) {
  const combo = keys.toLowerCase().replace(/\s+/g, '')
  const listener = (e: KeyboardEvent) => {
    const pressed = [
      e.ctrlKey || e.metaKey ? 'ctrl' : '',
      e.shiftKey ? 'shift' : '',
      e.altKey ? 'alt' : '',
      e.key.toLowerCase(),
    ]
      .filter(Boolean)
      .join('+')
    if (pressed === combo) {
      if (options?.preventDefault) e.preventDefault()
      handler(e)
    }
  }
  window.addEventListener('keydown', listener)
  return () => window.removeEventListener('keydown', listener)
}


