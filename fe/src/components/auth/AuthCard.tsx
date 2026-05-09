import { useState } from 'react'
import { SigninForm } from '@/components/auth/SigninForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { Button } from '@/components/ui/button'

type AuthCardProps = {
    onLoginSuccess: () => void
}
function AuthCard({ onLoginSuccess }: AuthCardProps) {
    const [mode, setMode] = useState<'signup' | 'signin'>('signin')

    return (
        <div className="w-full max-w-lg space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant={mode === 'signin' ? 'default' : 'outline'}
                    onClick={() => setMode('signin')}
                >
                    Đăng nhập
                </Button>

                <Button
                    variant={mode === 'signup' ? 'default' : 'outline'}
                    onClick={() => setMode('signup')}
                >
                    Đăng ký
                </Button>
            </div>

            {mode === 'signin' ? (<SigninForm onLoginSuccess={onLoginSuccess} />) : (<SignupForm />)}
        </div>
    )
}

export default AuthCard