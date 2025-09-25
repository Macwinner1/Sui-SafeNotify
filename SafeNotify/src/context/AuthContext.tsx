import { createContext, useContext, useState, useEffect } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'

interface AuthContextType {
    isAuthenticated: boolean
    googleToken: string | null
    walletAddress: string | null
    loginWithGoogle: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    googleToken: null,
    walletAddress: null,
    loginWithGoogle: () => {},
    logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const account = useCurrentAccount()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [googleToken, setGoogleToken] = useState<string | null>(null)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('google_token')
        const storedWallet = localStorage.getItem('wallet_address')

        if (storedToken) {
            setGoogleToken(storedToken)
            setIsAuthenticated(true)
        }

        if (storedWallet) {
            setWalletAddress(storedWallet)
        }
    }, [])

    useEffect(() => {
        if (account?.address) {
            setWalletAddress(account.address)
            localStorage.setItem('wallet_address', account.address)
            setIsAuthenticated(true)
        }
    }, [account])

    const loginWithGoogle = (token: string) => {
        setGoogleToken(token)
        localStorage.setItem('google_token', token)
        setIsAuthenticated(true)
    }

    const logout = () => {
        setGoogleToken(null)
        setWalletAddress(null)
        setIsAuthenticated(false)
        localStorage.removeItem('google_token')
        localStorage.removeItem('wallet_address')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, googleToken, walletAddress, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
