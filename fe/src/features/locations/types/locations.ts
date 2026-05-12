export type Location = {
  id: number
  tenViTri: string
  tinhThanh: string
  quocGia: string
  hinhAnh: string
  createdAt?: string
  updatedAt?: string
}

export type LocationsResponse = {
  message: string
  data: Location[]
}

