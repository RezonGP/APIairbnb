import { useEffect, useState } from 'react'

export type HashRoute =
  | { name: 'rooms' }
  | { name: 'roomDetail'; roomId: number }
  | { name: 'locations' }
  | { name: 'locationDetail'; locationId: number }
  | { name: 'bookings' }
  | { name: 'admin' }

function normalizeHashPath(hash: string) {
  const raw = hash.replace(/^#/, '')
  if (!raw) return '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

function parseRoute(hash: string): HashRoute {
  const path = normalizeHashPath(hash)
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) return { name: 'rooms' }

  if (segments[0] === 'rooms') {
    if (segments[1]) {
      const roomId = Number(segments[1])
      if (Number.isFinite(roomId) && roomId > 0) return { name: 'roomDetail', roomId }
    }
    return { name: 'rooms' }
  }

  if (segments[0] === 'locations') {
    if (segments[1]) {
      const locationId = Number(segments[1])
      if (Number.isFinite(locationId) && locationId > 0)
        return { name: 'locationDetail', locationId }
    }
    return { name: 'locations' }
  }

  if (segments[0] === 'bookings') return { name: 'bookings' }
  if (segments[0] === 'admin') return { name: 'admin' }

  return { name: 'rooms' }
}

export function useHashRoute() {
  const [route, setRoute] = useState<HashRoute>(() => parseRoute(window.location.hash))

  useEffect(() => {
    const handler = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return route
}

export function navigateTo(hashPath: string) {
  const next = hashPath.startsWith('#') ? hashPath : `#${hashPath}`
  if (window.location.hash === next) return
  window.location.hash = next
}

