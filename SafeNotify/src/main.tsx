import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { AuthProvider } from './context/AuthContext.tsx'

const queryClient = new QueryClient()
const { networkConfig } = createNetworkConfig({
    mainnet: { url: getFullnodeUrl('mainnet') },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
                <WalletProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </AuthProvider>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
