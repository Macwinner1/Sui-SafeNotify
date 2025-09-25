import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { AuthProvider } from './context/AuthContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()
const { networkConfig } = createNetworkConfig({
    mainnet: { url: getFullnodeUrl('mainnet') },
})

const GOOGLE_CLIENT_ID = "123498339371-nomge70ajtgj49h6f0qpq062or1o7upa.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
        </GoogleOAuthProvider>
    </React.StrictMode>
)
