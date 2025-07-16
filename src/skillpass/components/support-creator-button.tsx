"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { loadSelectedChain } from "@/lib/utils"
import { useAccount, useWalletClient, usePublicClient } from "wagmi"
import { parseEther } from "viem"
import { sendTransactionWithFallback } from "@/lib/solana"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface SupportCreatorButtonProps {
  linkId: string
  creatorId: string
  amount?: number
  currency?: string
}

export default function SupportCreatorButton({
  linkId,
  creatorId,
  amount,
}: SupportCreatorButtonProps) {
  /* ---------- Chain state ---------- */
  // Always start with 'solana' to keep server and client HTML identical.
  const [selectedChain, setSelectedChain] = useState<"solana" | "ethereum">(
    "solana",
  )

  // After mount, sync with saved preference (client‑only).
  useEffect(() => {
    const stored = loadSelectedChain()
    if (stored === "solana" || stored === "ethereum") {
      setSelectedChain(stored)
    }
  }, [])

  // Listen for runtime chain changes.
  useEffect(() => {
    const onChain = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (detail === "solana" || detail === "ethereum") {
        setSelectedChain(detail)
      }
    }
    window.addEventListener("authora.chainChanged", onChain)
    window.addEventListener("storage", onChain)
    return () => {
      window.removeEventListener("authora.chainChanged", onChain)
      window.removeEventListener("storage", onChain)
    }
  }, [])

  const isSolana = selectedChain === "solana"
  const balanceSymbol = isSolana ? "SOL" : "ETH"

  /* ---------- Civic Auth ---------- */
  const userContext = useUser()
  const { user, signIn } = userContext

  /* ---------- Wallet balances ---------- */
  const { balances } = useWalletBalances(selectedChain)
  const balanceInfo = useMemo(
    () => balances.find((b) => b.symbol.toUpperCase() === balanceSymbol),
    [balances, balanceSymbol],
  )
  const availableNative = balanceInfo
    ? Number(balanceInfo.formatted.replace(/,/g, ""))
    : 0
  const formattedBalance = `${availableNative.toLocaleString(undefined, {
    maximumFractionDigits: 6,
  })} ${balanceSymbol}`

  /* ---------- Solana ---------- */
  const { connection } = useConnection()

  /* ---------- EVM ---------- */
  const { address: evmAddress } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  /* ---------- UI state ---------- */
  const [loading, setLoading] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  /* ---------- Helpers ---------- */
  async function recordPayment(
    amt: number,
    curr: string,
    txHash: string,
    viaFallback: boolean,
  ) {
    await fetch(`/api/links/${linkId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt, currency: curr, txHash }),
    })
    toast({
      title: "Thanks for your support!",
      description: `Tx ${txHash.slice(0, 10)}…${viaFallback ? " (fallback RPC)" : ""}`,
    })
  }

  /* ---------- Click handler ---------- */
  const handleClick = async () => {
    if (loading) return
    try {
      if (!user) await signIn()
      if (!userHasWallet(userContext)) await userContext.createWallet()

      /* Fetch creator address */
      setLoading(true)
      const res = await fetch(
        `/api/wallet/${creatorId}?chain=${isSolana ? "solana" : "ethereum"}`,
      )
      if (!res.ok) {
        toast({ title: "Creator wallet not found" })
        return
      }
      const { address: recipient } = await res.json()

      /* Determine amount */
      let amt = amount
      if (!amt) {
        const input = prompt(`Enter support amount (${balanceSymbol})`)
        if (!input) return
        amt = Number(input)
      }
      if (!amt || isNaN(amt) || amt <= 0) {
        toast({ title: "Invalid amount" })
        return
      }

      /* Balance check */
      if (availableNative < amt) {
        setErrorMessage(
          `You only have ${formattedBalance}. Please reduce the amount or fund your wallet first.`,
        )
        setErrorOpen(true)
        return
      }

      /* ---------- Solana transfer ---------- */
      if (isSolana) {
        const solCtx = (userContext as any).solana
        if (!solCtx?.wallet) {
          toast({ title: "Wallet unavailable" })
          return
        }
        const lamports = Math.round(amt * 1_000_000_000)
        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: solCtx.wallet.publicKey as PublicKey,
            toPubkey: new PublicKey(recipient),
            lamports,
          }),
        )
        const { signature, usedFallback } = await sendTransactionWithFallback(
          solCtx.wallet,
          tx,
          connection,
        )
        await recordPayment(amt, "SOL", signature, usedFallback)
      } else {
        /* ---------- EVM transfer ---------- */
        if (!publicClient || !walletClient || !evmAddress) {
          toast({ title: "Wallet not connected" })
          return
        }
        const txHash = await walletClient.sendTransaction({
          account: evmAddress,
          to: recipient,
          value: parseEther(amt.toString()),
        })
        await recordPayment(amt, "ETH", txHash, false)
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Payment failed" })
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Render ---------- */
  return (
    <>
      {/* Error dialog */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insufficient Balance</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">{errorMessage}</p>
          <DialogFooter>
            <Button onClick={() => setErrorOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        size="lg"
        disabled={loading}
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-transform hover:scale-105 text-lg"
      >
        {loading ? "Processing…" : "Support Creator"}
      </Button>
      <p className="text-center text-sm mt-2 text-gray-600">
        Your balance: {formattedBalance}
      </p>
    </>
  )
}