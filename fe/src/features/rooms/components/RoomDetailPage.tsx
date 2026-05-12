import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createBooking } from '@/features/bookings/services/bookings.api'
import { getCommentsByRoom, createComment } from '@/features/comments/services/comments.api'
import type { Comment } from '@/features/comments/types/comments'
import { getRoomById } from '@/features/rooms/services/rooms.api'
import type { Room } from '@/features/rooms/types/rooms'
import { navigateTo } from '@/lib/useHashRoute'
import { cn } from '@/lib/utils'

type RoomDetailPageProps = {
  roomId: number
}

const initialBookingForm = {
  soLuongKhach: '1',
  ngayDen: '',
  ngayDi: '',
}

const initialCommentForm = {
  noiDung: '',
  saoBinhLuan: '5',
}

function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [bookingForm, setBookingForm] = useState(initialBookingForm)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [isBookingLoading, setIsBookingLoading] = useState(false)

  const [commentForm, setCommentForm] = useState(initialCommentForm)
  const [commentMessage, setCommentMessage] = useState('')
  const [commentError, setCommentError] = useState('')
  const [isCommentLoading, setIsCommentLoading] = useState(false)

  const handleLoad = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const [roomRes, commentsRes] = await Promise.all([
        getRoomById(roomId),
        getCommentsByRoom(roomId),
      ])
      setRoom(roomRes.data)
      setComments(commentsRes.data)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Tải phòng thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setBookingForm(initialBookingForm)
    setBookingMessage('')
    setBookingError('')
    setCommentForm(initialCommentForm)
    setCommentMessage('')
    setCommentError('')
    handleLoad()
  }, [roomId])

  const price = useMemo(() => {
    if (!room) return ''
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(room.giaTien)
    } catch {
      return `${room.giaTien} VND`
    }
  }, [room])

  const amenities = useMemo(() => {
    if (!room) return []
    const items: Array<{ label: string; enabled: boolean }> = [
      { label: 'WiFi', enabled: room.wifi },
      { label: 'Điều hoà', enabled: room.dieuHoa },
      { label: 'Bếp', enabled: room.bep },
      { label: 'Máy giặt', enabled: room.mayGiat },
      { label: 'Bàn là', enabled: room.banLa },
      { label: 'TV', enabled: room.tivi },
      { label: 'Đỗ xe', enabled: room.doXe },
      { label: 'Hồ bơi', enabled: room.hoBoi },
    ]
    return items.filter((x) => x.enabled)
  }, [room])

  const handleCreateBooking = async () => {
    setBookingMessage('')
    setBookingError('')

    const soLuongKhach = Number(bookingForm.soLuongKhach)
    if (!Number.isFinite(soLuongKhach) || soLuongKhach <= 0) {
      setBookingError('Số lượng khách không hợp lệ.')
      return
    }
    if (!bookingForm.ngayDen || !bookingForm.ngayDi) {
      setBookingError('Vui lòng chọn ngày đến và ngày đi.')
      return
    }

    setIsBookingLoading(true)
    try {
      await createBooking({
        maPhong: roomId,
        soLuongKhach,
        ngayDen: bookingForm.ngayDen,
        ngayDi: bookingForm.ngayDi,
      })
      setBookingMessage('Đặt phòng thành công.')
      setBookingForm(initialBookingForm)
    } catch (error) {
      if (error instanceof Error) setBookingError(error.message)
      else setBookingError('Đặt phòng thất bại.')
    } finally {
      setIsBookingLoading(false)
    }
  }

  const handleCreateComment = async () => {
    setCommentMessage('')
    setCommentError('')

    const noiDung = commentForm.noiDung.trim()
    const saoBinhLuan = Number(commentForm.saoBinhLuan)

    if (!noiDung) {
      setCommentError('Vui lòng nhập nội dung bình luận.')
      return
    }
    if (!Number.isFinite(saoBinhLuan) || saoBinhLuan < 1 || saoBinhLuan > 5) {
      setCommentError('Số sao phải từ 1 đến 5.')
      return
    }

    setIsCommentLoading(true)
    try {
      const res = await createComment({ maPhong: roomId, noiDung, saoBinhLuan })
      setCommentMessage('Gửi bình luận thành công.')
      setCommentForm(initialCommentForm)
      setComments((prev) => [res.data, ...prev])
    } catch (error) {
      if (error instanceof Error) setCommentError(error.message)
      else setCommentError('Gửi bình luận thất bại.')
    } finally {
      setIsCommentLoading(false)
    }
  }

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
        <Button variant="outline" onClick={() => navigateTo('/rooms')}>
          Quay lại danh sách phòng
        </Button>
      </div>
    )
  }

  if (!room) return null

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">{room.tenPhong}</h1>
          <p className="text-sm text-slate-600">
            {room.viTri.tenViTri}, {room.viTri.tinhThanh}, {room.viTri.quocGia}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigateTo('/rooms')}>
          Quay lại
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="aspect-[21/9] bg-slate-100">
          {room.hinhAnh ? (
            <img
              src={room.hinhAnh}
              alt={room.tenPhong}
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

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Thông tin</CardTitle>
              <p className="text-sm text-slate-600">{price} / đêm</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-1">
                  {room.khach} khách
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-1">
                  {room.phongNgu} phòng ngủ
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-1">
                  {room.giuong} giường
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-1">
                  {room.phongTam} phòng tắm
                </span>
              </div>
              <p className="whitespace-pre-line text-slate-700">{room.moTa}</p>

              {amenities.length ? (
                <div className="space-y-2">
                  <p className="font-medium text-slate-900">Tiện nghi</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                    {amenities.map((a) => (
                      <span key={a.label} className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">
                        {a.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Bình luận</CardTitle>
              <p className="text-sm text-slate-600">{comments.length} bình luận</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 rounded-lg border bg-white p-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Nội dung</label>
                    <textarea
                      value={commentForm.noiDung}
                      onChange={(e) => {
                        setCommentError('')
                        setCommentMessage('')
                        setCommentForm((prev) => ({ ...prev, noiDung: e.target.value }))
                      }}
                      className={cn(
                        'min-h-24 w-full rounded-md border bg-white p-2 text-sm outline-none',
                        commentError ? 'border-red-300' : 'border-slate-200'
                      )}
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Số sao</label>
                    <Input
                      value={commentForm.saoBinhLuan}
                      onChange={(e) => {
                        setCommentError('')
                        setCommentMessage('')
                        setCommentForm((prev) => ({ ...prev, saoBinhLuan: e.target.value }))
                      }}
                      inputMode="numeric"
                    />
                  </div>
                </div>

                {commentError ? (
                  <div className="text-sm text-red-600">{commentError}</div>
                ) : null}
                {commentMessage ? (
                  <div className="text-sm text-emerald-700">{commentMessage}</div>
                ) : null}

                <div className="flex justify-end">
                  <Button onClick={handleCreateComment} disabled={isCommentLoading}>
                    {isCommentLoading ? 'Đang gửi...' : 'Gửi bình luận'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border bg-white p-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">
                          {c.nguoiDung?.name || `User #${c.maNguoiBinhLuan}`}
                        </p>
                        <p className="text-xs text-slate-500">{c.ngayBinhLuan}</p>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {c.saoBinhLuan}/5
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-slate-700">{c.noiDung}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-fit lg:sticky lg:top-20">
          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Đặt phòng</CardTitle>
              <p className="text-sm text-slate-600">
                Đăng nhập để đặt phòng và xem lịch sử.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Số lượng khách</label>
                  <Input
                    value={bookingForm.soLuongKhach}
                    onChange={(e) => {
                      setBookingError('')
                      setBookingMessage('')
                      setBookingForm((prev) => ({ ...prev, soLuongKhach: e.target.value }))
                    }}
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Ngày đến</label>
                  <Input
                    type="date"
                    value={bookingForm.ngayDen}
                    onChange={(e) => {
                      setBookingError('')
                      setBookingMessage('')
                      setBookingForm((prev) => ({ ...prev, ngayDen: e.target.value }))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Ngày đi</label>
                  <Input
                    type="date"
                    value={bookingForm.ngayDi}
                    onChange={(e) => {
                      setBookingError('')
                      setBookingMessage('')
                      setBookingForm((prev) => ({ ...prev, ngayDi: e.target.value }))
                    }}
                  />
                </div>
              </div>

              {bookingError ? (
                <div className="text-sm text-red-600">{bookingError}</div>
              ) : null}
              {bookingMessage ? (
                <div className="text-sm text-emerald-700">{bookingMessage}</div>
              ) : null}

              <div className="grid gap-2">
                <Button onClick={handleCreateBooking} disabled={isBookingLoading}>
                  {isBookingLoading ? 'Đang đặt...' : 'Đặt ngay'}
                </Button>
                <Button variant="outline" onClick={() => navigateTo('/bookings')}>
                  Xem đặt phòng của tôi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default RoomDetailPage
