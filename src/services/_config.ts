export const USE_MOCK =
  String(
    (import.meta as any).env?.VITE_USE_MOCK ?? ((import.meta as any).env?.DEV ? 'true' : 'false')
  ).toLowerCase() === 'true'

export function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
