
import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

type MainLayoutProps = {
    children: ReactNode
    isAuthenticated: boolean
    onLogout: () => void
}

function MainLayout({ children, isAuthenticated, onLogout }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />

            <main className="mx-auto flex min-h-[calc(100vh-56px-73px)] max-w-5xl items-center justify-center p-4">
                {children}
            </main>

            <Footer />
        </div>
    )
}

export default MainLayout