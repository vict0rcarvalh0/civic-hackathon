"use client"

import { useRef, useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Download,
  QrCode,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { decodeQrFromImage, exportCsv } from "@/lib/utils"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "@/hooks/use-toast"
import CopyButton from "@/components/copy-button"

interface TxRow {
  hash: string
  amount: string
  token: string
  timestamp: string
}

interface WalletActionsProps {
  walletAddress?: string
  transactions?: TxRow[]
}

export default function WalletActions({
  walletAddress = "",
  transactions = [],
}: WalletActionsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [showReceive, setShowReceive] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [sendToken, setSendToken] = useState("USDC")

  const handleImportQr = () => fileInputRef.current?.click()

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const decoded = await decodeQrFromImage(file)
    if (decoded) {
      const extracted = decoded.replace(/^.*:/, "")
      setSendAddress(extracted)
      toast({
        title: "Address imported",
        description: extracted,
      })
    } else {
      toast({
        title: "QR code not recognized",
      })
    }
  }

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      toast({ title: "Address copied" })
    }
  }

  const handleExport = () => {
    const rows = [
      ["hash", "amount", "token", "timestamp"],
      ...transactions.map((t) => [t.hash, t.amount, t.token, t.timestamp]),
    ]
    exportCsv("transactions.csv", rows)
    toast({ title: "History exported" })
  }

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-white">Wallet Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Receive */}
        <Dialog open={showReceive} onOpenChange={setShowReceive}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Receive Crypto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-black/95 border-white/20 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-white">Your Deposit QR</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              {walletAddress ? (
                <>
                  <div className="p-4 bg-white rounded-xl">
                    <QRCodeSVG value={walletAddress} size={200} />
                  </div>
                  <p className="font-mono break-all text-sm text-gray-300">{walletAddress}</p>
                  <CopyButton
                    value={walletAddress}
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    suffix="Address"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Address
                  </CopyButton>
                </>
              ) : (
                <p className="text-sm text-gray-400">Wallet address unavailable</p>
              )}
            </div>
            <DialogFooter />
          </DialogContent>
        </Dialog>

        {/* Send */}
        <Dialog open={showSend} onOpenChange={setShowSend}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send Crypto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm bg-black/95 border-white/20 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-white">Send Crypto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="send-address" className="text-gray-300">Recipient Address</Label>
                <Input
                  id="send-address"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder="0x..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="send-amount" className="text-gray-300">Amount</Label>
                  <Input
                    id="send-amount"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="send-token" className="text-gray-300">Token</Label>
                  <Select value={sendToken} onValueChange={setSendToken}>
                    <SelectTrigger id="send-token" className="bg-white/5 border-white/10 text-white focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border-white/20 backdrop-blur-xl">
                      <SelectItem value="USDC" className="text-white hover:bg-white/10 focus:bg-white/10">USDC</SelectItem>
                      <SelectItem value="ETH" className="text-white hover:bg-white/10 focus:bg-white/10">ETH</SelectItem>
                      <SelectItem value="SOL" className="text-white hover:bg-white/10 focus:bg-white/10">SOL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
                hidden
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportQr}
                className="w-full bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Import QR
              </Button>
            </div>
            <DialogFooter>
              <Button
                disabled={!sendAddress || !sendAmount}
                onClick={() => {
                  toast({
                    title: "Transaction sent",
                    description: `${sendAmount} ${sendToken} to ${sendAddress}`,
                  })
                  setShowSend(false)
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Buy */}
        <Button
          variant="outline"
          className="w-full bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
          onClick={() => window.open("https://www.okx.com/buy-crypto", "_blank")}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Buy Crypto
        </Button>

        {/* Export */}
        <Button
          variant="outline"
          className="w-full bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </CardContent>
    </Card>
  )
}