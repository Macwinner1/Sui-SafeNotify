import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.tsx'
import LoginRegister from './pages/LoginRegister'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import Labels from './pages/Labels'
import Report from './pages/Report'
import Wallet from './pages/Wallet'

export default function App() {
    const { isAuthenticated } = useAuth()

    return (
        <Routes>
            <Route path="/" element={<LoginRegister />} />
            {isAuthenticated ? (
                <>
                    <Route path="/" element={<Home />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/labels" element={<Labels />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/wallet" element={<Wallet />} />
                </>
            ) : (
                <Route path="*" element={<Navigate to="/login" />} />
            )}
        </Routes>
    )
}
