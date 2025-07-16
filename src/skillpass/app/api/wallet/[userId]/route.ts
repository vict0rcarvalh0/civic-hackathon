import { NextResponse } from "next/server"
import { getWalletByUser } from "@/lib/wallets"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params
  const url = new URL(req.url)
  const chain = url.searchParams.get("chain") || "solana"
  const address = await getWalletByUser(userId, chain)

  if (!address) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ address })
}