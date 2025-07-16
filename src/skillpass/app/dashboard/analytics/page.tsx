"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import { buildAuthHeaders } from "@/lib/utils"
import EarningsChart from "@/components/charts/EarningsChart"
import { useUser } from "@civic/auth-web3/react"

export default function AnalyticsPage() {
  const { user } = useUser()
  const { totalUsd } = useWalletBalances()
  const [links, setLinks] = useState<{ id: string; name: string; earnings: number }[]>([])
  const [range, setRange] = useState("30days")

  /* ---------- Fetch user links ---------- */
  useEffect(() => {
    async function load() {
      if (!user) return
      const res = await fetch("/api/links", { headers: buildAuthHeaders(user) })
      const json = await res.json()
      setLinks(json.links || [])
    }
    load()
  }, [user])

  /* ---------- Aggregations ---------- */
  const totalEarnings = useMemo(
    () => links.reduce((s, l) => s + (l.earnings || 0), 0),
    [links],
  )

  const formattedEarnings = `$${totalEarnings.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`

  /* ---------- Chart data (earnings per link) ---------- */
  const chartData = useMemo(
    () =>
      links.map((l) => ({
        label: l.name.length > 12 ? `${l.name.slice(0, 12)}…` : l.name,
        value: l.earnings || 0,
      })),
    [links],
  )

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40 bg-white/50 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* High‑level stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formattedEarnings}
              </h3>
              <p className="text-gray-600 text-sm">Total Link Earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {totalUsd > 0
                  ? `$${totalUsd.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`
                  : "—"}
              </h3>
              <p className="text-gray-600 text-sm">Portfolio Value</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings overview chart */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
              Earnings Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-center py-16 text-gray-600">No earnings yet</p>
            ) : (
              <EarningsChart data={chartData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}