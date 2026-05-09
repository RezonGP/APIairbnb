import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { getProfile } from '@/services/auth.api'
import type { Profile } from '@/types/auth'


type ProfileCardProps = {
    onLogout: () => void
}

function ProfileCard({ onLogout }: ProfileCardProps) {

    const [profile, setProfile] = useState<Profile | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const handleGetProfile = async () => {

        setErrorMessage('')
        setIsLoading(true)

        try {
            const result = await getProfile()
            setProfile(result.data)
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                setErrorMessage('Lấy profile thất bại.')
            }
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        handleGetProfile()
    }, [])
    return (
        <Card className="w-full max-w-lg shadow-md">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                    Test API profile bang token da luu
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleGetProfile} disabled={isLoading}>
                    {isLoading ? ' Đang lấy profile' : "Lấy profile"}
                </Button>
                <Button variant="outline" onClick={onLogout}>
                    Đăng xuất
                </Button>
                {profile && (
                    <div className="space-y-2 rounded-md bg-slate-100 p-4">
                        <p className="text-sm font-bold">ID: {profile.id}</p>
                        <p className="text-sm">Tên: {profile.name}</p>
                        <p className="text-sm">Email: {profile.email}</p>
                        <p className="text-sm">Số điện thoại: {profile.phone}</p>
                        <p className="text-sm">Avatar: {profile.avatar || 'Chưa cập nhật'}</p>
                        <p className="text-sm">Ngày sinh: {profile.birthday || 'Chưa cập nhật'}</p>
                        <p className="text-sm">
                            Giới tính:{' '}
                            {profile.gender === null ? 'Chưa cập nhật' : profile.gender ? 'Nam' : 'Nữ'}
                        </p>
                        <p className="text-sm">Vai trò: {profile.role}</p>
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
