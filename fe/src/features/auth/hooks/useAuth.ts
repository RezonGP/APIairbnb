import { useState } from 'react'

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('token')
    )

    const handleLoginSuccess = () => {
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
    }

    return {
        isAuthenticated,
        handleLoginSuccess,
        handleLogout,
    }
}

export default useAuth