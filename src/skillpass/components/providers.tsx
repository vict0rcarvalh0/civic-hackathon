'use client'

import { ReactNode, useMemo, useEffect, useRef } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, useAccount, useConnect } from "wagmi"
import { embeddedWallet } from "@civic/auth-web3/wagmi"
import { http } from "viem"
import { mainnet } from "viem/chains"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { CivicAuthProvider, useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

/* ---------- RPC Endpoints ---------- */
const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ||
  "https://api.mainnet-beta.solana.com"

const ETHEREUM_RPC =
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_ENDPOINT ||
  "https://eth.llamarpc.com"

/* ---------- Wagmi ---------- */
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(ETHEREUM_RPC),
  },
  connectors: [embeddedWallet()],
})

/* ---------- Auto‑connect helper ---------- */
function AutoConnect() {
  const userContext = useUser()
  const { connectors, connect } = useConnect()
  const { isConnected } = useAccount()

  /* Create wallet if missing */
  useEffect(() => {
    if (!userContext.user) return
    if (!userHasWallet(userContext) && !(userContext as any).walletCreationInProgress) {
      userContext.createWallet().catch((err: unknown) =>
        console.error("Failed to create Civic wallet", err),
      )
    }
  }, [userContext])

  /* Connect EVM wallet once created */
  useEffect(() => {
    if (!userContext.user || !userHasWallet(userContext) || isConnected) return
    const civic = connectors.find((c) => c.id === "civic" || c.name === "Civic")
    if (civic) {
      connect({ connector: civic })
    }
  }, [userContext, connectors, connect, isConnected])

  /* Register wallet addresses (debounced) */
  const { address: evmAddress } = useAccount()
  const lastRegistered = useRef<{ solana?: string; ethereum?: string }>({})

  useEffect(() => {
    if (!userContext.user || !userHasWallet(userContext)) return

    const headers = {
      "Content-Type": "application/json",
      "x-user-id": userContext.user.id || userContext.user.email || "",
    }

    // Solana
    const solAddr = userContext.solana?.address
    if (solAddr && lastRegistered.current.solana !== solAddr) {
      lastRegistered.current.solana = solAddr
      fetch("/api/wallet/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ address: solAddr, chain: "solana" }),
      }).catch(() => {})
    }

    // Ethereum
    if (evmAddress && lastRegistered.current.ethereum !== evmAddress) {
      lastRegistered.current.ethereum = evmAddress
      fetch("/api/wallet/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ address: evmAddress, chain: "ethereum" }),
      }).catch(() => {})
    }
  }, [userContext, evmAddress])

  return null
}

/* ---------- Redirect helper ---------- */
function useRedirectUrl() {
  return useMemo(() => {
    if (process.env.NEXT_PUBLIC_CIVIC_AUTH_REDIRECT_URI) {
      return process.env.NEXT_PUBLIC_CIVIC_AUTH_REDIRECT_URI
    }
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return undefined
  }, [])
}

export default function Providers({ children }: { children: ReactNode }) {
  const redirectUrl = useRedirectUrl()
  const CIVIC_CLIENT_ID = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID || ""

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectionProvider endpoint={SOLANA_RPC}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <CivicAuthProvider
                clientId={CIVIC_CLIENT_ID}
                initialChain={mainnet}
                redirectUrl={redirectUrl}
                chains={[mainnet]}
              >
                <AutoConnect />
                {children}
                <Toaster richColors position="top-right" />
              </CivicAuthProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}