import { useState } from 'react';
import { submitReport } from '../api/mockSuiApi';

function Report() {
    const [form, setForm] = useState<{ address: string; type: "token" | "wallet" | "contract"; reason: string }>({ address: '', type: 'token', reason: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitReport({ ...form, riskScore: 50}); // Default risk score
            setStatus('Report submitted!');
            setForm({ address: '', type: 'token', reason: '' });
        } catch {
            setStatus('Error submitting report.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Report a Scam</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block mb-1">Address/Object ID</label>
                    <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="0x..."
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Type</label>
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="token">Token</option>
                        <option value="wallet">Wallet</option>
                        <option value="contract">Contract</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Reason</label>
                    <textarea
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Describe the scam (e.g., fake airdrop)"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Submit Report
                </button>
                {status && <p className="mt-2 text-green-600">{status}</p>}
            </form>
        </div>
    );
}

export default Report;