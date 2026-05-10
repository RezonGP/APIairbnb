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
import type { SigninFormData } from '@/features/auth/types/auth'
import React, { useState } from 'react'
import { signin } from '@/features/auth/services/auth.api'

const initialFormData: SigninFormData = {
    email: "",
    password: "",
}
const initialFieldErrors = {
    email: "",
    password: "",
}
type SigninFormProps = {
    onLoginSuccess: () => void
}

export const SigninForm = ({ onLoginSuccess }: SigninFormProps) => {
    const [formData, setFormData] = useState(initialFormData)
    const [fieldErrors, setFieldErrors] = useState(initialFieldErrors)
    const [submitError, setSubmitError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setFieldErrors((prev) => ({
            ...prev,
            [name]: "",
        }))
        setSubmitError('')
    }
    const validateForm = () => {
        const newErrors = {
            ...initialFieldErrors,
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu'
        }

        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // setSubmitError("")
        // setSuccessMessage("")

        const newErrors = validateForm()
        const hasError = newErrors.email || newErrors.password

        if (hasError) {
            setFieldErrors(newErrors)
            return
        }
        setIsLoading(true)
        try {
            const res = await signin(formData)
            localStorage.setItem("token", res.token)
            onLoginSuccess()
            setFormData(initialFormData)
            setFieldErrors(initialFieldErrors)
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message)
            } else {
                setSubmitError("Đăng nhập thất bại")
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Card className="w-full max-w-lg shadow-md">
            <CardHeader>
                <CardTitle>Đăng nhập</CardTitle>
                <CardDescription>
                    Nhập email và mật khẩu để đăng nhập
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="text" placeholder="Nhập email" name="email" value={formData.email} onChange={handleOnChange} />
                        {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input id="password" type="password" placeholder="Nhập mật khẩu" value={formData.password} name="password" onChange={handleOnChange} />
                        {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
                    </div>
                    {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Đang đăng nhập" : "Đăng nhập"}
                    </Button>

                </form>
            </CardContent>
        </Card>
    )
}

