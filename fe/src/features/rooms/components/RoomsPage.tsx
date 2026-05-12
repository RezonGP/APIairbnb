import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { getRooms } from '@/features/rooms/services/rooms.api'
import RoomCard from '@/features/rooms/components/RoomCard'
import type { Room } from '@/features/rooms/types/rooms'
import { navigateTo } from '@/lib/useHashRoute'

function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')

  const handleGetRooms = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      const result = await getRooms()
      setRooms(result.data)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Lấy danh sách phòng thất bại.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetRooms()
  }, [])

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rooms
    return rooms.filter((room) => {
      const haystack = `${room.tenPhong} ${room.viTri.tenViTri} ${room.viTri.tinhThanh} ${room.viTri.quocGia}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [rooms, query])

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Danh sách phòng
          </h1>
          <p className="text-sm text-slate-600">
            Tìm phòng theo tên hoặc vị trí.
          </p>
        </div>

        <div className="w-full sm:max-w-xs">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: TP HCM, Đà Lạt..."
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="aspect-[16/10] animate-pulse bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {filteredRooms.length} phòng
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => navigateTo(`/rooms/${room.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default RoomsPage
