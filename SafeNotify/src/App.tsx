import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext.tsx'
import LoginRegister from './pages/LoginRegister'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import Labels from './pages/Labels'
import Report from './pages/Report'
import Wallet from './pages/Wallet'
import Navbar from './components/Navbar'

function ProtectedLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default function App() {
    const { isAuthenticated } = useAuth()

    return (
        <Routes>
            {/* Public route */}
            <Route
                path="/"
                element={
                    isAuthenticated ? <Navigate to="/home" /> : <LoginRegister />
                }
            />

            {/* Protected routes */}
            {isAuthenticated && (
                <Route element={<ProtectedLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/labels" element={<Labels />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/wallet" element={<Wallet />} />
                </Route>
            )}

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}
