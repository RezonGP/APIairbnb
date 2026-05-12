import { Button } from '@/components/ui/button'
import { navigateTo, useHashRoute } from '@/lib/useHashRoute'

type NavbarProps = {
    isAuthenticated: boolean
    isAdmin: boolean
    onLogout: () => void
}

function Navbar({ isAuthenticated, isAdmin, onLogout }: NavbarProps) {
    const route = useHashRoute()

    const isRoomsActive = route.name === 'rooms' || route.name === 'roomDetail'
    const isLocationsActive =
        route.name === 'locations' || route.name === 'locationDetail'
    const isBookingsActive = route.name === 'bookings'
    const isAdminActive = route.name === 'admin'

    const handleGoAuth = () => {
        navigateTo('/rooms')
        setTimeout(() => {
            document
                .getElementById('auth')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
    }

    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <a href="#/rooms" className="text-lg font-semibold">
                    APIairbnb
                </a>

                <div className="flex items-center gap-2">
                    <Button
                        variant={isRoomsActive ? 'secondary' : 'ghost'}
                        size="sm"
                        asChild
                    >
                        <a href="#/rooms">Phòng</a>
                    </Button>
                    <Button
                        variant={isLocationsActive ? 'secondary' : 'ghost'}
                        size="sm"
                        asChild
                    >
                        <a href="#/locations">Vị trí</a>
                    </Button>
                    <Button
                        variant={isBookingsActive ? 'secondary' : 'ghost'}
                        size="sm"
                        asChild
                    >
                        <a href="#/bookings">Đặt phòng</a>
                    </Button>
                    {isAdmin ? (
                        <Button
                            variant={isAdminActive ? 'secondary' : 'ghost'}
                            size="sm"
                            asChild
                        >
                            <a href="#/admin">Admin</a>
                        </Button>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <Button variant="outline" onClick={onLogout} size="sm">
                            Đăng xuất
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={handleGoAuth} size="sm">
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
