import { useMemo, useState } from 'react'
import type { Room } from '@/features/rooms/types/rooms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RoomCardProps = {
  room: Room
  onClick?: () => void
}

function RoomCard({ room, onClick }: RoomCardProps) {
  const [imageError, setImageError] = useState(false)

  const price = useMemo(() => {
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(room.giaTien)
    } catch {
      return `${room.giaTien} VND`
    }
  }, [room.giaTien])

  const location = `${room.viTri.tenViTri}, ${room.viTri.tinhThanh}`

  return (
    <Card
      className="overflow-hidden shadow-sm transition hover:shadow-md"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative aspect-[16/10] bg-slate-100">
        {!imageError && room.hinhAnh ? (
          <img
            src={room.hinhAnh}
            alt={room.tenPhong}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
            Chưa có ảnh
          </div>
        )}
      </div>

      <CardHeader className="space-y-1">
        <CardTitle className="truncate text-base">{room.tenPhong}</CardTitle>
        <p className="truncate text-sm text-slate-600">{location}</p>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span className="font-medium">{price}</span>
          <span className="text-slate-500">/ đêm</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {room.khach} khách
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {room.phongNgu} PN
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {room.giuong} giường
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {room.phongTam} PT
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoomCard
