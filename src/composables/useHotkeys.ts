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


