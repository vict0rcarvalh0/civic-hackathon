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
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Wallet</h1>
            <p className="text-xl text-gray-600">
              Live on‑chain balances and activity
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <WalletIcon className="w-6 h-6 mr-3 text-purple-600" />
                    Your Wallet
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200"
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
                      className="border-gray-200"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Portfolio Value</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {balanceVisible ? formattedTotal : "••••••"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Address</p>
                      <p
                        className="font-mono text-sm truncate"
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
                          className="bg-white/50 border-white/30 mt-2"
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
                  <h4 className="font-semibold text-gray-900">Token Balances</h4>
                  {(!address || balances.length === 0) && (
                    <p className="text-gray-600 text-sm">
                      {address
                        ? "No token balances found"
                        : "Connecting to your wallet…"}
                    </p>
                  )}
                  {balances.map((b) => (
                    <div
                      key={b.symbol}
                      className="flex items-center justify-between p-4 bg-white/30 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {b.symbol[0]}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {b.symbol}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {balanceVisible ? b.formatted : "••••••"}
                        </p>
                        {b.valueUsd !== undefined && (
                          <p className="text-sm text-gray-600">
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
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTx ? (
                  <p className="text-center py-8 text-gray-600">
                    Loading transactions…
                  </p>
                ) : transactions.length === 0 ? (
                  <p className="text-center py-8 text-gray-600">
                    No transactions found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.hash}
                        className="flex items-center justify-between p-3 bg-white/20 rounded-lg font-mono text-xs truncate"
                      >
                        <span className="truncate">
                          {tx.hash.slice(0, 12)}…
                        </span>
                        <span>
                          {tx.amount} {tx.token}
                        </span>
                        <span className="text-right">{tx.timestamp}</span>
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

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Civic Verification
                  </span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
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