export type User = {
  id: number
  name: string
  email: string
  phone: string
  avatar: string | null
  birthday: string | null
  gender: boolean | null
  role: string
  createdAt?: string
  updatedAt?: string
}

export type UsersResponse = {
  message: string
  data: User[]
}

