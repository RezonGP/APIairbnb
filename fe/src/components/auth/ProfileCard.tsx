import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { getProfile } from '@/services/auth.api'

function ProfileCard() {
    const [profile, setProfile] = useState<null | Record<string, unknown>>(null)
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
                setErrorMessage('Lay profile that bai')
            }
        } finally {
            setIsLoading(false)
        }
    }

}
