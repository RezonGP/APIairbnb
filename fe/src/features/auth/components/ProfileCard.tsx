import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { getProfile } from '@/features/auth/services/auth.api'
import type { Profile } from '@/features/auth/types/auth'
import { uploadUserAvatar } from '@/features/users/services/users.api'
import { navigateTo } from '@/lib/useHashRoute'

type ProfileCardProps = {
    onLogout: () => void
}

function ProfileCard({ onLogout }: ProfileCardProps) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [uploadMessage, setUploadMessage] = useState('')
    const [uploadError, setUploadError] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    const handleGetProfile = async () => {
        setErrorMessage('')
        setIsLoading(true)

        try {
            const result = await getProfile()
            setProfile(result.data)
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
                const maybeHttpError = error as Error & { status?: number }
                if (maybeHttpError.status === 401) {
                    onLogout()
                }
            } else {
                setErrorMessage('Lấy profile thất bại.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleUploadAvatar = async () => {
        setUploadMessage('')
        setUploadError('')
        if (!avatarFile) {
            setUploadError('Vui lòng chọn ảnh.')
            return
        }
        setIsUploading(true)
        try {
            await uploadUserAvatar(avatarFile)
            setUploadMessage('Upload avatar thành công.')
            setAvatarFile(null)
            await handleGetProfile()
        } catch (error) {
            if (error instanceof Error) setUploadError(error.message)
            else setUploadError('Upload avatar thất bại.')
        } finally {
            setIsUploading(false)
        }
    }

    useEffect(() => {
        handleGetProfile()
    }, [])
    return (
        <Card className="w-full max-w-lg shadow-md">
            <CardHeader>
                <CardTitle>Tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {profile && (
                    <div className="space-y-3 rounded-xl border bg-white p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-100">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
                                        {profile.name.slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-medium text-slate-900">{profile.name}</p>
                                <p className="truncate text-sm text-slate-600">{profile.email}</p>
                                <p className="text-xs text-slate-500">Role: {profile.role}</p>
                            </div>
                        </div>

                        <div className="grid gap-2 text-sm text-slate-700">
                            <div className="flex justify-between gap-3">
                                <span className="text-slate-500">ID</span>
                                <span className="font-medium">{profile.id}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-slate-500">SĐT</span>
                                <span className="font-medium">{profile.phone}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-slate-500">Ngày sinh</span>
                                <span className="font-medium">{profile.birthday || 'Chưa có'}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-slate-500">Giới tính</span>
                                <span className="font-medium">
                                    {profile.gender === null
                                        ? 'Chưa có'
                                        : profile.gender
                                            ? 'Nam'
                                            : 'Nữ'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 rounded-lg border bg-slate-50 p-3">
                            <p className="text-sm font-medium text-slate-900">Upload avatar</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setUploadError('')
                                    setUploadMessage('')
                                    setAvatarFile(e.target.files?.[0] || null)
                                }}
                            />
                            {uploadError ? (
                                <p className="text-sm text-red-600">{uploadError}</p>
                            ) : null}
                            {uploadMessage ? (
                                <p className="text-sm text-emerald-700">{uploadMessage}</p>
                            ) : null}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleUploadAvatar}
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Đang upload...' : 'Upload'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setAvatarFile(null)
                                        setUploadError('')
                                        setUploadMessage('')
                                    }}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={() => navigateTo('/bookings')}>
                                Đặt phòng của tôi
                            </Button>
                            {profile.role === 'ADMIN' ? (
                                <Button variant="outline" onClick={() => navigateTo('/admin')}>
                                    Admin
                                </Button>
                            ) : null}
                            <Button variant="outline" onClick={handleGetProfile} disabled={isLoading}>
                                {isLoading ? 'Đang tải...' : 'Tải lại'}
                            </Button>
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <div className="space-y-2">
                        <p className="text-sm text-red-500">{errorMessage}</p>
                        <Button variant="outline" onClick={onLogout}>
                            Quay lại đăng nhập
                        </Button>
                    </div>
                )}
            </CardContent>

        </Card>
    )

}
export default ProfileCard
