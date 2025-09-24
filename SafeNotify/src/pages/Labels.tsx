import { useState } from 'react';
import { submitLabel, mockLabels } from '../api/mockSuiApi';

function Labels() {
    const [form, setForm] = useState({ address: '', name: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitLabel(form);
            setStatus('Label submitted!');
            setForm({ address: '', name: '' });
        } catch {
            setStatus('Error submitting label.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Community Labels</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-4">
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
                    <label className="block mb-1">Suggested Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., Fake $SUI Claimer"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Submit Label
                </button>
                {status && <p className="mt-2 text-green-600">{status}</p>}
            </form>
            <h2 className="text-xl font-semibold mb-2">Existing Labels</h2>
            <div className="space-y-4">
                {mockLabels.map((label) => (
                    <div key={label.address} className="bg-white p-4 rounded-lg shadow-md">
                        <p><strong>Address:</strong> {label.address}</p>
                        <p><strong>Name:</strong> {label.name}</p>
                        <p><strong>Votes:</strong> {label.votes}</p>
                        <button className="mt-2 bg-green-500 text-white px-2 py-1 rounded">
                            Upvote
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Labels;