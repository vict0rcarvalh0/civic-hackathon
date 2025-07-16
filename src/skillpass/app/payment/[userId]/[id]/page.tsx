import { getLink } from "@/lib/db"
import { notFound } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CopyButton from "@/components/copy-button"
import QrCodeButton from "@/components/qr-code-button"
import { Copy, QrCode, Lock } from "lucide-react"
import SupportCreatorButton from "@/components/support-creator-button"
import Link from "next/link"
import { BASE_URL, ensureHttp } from "@/lib/utils"

export default async function PaymentLinkPage({
  params: paramsPromise,
}: {
  params: Promise<{ userId: string; id: string }>
}) {
  const { userId, id } = await paramsPromise

  const link = await getLink(userId, id)
  if (!link) notFound()

  const linkUrl = ensureHttp(link.url)
  const paused = link.status !== "Active"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {link.name}
          </CardTitle>
          <p className="text-gray-700 text-lg">{link.description}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {paused ? (
            <div className="flex flex-col items-center space-y-4">
              <Lock className="w-12 h-12 text-yellow-600" />
              <p className="text-xl font-semibold text-yellow-700">
                This link is currently paused
              </p>
              <p className="text-gray-600 text-center max-w-sm">
                The creator has temporarily disabled support for this page.
                Please check back later.
              </p>
            </div>
          ) : (
            <>
              {link.amount && (
                <div className="text-center">
                  <p className="uppercase text-sm text-gray-600 tracking-wide">
                    Support Amount
                  </p>
                  <p className="text-5xl font-extrabold text-gray-900">
                    {link.amount}&nbsp;{link.currency || "USDC"}
                  </p>
                </div>
              )}

              <SupportCreatorButton
                linkId={link.id}
                creatorId={link.userId}
                amount={link.amount}
                currency={link.currency}
              />
            </>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <CopyButton
              value={linkUrl}
              variant="outline"
              className="w-full justify-center bg-white/30 border-white/50"
              suffix="Link"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy&nbsp;Link
            </CopyButton>
            <QrCodeButton
              value={linkUrl}
              variant="outline"
              className="w-full justify-center bg-white/30 border-white/50"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Show&nbsp;QR
            </QrCodeButton>
          </div>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>
              Secure payments powered by <span className="font-semibold">Authora</span> • Civic&nbsp;Auth&nbsp;Wallets
            </p>
            <Link href={BASE_URL} className="text-purple-600 hover:underline">
              Learn more
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}