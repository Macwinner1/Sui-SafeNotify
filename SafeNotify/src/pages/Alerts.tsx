import { mockAlerts } from '../api/mockSuiApi';

function Alerts() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">SafeNotify</h1>
            <div className="space-y-4">
                {mockAlerts.map((alert) => (
                    <div key={alert.id} className="bg-red-100 p-4 rounded-lg shadow-md">
                        <p className="font-semibold">{alert.message}</p>
                        <p className="text-sm text-gray-600">{alert.timestamp}</p>
                    </div>
                ))}
                {mockAlerts.length === 0 && <p>No alerts at this time.</p>}
            </div>
        </div>
    );
}

export default Alerts;