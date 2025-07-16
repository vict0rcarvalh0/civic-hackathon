"use client"

import { useState } from "react"
import {
  Wallet as WalletIcon,
  Shield,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import WalletActions from "@/components/wallet-actions"
import { useSearchParams } from "next/navigation"
import { SELECTED_CHAIN_KEY } from "@/lib/utils"
import CopyButton from "@/components/copy-button"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import { useWalletTransactions } from "@/hooks/use-wallet-transactions"

export default function WalletPage() {
  const [balanceVisible, setBalanceVisible] = useState(true)

  /* ---------- Determine selected chain ---------- */
  const searchParams = useSearchParams()
  const selectedChain =
    searchParams.get("chain") ??
    (typeof window !== "undefined"
      ? localStorage.getItem(SELECTED_CHAIN_KEY)
      : null)

  const { address, balances, totalUsd } = useWalletBalances(selectedChain)
  const { transactions, loading: loadingTx } = useWalletTransactions(
    selectedChain,
  )

  const formattedTotal =
    totalUsd > 0
      ? `$${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "—"

  return (
    <div className="min-h-screen bg-black pt-20 pb-8 relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-pink-500/12 to-blue-500/12 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-32 w-32 h-32 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        <div className="absolute top-60 left-1/3 w-28 h-28 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-32 right-1/4 w-18 h-18 bg-gradient-to-r from-pink-500/14 to-purple-500/12 rounded-full blur-lg animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
            <p className="text-xl text-gray-400">
              Live on‑chain balances and activity
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <WalletIcon className="w-6 h-6 mr-3 text-purple-400" />
                    Your Wallet
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      onClick={() => setBalanceVisible(!balanceVisible)}
                    >
                      {balanceVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Portfolio Value</p>
                      <p className="text-3xl font-bold text-white">
                        {balanceVisible ? formattedTotal : "••••••"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Address</p>
                      <p
                        className="font-mono text-sm truncate text-gray-300"
                        title={address || "No address"}
                      >
                        {address
                          ? `${address.slice(0, 6)}...${address.slice(-4)}`
                          : "—"}
                      </p>
                      {address && (
                        <CopyButton
                          value={address}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 mt-2"
                          toastTitle="Address Copied"
                          toastDescription={address}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </CopyButton>
                      )}
                    </div>
                  </div>
                </div>

                {/* Token balances */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Token Balances</h4>
                  {(!address || balances.length === 0) && (
                    <p className="text-gray-400 text-sm">
                      {address
                        ? "No token balances found"
                        : "Connecting to your wallet…"}
                    </p>
                  )}
                  {balances.map((b) => (
                    <div
                      key={b.symbol}
                      className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/5"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {b.symbol[0]}
                          </span>
                        </div>
                        <span className="font-medium text-white">
                          {b.symbol}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">
                          {balanceVisible ? b.formatted : "••••••"}
                        </p>
                        {b.valueUsd !== undefined && (
                          <p className="text-sm text-gray-400">
                            {balanceVisible
                              ? `$${b.valueUsd.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })}`
                              : "••••••"}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTx ? (
                  <p className="text-center py-8 text-gray-400">
                    Loading transactions…
                  </p>
                ) : transactions.length === 0 ? (
                  <p className="text-center py-8 text-gray-400">
                    No transactions found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.hash}
                        className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/5 font-mono text-xs truncate"
                      >
                        <span className="truncate text-gray-300">
                          {tx.hash.slice(0, 12)}…
                        </span>
                        <span className="text-white">
                          {tx.amount} {tx.token}
                        </span>
                        <span className="text-right text-gray-400">{tx.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions & Security */}
          <div className="space-y-6">
            <WalletActions
              walletAddress={address || ""}
              transactions={transactions}
            />

            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Civic Verification
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}