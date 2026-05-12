import { AuthCard, ProfileCard, useAuth } from '@/features/auth'
import { RoomsPage, RoomDetailPage } from '@/features/rooms'
import { LocationsPage, LocationDetailPage } from '@/features/locations'
import { BookingsPage } from '@/features/bookings'
import { AdminPage } from '@/features/admin'
import { useHashRoute } from '@/lib/useHashRoute'
import MainLayout from './layout/MainLayout'
import { useEffect, useState } from 'react'
import { getProfile } from '@/features/auth/services/auth.api'
import type { HttpError } from '@/lib/http'

function App() {
  const { isAuthenticated, handleLoginSuccess, handleLogout } = useAuth()
  const route = useHashRoute()

  const [role, setRole] = useState<string | null>(null)
  const isAdmin = role === 'ADMIN'

  const handleLogoutAll = () => {
    setRole(null)
    handleLogout()
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setRole(null)
      return
    }

    let alive = true
    ;(async () => {
      try {
        const res = await getProfile()
        if (!alive) return
        setRole(res.data.role)
      } catch (error) {
        const e = error as Partial<HttpError>
        if (e?.status === 401) {
          handleLogoutAll()
        } else {
          setRole(null)
        }
      }
    })()

    return () => {
      alive = false
    }
  }, [isAuthenticated])

  const page =
    route.name === 'rooms' ? (
      <RoomsPage />
    ) : route.name === 'roomDetail' ? (
      <RoomDetailPage roomId={route.roomId} />
    ) : route.name === 'locations' ? (
      <LocationsPage />
    ) : route.name === 'locationDetail' ? (
      <LocationDetailPage locationId={route.locationId} />
    ) : route.name === 'bookings' ? (
      <BookingsPage isAuthenticated={isAuthenticated} />
    ) : route.name === 'admin' ? (
      <AdminPage isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
    ) : (
      <RoomsPage />
    )

  return (
    <MainLayout isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogoutAll}>
      {route.name === 'admin' ? (
        <div className="w-full">
          {page}
        </div>
      ) : (
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_360px]">
          {page}

          <div id="auth" className="h-fit lg:sticky lg:top-20">
            {isAuthenticated ? (
              <ProfileCard onLogout={handleLogoutAll} />
            ) : (
              <AuthCard onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default App
