import AuthCard from '@/components/auth/AuthCard'
import ProfileCard from '@/components/auth/ProfileCard'
import useAuth from '@/hooks/useAuth'

function App() {
  const { isAuthenticated, handleLoginSuccess, handleLogout } = useAuth()

  if (isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <ProfileCard onLogout={handleLogout} />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <AuthCard onLoginSuccess={handleLoginSuccess} />
    </main>
  )
}

export default App