export interface ScamReport {
    id: string;
    address: string;
    type: 'token' | 'wallet' | 'contract';
    reason: string;
    riskScore: number;
    reports: number;
}

export interface Label {
    address: string;
    name: string;
    votes: number;
}

export interface Alert {
    id: string;
    message: string;
    timestamp: string;
}

export const mockScams: ScamReport[] = [
    { id: '1', address: '0xabc123', type: 'token', reason: 'Fake airdrop NFT', riskScore: 85, reports: 15 },
    { id: '2', address: '0xdef456', type: 'contract', reason: 'Drainer contract', riskScore: 92, reports: 8 },
];

export const mockLabels: Label[] = [
    { address: '0xabc123', name: 'Fake $SUI Claimer', votes: 12 },
    { address: '0xdef456', name: 'Phishing Contract', votes: 9 },
];

export const mockAlerts: Alert[] = [
    { id: '1', message: 'Unsolicited NFT detected in wallet: 0xabc123', timestamp: '2025-09-24 06:30 AM' },
];

export const connectWallet = async () => {
    return { address: '0xuser789', balance: 10.5 }; // Mock wallet data
};

export const submitReport = async (report: Omit<ScamReport, 'id' | 'reports'>) => {
    return { ...report, id: 'mock' + Date.now(), reports: 1 }; // Mock submission
};

export const submitLabel = async (label: Omit<Label, 'votes'>) => {
    return { ...label, votes: 1 }; // Mock label submission
};