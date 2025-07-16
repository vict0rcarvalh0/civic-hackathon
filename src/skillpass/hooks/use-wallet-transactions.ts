"use client"

import { useAccount } from "wagmi"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useEffect, useState } from "react"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { loadSelectedChain } from "@/lib/utils"

export interface WalletTransaction {
  hash: string
  amount: string
  token: string
  timestamp: string
}

const ETHERSCAN_API =
  "https://api.etherscan.io/api?module=account&action=txlist&sort=desc"

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleString()
}

async function fetchEvmTxs(address: string, apiKey?: string) {
  const url = `${ETHERSCAN_API}&address=${address}${
    apiKey ? `&apikey=${apiKey}` : ""
  }`
  const res = await fetch(url)
  const json = await res.json()
  if (json.status !== "1") return []
  return (json.result as any[]).slice(0, 10).map((tx) => ({
    hash: tx.hash,
    amount: (Number(tx.value) / 1e18).toFixed(6),
    token: "ETH",
    timestamp: formatDate(Number(tx.timeStamp)),
  })) as WalletTransaction[]
}

async function fetchSolTxs(
  connection: import("@solana/web3.js").Connection,
  address: string,
) {
  const pubkey = new PublicKey(address)
  const signatures = await connection.getSignaturesForAddress(pubkey, {
    limit: 10,
  })
  return signatures.map((sig) => ({
    hash: sig.signature,
    amount: "-",
    token: "SOL",
    timestamp: sig.blockTime ? formatDate(sig.blockTime) : "",
  })) as WalletTransaction[]
}

/**
 * Return recent transactions for the active wallet (Ethereum or Solana).
 */
export function useWalletTransactions(selectedChain?: string | null) {
  const effectiveChain = selectedChain ?? loadSelectedChain()
  const isSolana = effectiveChain === "solana"

  const { address: evmAccountAddr } = useAccount()
  const { connection } = useConnection()

  const userContext = useUser()

  const evmCivicAddr =
    !isSolana && userHasWallet(userContext)
      ? (userContext as any).ethereum?.address
      : undefined
  const evmAddress = (evmAccountAddr || evmCivicAddr) as string | undefined

  const solAddress =
    isSolana && userHasWallet(userContext)
      ? userContext.solana?.address
      : undefined

  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        if (isSolana) {
          if (solAddress) {
            const txs = await fetchSolTxs(connection, solAddress)
            setTransactions(txs)
          } else {
            setTransactions([])
          }
        } else {
          if (evmAddress) {
            const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
            const txs = await fetchEvmTxs(evmAddress, apiKey)
            setTransactions(txs)
          } else {
            setTransactions([])
          }
        }
      } catch {
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isSolana, solAddress, evmAddress, connection])

  return { transactions, loading }
}