"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Copy,
  Download,
  Eye,
  QrCode,
  Settings,
  Share,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import CopyButton from "@/components/copy-button"
import QrCodeButton from "@/components/qr-code-button"
import EarningsChart from "@/components/charts/EarningsChart"
import { buildAuthHeaders, ensureHttp } from "@/lib/utils"
import type { Link as LinkType } from "@/lib/db"
import { useUser } from "@civic/auth-web3/react"

export default function LinkEditPage() {
  const { user } = useUser()
  const params = useParams()
  const router = useRouter()
  const linkId = params.id as string

  /* ---------- Local state ---------- */
  const [link, setLink] = useState<LinkType | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  /* ---------- Editable fields ---------- */
  const [isActive, setIsActive] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USDC")

  /* ---------- Fetch link ---------- */
  useEffect(() => {
    async function load() {
      if (!user) return
      const res = await fetch(`/api/links/${linkId}`, {
        headers: buildAuthHeaders(user),
      })
      if (res.ok) {
        const { link } = await res.json()
        setLink(link)
        setName(link.name)
        setDescription(link.description)
        setAmount(link.amount?.toString() || "")
        setCurrency(link.currency || "USDC")
        setIsActive(link.status === "Active")
      } else {
        toast({ title: "Link not found" })
        router.replace("/dashboard/links")
      }
    }
    load()
  }, [user, linkId, router])

  const linkUrl = useMemo(() => (link ? ensureHttp(link.url) : ""), [link])

  /* ---------- Handlers ---------- */
  const handleSave = async () => {
    if (!user || !link) return
    setSaving(true)
    const res = await fetch(`/api/links/${link.id}`, {
      method: "PUT",
      headers: buildAuthHeaders(user),
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        amount: amount ? Number(amount) : undefined,
        currency: currency.trim() || "USDC",
        status: isActive ? "Active" : "Paused",
      }),
    })
    setSaving(false)
    if (res.ok) {
      const { link: updated } = await res.json()
      setLink(updated)
      toast({ title: "Changes saved" })
    } else {
      const err = await res.json()
      toast({ title: "Error", description: err.error || "Unable to save" })
    }
  }

  const handleDelete = async () => {
    if (!user || !link) return
    if (!confirm("Delete this payment link? This cannot be undone.")) return
    setDeleting(true)
    const res = await fetch(`/api/links/${link.id}`, {
      method: "DELETE",
      headers: buildAuthHeaders(user),
    })
    setDeleting(false)
    if (res.ok) {
      toast({ title: "Link deleted" })
      router.replace("/dashboard/links")
    } else {
      toast({ title: "Error deleting link" })
    }
  }

  /* ---------- Derived stats ---------- */
  const chartData = useMemo(
    () => [
      { label: "Earnings", value: link?.earnings || 0 },
      { label: "Transactions", value: link?.transactions || 0 },
    ],
    [link],
  )

  if (!link) {
    return (
      <div className="pt-20 pb-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading link…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/links")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Links
            </Button>
            <Badge
              className={
                link.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {link.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {link.name}
          </h1>
          <p className="text-gray-600 mt-2">{link.description}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Link Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment URL</Label>
                  <div className="flex gap-2">
                    <Input value={linkUrl} readOnly className="flex-1" />
                    <CopyButton
                      value={linkUrl}
                      size="sm"
                      variant="outline"
                      className="border-gray-200"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </CopyButton>
                    <QrCodeButton
                      value={linkUrl}
                      size="sm"
                      variant="outline"
                      className="border-gray-200"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR
                    </QrCodeButton>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={!linkUrl}
                    onClick={() => {
                      if (!linkUrl) return
                      if (navigator.share) {
                        navigator
                          .share({
                            url: linkUrl,
                            title: link?.name || "Payment Link",
                          })
                          .catch(() => {})
                      } else {
                        navigator.clipboard.writeText(linkUrl)
                        toast({ title: "Link copied" })
                      }
                    }}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    {linkUrl ? "Share Link" : "Loading…"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(linkUrl, "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.every((d) => d.value === 0) ? (
                  <p className="text-center py-16 text-gray-600">
                    No analytics available yet
                  </p>
                ) : (
                  <EarningsChart data={chartData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments (placeholder for future) */}
          <TabsContent value="payments">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="py-16 text-center text-gray-600">
                  Payment history coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Edit Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Link Status</Label>
                    <p className="text-sm text-gray-500">
                      Enable or pause this link
                    </p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>

                <div className="space-y-2">
                  <Label>Link Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (optional)</Label>
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    disabled={saving}
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {saving ? "Saving…" : <><Settings className="w-4 h-4 mr-2" />Save Changes</>}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={deleting}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    {deleting ? "Deleting…" : <><Trash2 className="w-4 h-4 mr-2" />Delete Link</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}