import {type ScamReport} from '../api/mockSuiApi';

interface ScamCardProps {
    scam: ScamReport;
}

function ScamCard({ scam }: ScamCardProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold">{scam.address}</h3>
            <p>Type: {scam.type}</p>
            <p>Reason: {scam.reason}</p>
            <p>Risk Score: {scam.riskScore}%</p>
            <p>Reports: {scam.reports}</p>
        </div>
    );
}

export default ScamCard;