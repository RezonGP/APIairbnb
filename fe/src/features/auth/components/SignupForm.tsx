import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SignupFormData } from '@/features/auth/types/auth'
import React, { useState } from 'react'
import { signup } from '@/features/auth/services/auth.api'

const initialFormData: SignupFormData = {
    name: "",
    email: "",
    password: "",
    phone: "",
}
const initialError = {
    name: "",
    email: "",
    password: "",
    phone: "",
}
export const SignupForm = () => {
    const [formData, setFormData] = useState(initialFormData)
    const [fieldErrors, setFieldErrors] = useState(initialError)
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const nextValue = name === 'phone' ? value.replace(/\D/g, '') : value
        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
        }))
        setFieldErrors((prev) => ({
            ...prev,
            [name]: "",
        }))
        setSubmitError('')
        setSuccessMessage('')
    }
    const validateForm = () => {
        const newErrors = {
            ...initialError,
        }
        if (!formData.name) {
            newErrors.name = "Vui lòng nhập họ tên"
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
        if (!formData.email) {
            newErrors.email = "Vui lòng nhập email"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }
        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu"
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
        }
        if (!formData.phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại"
        } else if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại phải có 10 chữ số"
        }
        return newErrors
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSuccessMessage("")
        setSubmitError("")
        const newErrors = validateForm()
        const hasError =
            newErrors.name ||
            newErrors.email ||
            newErrors.password ||
            newErrors.phone
        if (hasError) {
            setFieldErrors(newErrors)
            return
        }
        setIsLoading(true)

        try {
            await signup(formData)
            setFormData(initialFormData)
            setFieldErrors(initialError)
            setSuccessMessage("Tạo tài khoản thành công")
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message)
            } else {
                setSubmitError("Lỗi không xác định")
            }

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-lg shadow-md">
            <CardHeader>
                <CardTitle>Tạo tài khoản</CardTitle>
                <CardDescription>
                    Bắt đầu dựng màn hình đăng ký từ khung giao diện trước
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Họ tên</Label>
                        <Input id="name" type="text" placeholder="Nhập họ tên" value={formData.name} name="name" onChange={handleChange} />
                        {fieldErrors.name && (
                            <p className="text-sm text-red-500">{fieldErrors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Nhập email" value={formData.email} name="email" onChange={handleChange} />
                        {fieldErrors.email && (
                            <p className="text-sm text-red-500">{fieldErrors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input id="password" type="password" placeholder="Nhập mật khẩu" value={formData.password} name="password" onChange={handleChange} />
                        {fieldErrors.password && (
                            <p className="text-sm text-red-500">{fieldErrors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" type="tel" placeholder="Nhập số điện thoại" maxLength={10} value={formData.phone} name="phone" onChange={handleChange} />
                        {fieldErrors.phone && (
                            <p className="text-sm text-red-500">{fieldErrors.phone}</p>
                        )}
                    </div>
                    {successMessage && (
                        <p className="text-sm text-green-500">{successMessage}</p>
                    )}
                    {submitError && (
                        <p className="text-sm text-red-500">{submitError}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Đang Xử Lý..." : "Tạo tài khoản"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}