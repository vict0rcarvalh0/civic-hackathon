"use client"

import { useAccount, useBalance } from "wagmi"
import { useEffect, useMemo, useState } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { loadSelectedChain } from "@/lib/utils"

export interface WalletBalance {
  symbol: string
  formatted: string
  valueUsd?: number
}

/* ---------- Helpers ---------- */

const COINGECKO_IDS: Record<string, string> = {
  ethereum: "ethereum",
  solana: "solana",
}

async function fetchUsdPrice(id: string): Promise<number | undefined> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
    )
    const json = await res.json()
    return json[id]?.usd
  } catch {
    return undefined
  }
}

/* ---------- Hook ---------- */

/**
 * Return real‑time wallet balances (native ETH or SOL).
 * If selectedChain is not supplied, the persisted selection is used.
 */
export function useWalletBalances(selectedChain?: string | null) {
  const effectiveChain = selectedChain ?? loadSelectedChain()
  const isSolana = effectiveChain === "solana"

  /* ----- Civic user context (for embedded wallet address) ----- */
  const userContext = useUser()
  const solAddressFromUser =
    isSolana && userHasWallet(userContext)
      ? userContext.solana?.address
      : undefined

  /* ----- Ethereum via wagmi or Civic embedded wallet ----- */
  const { address: evmAccountAddr } = useAccount()
  const evmCivicAddr =
    !isSolana && userHasWallet(userContext)
      ? (userContext as any).ethereum?.address
      : undefined
  const evmAddress = (evmAccountAddr || evmCivicAddr) as string | undefined

  const { data: evmBalance } = useBalance({
    address: evmAddress,
    unit: "ether",
    query: {
      enabled: !!evmAddress && !isSolana,
      refetchInterval: 30000,
    },
  })

  /* ----- Solana via RPC ----- */
  const { connection } = useConnection()
  const [solLamports, setSolLamports] = useState<bigint | null>(null)

  useEffect(() => {
    let cancelled = false
    async function poll() {
      if (!isSolana) {
        setSolLamports(null)
        return
      }
      const addr = solAddressFromUser
      if (!addr) {
        setSolLamports(null)
        return
      }
      try {
        const lamports = await connection.getBalance(
          new PublicKey(addr),
          { commitment: "confirmed" },
        )
        if (!cancelled) setSolLamports(BigInt(lamports))
      } catch {
        if (!cancelled) setSolLamports(null)
      }
    }
    poll()
    const id = setInterval(poll, 30000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [connection, solAddressFromUser, isSolana])

  /* ----- USD prices ----- */
  const [ethUsd, setEthUsd] = useState<number | undefined>()
  const [solUsd, setSolUsd] = useState<number | undefined>()

  useEffect(() => {
    if (!isSolana && evmBalance && ethUsd === undefined) {
      fetchUsdPrice(COINGECKO_IDS.ethereum).then(setEthUsd)
    }
  }, [evmBalance, ethUsd, isSolana])

  useEffect(() => {
    if (isSolana && solAddressFromUser && solUsd === undefined) {
      fetchUsdPrice(COINGECKO_IDS.solana).then(setSolUsd)
    }
  }, [solAddressFromUser, solUsd, isSolana])

  /* ----- Assemble result ----- */
  const balances = useMemo<WalletBalance[]>(() => {
    const list: WalletBalance[] = []
    if (isSolana) {
      if (solAddressFromUser && solLamports !== null) {
        const sol = Number(solLamports) / 1_000_000_000
        list.push({
          symbol: "SOL",
          formatted: sol.toLocaleString(undefined, {
            maximumFractionDigits: 6,
          }),
          valueUsd: solUsd !== undefined ? sol * solUsd : undefined,
        })
      }
    } else {
      if (evmBalance) {
        list.push({
          symbol: evmBalance.symbol,
          formatted: evmBalance.formatted,
          valueUsd:
            ethUsd !== undefined
              ? Number(evmBalance.formatted) * ethUsd
              : undefined,
        })
      }
    }
    return list
  }, [isSolana, solAddressFromUser, solLamports, solUsd, evmBalance, ethUsd])

  const totalUsd = balances.reduce((s, b) => s + (b.valueUsd || 0), 0)

  const address = isSolana ? solAddressFromUser : evmAddress

  return {
    address,
    balances,
    totalUsd,
  }
}