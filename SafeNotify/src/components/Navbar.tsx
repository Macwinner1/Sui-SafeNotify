import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">SafeNotify</h1>
                <div className="space-x-4">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'underline' : '')}>
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
                </div>
            </div>
        </nav>
    );
}

export default Navbar;