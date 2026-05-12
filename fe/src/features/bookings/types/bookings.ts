export type BookingRoom = {
  id: number
  tenPhong: string
  giaTien: number
  hinhAnh: string
}

export type BookingUser = {
  id: number
  name: string
  email: string
  phone: string
  role: string
}

export type Booking = {
  id: number
  maPhong: number
  ngayDen: string
  ngayDi: string
  soLuongKhach: number
  maNguoiDung: number
  createdAt: string
  updatedAt: string
  phong?: BookingRoom
  nguoiDung?: BookingUser
}

export type BookingsResponse = {
  message: string
  data: Booking[]
}

export type CreateBookingPayload = {
  maPhong: number
  soLuongKhach: number
  ngayDen: string
  ngayDi: string
}

