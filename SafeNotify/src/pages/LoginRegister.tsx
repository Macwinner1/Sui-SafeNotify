import { ConnectButton } from '@mysten/dapp-kit'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext.tsx'

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'

export default function LoginRegister() {
    const navigate = useNavigate()
    const { loginWithGoogle } = useAuth()

    const handleGoogleSuccess = () => {
        loginWithGoogle()
        navigate('/')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h2 className="text-2xl font-bold mb-6">Sign in to SafeNotify</h2>

            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Google login failed')}
                />
            </GoogleOAuthProvider>

            <div className="mt-6">
                <ConnectButton />
            </div>
        </div>
    )
}
