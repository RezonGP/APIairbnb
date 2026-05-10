export type SignupFormData = {
    name: string
    email: string
    password: string
    phone: string
}
export type SignupResponse = {
    message: string
    data: {
        id: number
        email: string
        name: string
        phone: string
    }
}
export type SigninFormData = {
    email: string
    password: string
}
export type SigninResponse = {
    message: string
    token: string
}
export type ProfileResponse = {
    message: string
    data: Profile
}
export type Profile = {
    id: number
    name: string
    email: string
    phone: string
    avatar: string | null
    birthday: string | null
    gender: boolean | null
    role: string
}
