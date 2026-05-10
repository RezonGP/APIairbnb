import { Button } from '@/components/ui/button'

type NavbarProps = {
    isAuthenticated: boolean
    onLogout: () => void
}

function Navbar({ isAuthenticated, onLogout }: NavbarProps) {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <div className="text-lg font-semibold">Airbnb</div>

                {isAuthenticated ? (
                    <Button variant="outline" onClick={onLogout}>
                        Đăng xuất
                    </Button>
                ) : (
                    <Button variant="outline" disabled>
                        Đăng nhập
                    </Button>
                )}
            </div>
        </header>
    )
}

export default Navbar