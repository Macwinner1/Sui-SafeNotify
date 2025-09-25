import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connectWallet, mockScams } from '../api/mockSuiApi';
import ScamCard from '../components/ScamCard';

function Home() {
    const [wallet, setWallet] = useState<{ address: string; balance: number } | null>(null);

    useEffect(() => {
        connectWallet().then(setWallet);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-black">Dashboard</h1>
            <div className="mb-4">
                {wallet ? (
                    <p>Connected: {wallet.address} (Balance: {wallet.balance} SUI)</p>
                ) : (
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => connectWallet().then(setWallet)}
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Link to="/report" className="bg-green-500 text-white p-4 rounded text-center">
                    Report a Scam
                </Link>
                <Link to="/alerts" className="bg-red-500 text-white p-4 rounded text-center">
                    View Alerts
                </Link>
            </div>
            <h2 className="text-xl font-semibold mb-2">Recent Scams</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockScams.map((scam) => (
                    <ScamCard key={scam.id} scam={scam} />
                ))}
            </div>
        </div>
    );
}

export default Home;