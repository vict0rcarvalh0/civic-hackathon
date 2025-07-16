import { NextResponse } from "next/server"
import { saveWalletForUser } from "@/lib/wallets"

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  if (!body?.address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 })
  }
  await saveWalletForUser(userId, body.address, body.chain || "solana")
  return NextResponse.json({ success: true })
}