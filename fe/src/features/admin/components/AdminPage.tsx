import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getAllBookingsAdmin, deleteBooking } from '@/features/bookings/services/bookings.api'
import type { Booking } from '@/features/bookings/types/bookings'
import { getAllComments, deleteComment } from '@/features/comments/services/comments.api'
import type { Comment } from '@/features/comments/types/comments'
import {
  createLocation,
  deleteLocation,
  getLocations,
  updateLocation,
  uploadLocationImage,
} from '@/features/locations/services/locations.api'
import type { Location } from '@/features/locations/types/locations'
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
  uploadRoomImage,
} from '@/features/rooms/services/rooms.api'
import type { Room } from '@/features/rooms/types/rooms'
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '@/features/users/services/users.api'
import type { User } from '@/features/users/types/users'

type AdminPageProps = {
  isAuthenticated: boolean
  isAdmin: boolean
}

type AdminSection = 'rooms' | 'locations' | 'users' | 'bookings' | 'comments'

const initialRoomForm = {
  id: '',
  tenPhong: '',
  khach: '1',
  phongNgu: '1',
  giuong: '1',
  phongTam: '1',
  moTa: '',
  giaTien: '0',
  maViTri: '',
  mayGiat: false,
  banLa: false,
  tivi: false,
  dieuHoa: false,
  wifi: false,
  bep: false,
  doXe: false,
  hoBoi: false,
  banUi: false,
}

const initialLocationForm = {
  id: '',
  tenViTri: '',
  tinhThanh: '',
  quocGia: '',
}

const initialUserForm = {
  id: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'USER',
}

