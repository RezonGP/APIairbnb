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
import type { SigninFormData } from '@/types/auth'
import React, { useState } from 'react'
import { signin } from '@/services/auth.api'

const initialFormData: SigninFormData = {
    email: "",
    password: "",
}
const initialFieldErrors = {
    email: "",
    password: "",
}
export const SigninForm = () => {
    const [formData, setFormData] = useState(initialFormData)
    const [fieldError, setFieldError] = useState(initialFieldErrors)
    const [submitError, setSubmitError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setFieldError((prev) => ({
            ...prev,
            [name]: "",
        }))
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

    const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitError("")
        setSuccessMessage("")
        setIsLoading(true)

        const newErrors = validateForm()
        const hasError = newErrors.email || newErrors.password

        if (hasError) {
            setFieldError(newErrors)
            setIsLoading(false)
            return
        }
        try {
            const res = await signin(formData)
            localStorage.setItem("token", res.token)
            setSuccessMessage("Đăng nhập thành công")
            setFormData(initialFormData)
            setFieldError(initialFieldErrors)
            console.log(res)
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
                <form onSubmit={handleSumbit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="text" placeholder="Nhập email" name="email" value={formData.email} onChange={handleOnChange} />
                        {fieldError.email && <p className="text-red-500 text-sm">{fieldError.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Nhập password" value={formData.password} name="password" onChange={handleOnChange} />
                        {fieldError.password && <p className="text-red-500 text-sm">{fieldError.password}</p>}
                    </div>
                    {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Đang đăng nhập" : "Đăng nhập"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

