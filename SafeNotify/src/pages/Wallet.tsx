import { useEffect, useState } from 'react';
import { connectWallet } from '../api/mockSuiApi';

function Wallet() {
    const [wallet, setWallet] = useState<{ address: string; balance: number } | null>(null);

    useEffect(() => {
        connectWallet().then(setWallet);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Wallet</h1>
            {wallet ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p><strong>Address:</strong> {wallet.address}</p>
                    <p><strong>Balance:</strong> {wallet.balance} SUI</p>
                    <p className="mt-2">Recent Activity: <span className="text-gray-600">No recent transactions</span></p>
                </div>
            ) : (
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => connectWallet().then(setWallet)}
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}

export default Wallet;