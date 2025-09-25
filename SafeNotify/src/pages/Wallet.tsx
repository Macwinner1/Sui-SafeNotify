import { useAuth } from '../context/AuthContext'

function Wallet() {
    const { walletAddress } = useAuth()

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Wallet</h1>
            {walletAddress ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p><strong>Address:</strong> {walletAddress}</p>
                    <p><strong>Balance:</strong> Coming soon via Sui API</p>
                    <p className="mt-2">Recent Activity: <span className="text-gray-600">No recent transactions</span></p>
                </div>
            ) : (
                <p className="text-gray-600">No wallet connected</p>
            )}
        </div>
    )
}

export default Wallet
