import { createContext, useContext, useState, useEffect } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'

interface AuthContextType {
    isAuthenticated: boolean
    loginWithGoogle: () => void
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loginWithGoogle: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const account = useCurrentAccount()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (account?.address) {
            setIsAuthenticated(true)
        }
    }, [account])

    const loginWithGoogle = () => {
        setIsAuthenticated(true)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
