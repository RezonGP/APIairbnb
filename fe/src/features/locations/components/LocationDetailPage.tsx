import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getLocationById } from '@/features/locations/services/locations.api'
import type { Location } from '@/features/locations/types/locations'
import { getRoomsByLocation } from '@/features/rooms/services/rooms.api'
import type { Room } from '@/features/rooms/types/rooms'
import RoomCard from '@/features/rooms/components/RoomCard'
import { navigateTo } from '@/lib/useHashRoute'

type LocationDetailPageProps = {
  locationId: number
}

function LocationDetailPage({ locationId }: LocationDetailPageProps) {
  const [location, setLocation] = useState<Location | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLoad = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const [locRes, roomsRes] = await Promise.all([
        getLocationById(locationId),
        getRoomsByLocation(locationId),
      ])
      setLocation(locRes.data)
      setRooms(roomsRes.data)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Tải vị trí thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleLoad()
  }, [locationId])

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-72 w-full animate-pulse rounded-xl bg-slate-200" />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
        <Button variant="outline" onClick={() => navigateTo('/locations')}>
          Quay lại danh sách vị trí
        </Button>
      </div>
    )
  }

  if (!location) return null

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {location.tenViTri}
          </h1>
          <p className="text-sm text-slate-600">
            {location.tinhThanh}, {location.quocGia}
          </p>
        </div>

        <Button variant="outline" onClick={() => navigateTo('/locations')}>
          Quay lại
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="aspect-[21/9] bg-slate-100">
          {location.hinhAnh ? (
            <img
              src={location.hinhAnh}
              alt={location.tenViTri}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
              Chưa có ảnh
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-slate-600">{rooms.length} phòng</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => navigateTo(`/rooms/${room.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LocationDetailPage

