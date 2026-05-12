export type CommentUser = {
  id: number
  name: string
  email: string
  role: string
}

export type Comment = {
  id: number
  maPhong: number
  maNguoiBinhLuan: number
  ngayBinhLuan: string
  noiDung: string
  saoBinhLuan: number
  createdAt: string
  updatedAt?: string
  nguoiDung?: CommentUser
}

export type CommentsResponse = {
  message: string
  data: Comment[]
}

export type CreateCommentPayload = {
  maPhong: number
  noiDung: string
  saoBinhLuan: number
}

