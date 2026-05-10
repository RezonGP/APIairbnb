import { AuthCard, ProfileCard, RoomsList, useAuth } from '@/features/auth'
import MainLayout from './layout/MainLayout'
function App() {
  const { isAuthenticated, handleLoginSuccess, handleLogout } = useAuth()

  return (
    <MainLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
      <div className="w-full space-y-6">
        <RoomsList />

        {isAuthenticated ? (
          <ProfileCard onLogout={handleLogout} />
        ) : (
          <AuthCard onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </MainLayout>
  )
}

export default App