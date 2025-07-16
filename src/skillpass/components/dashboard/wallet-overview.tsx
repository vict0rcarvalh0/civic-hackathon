"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet as WalletIcon } from "lucide-react"
import { useWalletBalances } from "@/hooks/use-wallet-balances"

interface WalletOverviewProps {
  /** Render a trimmed view (no full token list) for dashboards */
  compact?: boolean
}

export default function WalletOverview({ compact = false }: WalletOverviewProps) {
  const { totalUsd, balances } = useWalletBalances()

  const formattedTotal =
    totalUsd > 0
      ? `$${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "—"

  const shown = compact ? balances.slice(0, 3) : balances

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <WalletIcon className="w-5 h-5 text-purple-600" />
          Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900">{formattedTotal}</p>
        </div>

        {shown.length > 0 && (
          <div className="space-y-1">
            {shown.map((b) => (
              <div key={b.symbol} className="flex justify-between text-sm">
                <span className="font-medium">{b.symbol}</span>
                <span>{b.formatted}</span>
              </div>
            ))}
            {compact && balances.length > 3 && (
              <p className="text-xs text-gray-500">
                {balances.length - 3}+ more tokens
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}