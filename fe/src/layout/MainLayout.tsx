
import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

type MainLayoutProps = {
    children: ReactNode
    isAuthenticated: boolean
    isAdmin: boolean
    onLogout: () => void
}

function MainLayout({ children, isAuthenticated, isAdmin, onLogout }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={onLogout} />

            <main className="mx-auto w-full max-w-6xl p-4 md:p-6">
                {children}
            </main>

            <Footer />
        </div>
    )
}

export default MainLayout
