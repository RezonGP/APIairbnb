import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteBooking, getMyBookings } from '@/features/bookings/services/bookings.api'
import type { Booking } from '@/features/bookings/types/bookings'
import { navigateTo } from '@/lib/useHashRoute'

type BookingsPageProps = {
  isAuthenticated: boolean
}

function BookingsPage({ isAuthenticated }: BookingsPageProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLoad = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const res = await getMyBookings()
      setBookings(res.data)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Lấy danh sách đặt phòng thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    handleLoad()
  }, [isAuthenticated])

  const sorted = useMemo(() => {
    return [...bookings].sort((a, b) => b.id - a.id)
  }, [bookings])

  const handleDelete = async (bookingId: number) => {
    const ok = window.confirm(`Huỷ đặt phòng #${bookingId}?`)
    if (!ok) return
    try {
      await deleteBooking(bookingId)
      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Huỷ đặt phòng thất bại.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg border bg-white p-4 text-sm text-slate-700 shadow-sm">
          Bạn cần đăng nhập để xem danh sách đặt phòng của mình.
        </div>
        <Button variant="outline" onClick={() => navigateTo('/rooms')}>
          Quay lại danh sách phòng
        </Button>
      </div>
    )
  }

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Đặt phòng của tôi</h1>
          <p className="text-sm text-slate-600">Quản lý các lượt đặt phòng.</p>
        </div>

        <Button variant="outline" onClick={handleLoad} disabled={isLoading}>
          {isLoading ? 'Đang tải...' : 'Tải lại'}
        </Button>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-40 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((b) => (
            <Card key={b.id} className="overflow-hidden shadow-sm">
              <div className="flex gap-4 p-4">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {b.phong?.hinhAnh ? (
                    <img
                      src={b.phong.hinhAnh}
                      alt={b.phong.tenPhong}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {b.phong?.tenPhong || `Phòng #${b.maPhong}`}
                  </p>
                  <p className="text-xs text-slate-600">
                    {b.ngayDen} → {b.ngayDi}
                  </p>
                  <p className="text-xs text-slate-600">{b.soLuongKhach} khách</p>
                </div>
              </div>

              <CardContent className="flex items-center justify-between gap-2 border-t bg-white px-4 py-3">
                <Button variant="outline" onClick={() => navigateTo(`/rooms/${b.maPhong}`)}>
                  Xem phòng
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(b.id)}>
                  Huỷ
                </Button>
              </CardContent>
            </Card>
          ))}
          {sorted.length === 0 ? (
            <div className="rounded-lg border bg-white p-4 text-sm text-slate-700 shadow-sm">
              Chưa có đặt phòng nào.
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default BookingsPage
