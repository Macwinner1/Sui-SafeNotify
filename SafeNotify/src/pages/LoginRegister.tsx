import { ConnectButton } from '@mysten/dapp-kit'
import { useNavigate } from 'react-router-dom'
import { FaWallet } from 'react-icons/fa'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext.tsx'

export default function LoginRegister() {
    const navigate = useNavigate()
    const { loginWithGoogle } = useAuth()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h2 className="text-2xl font-bold mb-6">Sign in to <span className="text-blue-500">SafeNotify</span></h2>

            <GoogleLogin
                onSuccess={(res) => {
                    if (res.credential) {
                        loginWithGoogle(res.credential)
                        navigate('/home')
                    }
                }}
                onError={() => console.log('Google login failed')}
            />

            <div className="mt-6 flex items-center gap-2 p-2 border rounded cursor-pointer bg-white hover:shadow">
                <FaWallet size={20} color="#121111" />
                <ConnectButton />
            </div>
        </div>
    )
}
