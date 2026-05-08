import { useState } from "react"
import { SigninForm } from "./components/auth/SigninFrom"
import { SignupForm } from "./components/auth/SignupForm"
import { Button } from "./components/ui/button"

function App() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signin')
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant={mode === 'signin' ? 'default' : 'outline'} onClick={() => setMode('signin')}>
            Đăng nhập
          </Button>
          <Button variant={mode === 'signup' ? 'default' : 'outline'} onClick={() => setMode('signup')}>
            Đăng ký
          </Button>

        </div>

        {mode === 'signin' ? <SigninForm /> : <SignupForm />}
      </div>
    </main>
  )
}

export default App