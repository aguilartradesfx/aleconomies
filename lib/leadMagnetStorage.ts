// Persiste los datos de contacto del usuario de los lead magnets en localStorage
// para que no tenga que volver a llenarlos al consumir otra pieza dentro de 30 días.

const STORAGE_KEY = 'aleconomies-lead-data-v1'
const TTL_MS = 30 * 24 * 60 * 60 * 1000

export interface StoredLeadData {
  name: string
  email: string
  phone?: string
}

interface StoredEntry {
  data: StoredLeadData
  savedAt: number
}

export function saveLeadData(data: StoredLeadData): void {
  if (typeof window === 'undefined') return
  try {
    const entry: StoredEntry = { data, savedAt: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
  } catch {
    // localStorage puede fallar en modo privado o si está lleno — silenciamos.
  }
}

export function getLeadData(): StoredLeadData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw) as StoredEntry
    if (!entry?.savedAt || !entry?.data?.email) return null
    if (Date.now() - entry.savedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export function clearLeadData(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
