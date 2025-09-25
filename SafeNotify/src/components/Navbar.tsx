import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">SafeNotify</h1>
                <div className="space-x-6 flex items-center">
                    <NavLink to="/home" className={({ isActive }) => (isActive ? 'underline' : '')}>
                        Home
                    </NavLink>
                    <NavLink to="/report" className={({ isActive }) => (isActive ? 'underline' : '')}>
                        Report Scam
                    </NavLink>
                    <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'underline' : '')}>
                        Alerts
                    </NavLink>
                    <NavLink to="/labels" className={({ isActive }) => (isActive ? 'underline' : '')}>
                        Labels
                    </NavLink>
                    <NavLink to="/wallet" className={({ isActive }) => (isActive ? 'underline' : '')}>
                        Wallet
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