function AdminPage({ isAuthenticated, isAdmin }: AdminPageProps) {
  const [section, setSection] = useState<AdminSection>('rooms')

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [rooms, setRooms] = useState<Room[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  const [roomForm, setRoomForm] = useState(initialRoomForm)
  const [locationForm, setLocationForm] = useState(initialLocationForm)
  const [userForm, setUserForm] = useState(initialUserForm)

  const [roomUploadFile, setRoomUploadFile] = useState<Record<number, File | null>>({})
  const [locationUploadFile, setLocationUploadFile] = useState<Record<number, File | null>>({})

  const handleLoad = async (nextSection: AdminSection) => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      if (nextSection === 'rooms') {
        const res = await getRooms()
        setRooms(res.data)
      } else if (nextSection === 'locations') {
        const res = await getLocations()
        setLocations(res.data)
      } else if (nextSection === 'users') {
        const res = await getUsers()
        setUsers(res.data)
      } else if (nextSection === 'bookings') {
        const res = await getAllBookingsAdmin()
        setBookings(res.data)
      } else if (nextSection === 'comments') {
        const res = await getAllComments()
        setComments(res.data)
      }
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Tải dữ liệu admin thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return
    handleLoad(section)
  }, [isAuthenticated, isAdmin, section])

  const roomsSorted = useMemo(() => [...rooms].sort((a, b) => b.id - a.id), [rooms])
  const locationsSorted = useMemo(
    () => [...locations].sort((a, b) => b.id - a.id),
    [locations]
  )
  const usersSorted = useMemo(() => [...users].sort((a, b) => b.id - a.id), [users])
  const bookingsSorted = useMemo(
    () => [...bookings].sort((a, b) => b.id - a.id),
    [bookings]
  )
  const commentsSorted = useMemo(
    () => [...comments].sort((a, b) => b.id - a.id),
    [comments]
  )

  const resetForms = () => {
    setRoomForm(initialRoomForm)
    setLocationForm(initialLocationForm)
    setUserForm(initialUserForm)
  }

  const handleSaveRoom = async () => {
    setErrorMessage('')
    const payload = {
      tenPhong: roomForm.tenPhong,
      khach: Number(roomForm.khach),
      phongNgu: Number(roomForm.phongNgu),
      giuong: Number(roomForm.giuong),
      phongTam: Number(roomForm.phongTam),
      moTa: roomForm.moTa,
      giaTien: Number(roomForm.giaTien),
      maViTri: Number(roomForm.maViTri),
      mayGiat: roomForm.mayGiat,
      banLa: roomForm.banLa,
      tivi: roomForm.tivi,
      dieuHoa: roomForm.dieuHoa,
      wifi: roomForm.wifi,
      bep: roomForm.bep,
      doXe: roomForm.doXe,
      hoBoi: roomForm.hoBoi,
      banUi: roomForm.banUi,
    }
    try {
      if (roomForm.id) {
        const res = await updateRoom(Number(roomForm.id), payload)
        setRooms((prev) => prev.map((r) => (r.id === res.data.id ? res.data : r)))
      } else {
        const res = await createRoom(payload)
        setRooms((prev) => [res.data, ...prev])
      }
      setRoomForm(initialRoomForm)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Lưu phòng thất bại.')
    }
  }

  const handleEditRoom = (room: Room) => {
    setRoomForm({
      id: String(room.id),
      tenPhong: room.tenPhong,
      khach: String(room.khach),
      phongNgu: String(room.phongNgu),
      giuong: String(room.giuong),
      phongTam: String(room.phongTam),
      moTa: room.moTa,
      giaTien: String(room.giaTien),
      maViTri: String(room.maViTri),
      mayGiat: room.mayGiat,
      banLa: room.banLa,
      tivi: room.tivi,
      dieuHoa: room.dieuHoa,
      wifi: room.wifi,
      bep: room.bep,
      doXe: room.doXe,
      hoBoi: room.hoBoi,
      banUi: room.banUi,
    })
  }

  const handleDeleteRoom = async (id: number) => {
    const ok = window.confirm(`Xoá phòng #${id}?`)
    if (!ok) return
    setErrorMessage('')
    try {
      await deleteRoom(id)
      setRooms((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Xoá phòng thất bại.')
    }
  }

  const handleUploadRoomImage = async (roomId: number) => {
    const file = roomUploadFile[roomId]
    if (!file) {
      setErrorMessage('Vui lòng chọn file ảnh.')
      return
    }
    setErrorMessage('')
    try {
      await uploadRoomImage(roomId, file)
      await handleLoad('rooms')
      setRoomUploadFile((prev) => ({ ...prev, [roomId]: null }))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Upload ảnh phòng thất bại.')
    }
  }

  const handleSaveLocation = async () => {
    setErrorMessage('')
    const payload = {
      tenViTri: locationForm.tenViTri,
      tinhThanh: locationForm.tinhThanh,
      quocGia: locationForm.quocGia,
    }
    try {
      if (locationForm.id) {
        const res = await updateLocation(Number(locationForm.id), payload)
        setLocations((prev) => prev.map((l) => (l.id === res.data.id ? res.data : l)))
      } else {
        const res = await createLocation(payload)
        setLocations((prev) => [res.data, ...prev])
      }
      setLocationForm(initialLocationForm)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Lưu vị trí thất bại.')
    }
  }

  const handleEditLocation = (loc: Location) => {
    setLocationForm({
      id: String(loc.id),
      tenViTri: loc.tenViTri,
      tinhThanh: loc.tinhThanh,
      quocGia: loc.quocGia,
    })
  }

  const handleDeleteLocation = async (id: number) => {
    const ok = window.confirm(`Xoá vị trí #${id}?`)
    if (!ok) return
    setErrorMessage('')
    try {
      await deleteLocation(id)
      setLocations((prev) => prev.filter((l) => l.id !== id))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Xoá vị trí thất bại.')
    }
  }

  const handleUploadLocationImage = async (locationId: number) => {
    const file = locationUploadFile[locationId]
    if (!file) {
      setErrorMessage('Vui lòng chọn file ảnh.')
      return
    }
    setErrorMessage('')
    try {
      await uploadLocationImage(locationId, file)
      await handleLoad('locations')
      setLocationUploadFile((prev) => ({ ...prev, [locationId]: null }))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Upload ảnh vị trí thất bại.')
    }
  }

  const handleSaveUser = async () => {
    setErrorMessage('')
    const payload = {
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
    }
    try {
      if (userForm.id) {
        const res = await updateUser(Number(userForm.id), payload)
        setUsers((prev) => prev.map((u) => (u.id === res.data.id ? res.data : u)))
      } else {
        const res = await createUser({
          ...payload,
          password: userForm.password,
        })
        setUsers((prev) => [res.data, ...prev])
      }
      setUserForm(initialUserForm)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Lưu user thất bại.')
    }
  }

  const handleEditUser = (user: User) => {
    setUserForm({
      id: String(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role,
    })
  }

  const handleDeleteUser = async (id: number) => {
    const ok = window.confirm(`Xoá user #${id}?`)
    if (!ok) return
    setErrorMessage('')
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Xoá user thất bại.')
    }
  }

  const handleDeleteBooking = async (id: number) => {
    const ok = window.confirm(`Xoá booking #${id}?`)
    if (!ok) return
    setErrorMessage('')
    try {
      await deleteBooking(id)
      setBookings((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Xoá booking thất bại.')
    }
  }

  const handleDeleteComment = async (id: number) => {
    const ok = window.confirm(`Xoá bình luận #${id}?`)
    if (!ok) return
    setErrorMessage('')
    try {
      await deleteComment(id)
      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Xoá bình luận thất bại.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg border bg-white p-4 text-sm text-slate-700 shadow-sm">
          Bạn cần đăng nhập để vào trang Admin.
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
          Bạn không có quyền truy cập trang Admin.
        </div>
      </div>
    )
  }

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Admin</h1>
          <p className="text-sm text-slate-600">
            Rooms, Locations, Users, Bookings, Comments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={section === 'rooms' ? 'default' : 'outline'}
            onClick={() => {
              resetForms()
              setSection('rooms')
            }}
          >
            Phòng
          </Button>
          <Button
            variant={section === 'locations' ? 'default' : 'outline'}
            onClick={() => {
              resetForms()
              setSection('locations')
            }}
          >
            Vị trí
          </Button>
          <Button
            variant={section === 'users' ? 'default' : 'outline'}
            onClick={() => {
              resetForms()
              setSection('users')
            }}
          >
            Users
          </Button>
          <Button
            variant={section === 'bookings' ? 'default' : 'outline'}
            onClick={() => {
              resetForms()
              setSection('bookings')
            }}
          >
            Bookings
          </Button>
          <Button
            variant={section === 'comments' ? 'default' : 'outline'}
            onClick={() => {
              resetForms()
              setSection('comments')
            }}
          >
            Comments
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
      ) : null}

      {section === 'rooms' ? (
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">
                {roomForm.id ? `Sửa phòng #${roomForm.id}` : 'Tạo phòng'}
              </CardTitle>
              <p className="text-sm text-slate-600">
                Endpoint: POST/PUT /api/phong-thue
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Tên phòng</label>
                  <Input
                    value={roomForm.tenPhong}
                    onChange={(e) => setRoomForm((p) => ({ ...p, tenPhong: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Mã vị trí</label>
                  <Input
                    value={roomForm.maViTri}
                    onChange={(e) => setRoomForm((p) => ({ ...p, maViTri: e.target.value }))}
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Giá tiền</label>
                  <Input
                    value={roomForm.giaTien}
                    onChange={(e) => setRoomForm((p) => ({ ...p, giaTien: e.target.value }))}
                    inputMode="numeric"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Khách</label>
                    <Input
                      value={roomForm.khach}
                      onChange={(e) => setRoomForm((p) => ({ ...p, khach: e.target.value }))}
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">PN</label>
                    <Input
                      value={roomForm.phongNgu}
                      onChange={(e) => setRoomForm((p) => ({ ...p, phongNgu: e.target.value }))}
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Giường</label>
                    <Input
                      value={roomForm.giuong}
                      onChange={(e) => setRoomForm((p) => ({ ...p, giuong: e.target.value }))}
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">PT</label>
                    <Input
                      value={roomForm.phongTam}
                      onChange={(e) => setRoomForm((p) => ({ ...p, phongTam: e.target.value }))}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Mô tả</label>
                <textarea
                  value={roomForm.moTa}
                  onChange={(e) => setRoomForm((p) => ({ ...p, moTa: e.target.value }))}
                  className="min-h-24 w-full rounded-md border border-slate-200 bg-white p-2 text-sm outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-700">
                {([
                  ['wifi', 'WiFi'],
                  ['dieuHoa', 'Điều hoà'],
                  ['bep', 'Bếp'],
                  ['mayGiat', 'Máy giặt'],
                  ['tivi', 'TV'],
                  ['doXe', 'Đỗ xe'],
                  ['hoBoi', 'Hồ bơi'],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={roomForm[key]}
                      onChange={(e) => setRoomForm((p) => ({ ...p, [key]: e.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveRoom}>{roomForm.id ? 'Cập nhật' : 'Tạo'}</Button>
                <Button
                  variant="outline"
                  onClick={() => setRoomForm(initialRoomForm)}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Danh sách phòng</CardTitle>
              <p className="text-sm text-slate-600">{roomsSorted.length} phòng</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Tên</th>
                      <th className="px-3 py-2">Giá</th>
                      <th className="px-3 py-2">Vị trí</th>
                      <th className="px-3 py-2">Ảnh</th>
                      <th className="px-3 py-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomsSorted.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-3 py-2">{r.id}</td>
                        <td className="px-3 py-2">{r.tenPhong}</td>
                        <td className="px-3 py-2">{r.giaTien}</td>
                        <td className="px-3 py-2">{r.maViTri}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setRoomUploadFile((prev) => ({
                                  ...prev,
                                  [r.id]: e.target.files?.[0] || null,
                                }))
                              }
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUploadRoomImage(r.id)}
                            >
                              Upload
                            </Button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditRoom(r)}>
                              Sửa
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteRoom(r.id)}>
                              Xoá
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {section === 'locations' ? (
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">
                {locationForm.id ? `Sửa vị trí #${locationForm.id}` : 'Tạo vị trí'}
              </CardTitle>
              <p className="text-sm text-slate-600">Endpoint: POST/PUT /api/vi-tri</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Tên vị trí</label>
                  <Input
                    value={locationForm.tenViTri}
                    onChange={(e) =>
                      setLocationForm((p) => ({ ...p, tenViTri: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Tỉnh/Thành</label>
                  <Input
                    value={locationForm.tinhThanh}
                    onChange={(e) =>
                      setLocationForm((p) => ({ ...p, tinhThanh: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Quốc gia</label>
                  <Input
                    value={locationForm.quocGia}
                    onChange={(e) =>
                      setLocationForm((p) => ({ ...p, quocGia: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveLocation}>
                  {locationForm.id ? 'Cập nhật' : 'Tạo'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocationForm(initialLocationForm)}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Danh sách vị trí</CardTitle>
              <p className="text-sm text-slate-600">{locationsSorted.length} vị trí</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Tên</th>
                      <th className="px-3 py-2">Tỉnh</th>
                      <th className="px-3 py-2">Quốc gia</th>
                      <th className="px-3 py-2">Ảnh</th>
                      <th className="px-3 py-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationsSorted.map((l) => (
                      <tr key={l.id} className="border-t">
                        <td className="px-3 py-2">{l.id}</td>
                        <td className="px-3 py-2">{l.tenViTri}</td>
                        <td className="px-3 py-2">{l.tinhThanh}</td>
                        <td className="px-3 py-2">{l.quocGia}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setLocationUploadFile((prev) => ({
                                  ...prev,
                                  [l.id]: e.target.files?.[0] || null,
                                }))
                              }
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUploadLocationImage(l.id)}
                            >
                              Upload
                            </Button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditLocation(l)}>
                              Sửa
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteLocation(l.id)}>
                              Xoá
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {section === 'users' ? (
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">
                {userForm.id ? `Sửa user #${userForm.id}` : 'Tạo user'}
              </CardTitle>
              <p className="text-sm text-slate-600">Endpoint: /api/users</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Name</label>
                  <Input
                    value={userForm.name}
                    onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Email</label>
                  <Input
                    value={userForm.email}
                    onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Phone</label>
                  <Input
                    value={userForm.phone}
                    onChange={(e) => setUserForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Role</label>
                  <Input
                    value={userForm.role}
                    onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}
                  />
                </div>
                {!userForm.id ? (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-900">Password</label>
                    <Input
                      value={userForm.password}
                      onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))}
                      type="password"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveUser}>{userForm.id ? 'Cập nhật' : 'Tạo'}</Button>
                <Button variant="outline" onClick={() => setUserForm(initialUserForm)}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Danh sách users</CardTitle>
              <p className="text-sm text-slate-600">{usersSorted.length} users</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersSorted.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-3 py-2">{u.id}</td>
                        <td className="px-3 py-2">{u.name}</td>
                        <td className="px-3 py-2">{u.email}</td>
                        <td className="px-3 py-2">{u.phone}</td>
                        <td className="px-3 py-2">{u.role}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditUser(u)}>
                              Sửa
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}>
                              Xoá
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {section === 'bookings' ? (
        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Danh sách bookings (Admin)</CardTitle>
            <p className="text-sm text-slate-600">{bookingsSorted.length} bookings</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-600">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Room</th>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Ngày</th>
                    <th className="px-3 py-2">Khách</th>
                    <th className="px-3 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsSorted.map((b) => (
                    <tr key={b.id} className="border-t">
                      <td className="px-3 py-2">{b.id}</td>
                      <td className="px-3 py-2">{b.maPhong}</td>
                      <td className="px-3 py-2">{b.maNguoiDung}</td>
                      <td className="px-3 py-2">
                        {b.ngayDen} → {b.ngayDi}
                      </td>
                      <td className="px-3 py-2">{b.soLuongKhach}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteBooking(b.id)}>
                          Xoá
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {section === 'comments' ? (
        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Danh sách comments</CardTitle>
            <p className="text-sm text-slate-600">{commentsSorted.length} comments</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-600">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Room</th>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Sao</th>
                    <th className="px-3 py-2">Nội dung</th>
                    <th className="px-3 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {commentsSorted.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-3 py-2">{c.id}</td>
                      <td className="px-3 py-2">{c.maPhong}</td>
                      <td className="px-3 py-2">{c.maNguoiBinhLuan}</td>
                      <td className="px-3 py-2">{c.saoBinhLuan}</td>
                      <td className="px-3 py-2">{c.noiDung}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteComment(c.id)}>
                          Xoá
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}

export default AdminPage
