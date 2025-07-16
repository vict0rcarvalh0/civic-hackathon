import { NextResponse } from "next/server"
import { addEndorsement } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: skillId } = await params
  const endorserId = req.headers.get("x-user-id")
  
  if (!endorserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const body = await req.json()
  const stakeAmount = Number(body?.stakeAmount)
  const stakeCurrency = body?.stakeCurrency || "ETH"
  const transactionHash = body?.transactionHash || ""
  const endorserAddress = body?.endorserAddress || ""
  
  if (!stakeAmount || stakeAmount <= 0) {
    return NextResponse.json({ error: "Invalid stake amount" }, { status: 400 })
  }
  
  if (!transactionHash) {
    return NextResponse.json({ error: "Transaction hash is required" }, { status: 400 })
  }
  
  if (!endorserAddress) {
    return NextResponse.json({ error: "Endorser address is required" }, { status: 400 })
  }

  const endorsement = await addEndorsement(skillId, endorserId, {
    endorserAddress,
    endorserName: body?.endorserName,
    stakeAmount,
    stakeCurrency,
    transactionHash,
    message: body?.message,
  })
  
  if (!endorsement) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 })
  }

  return NextResponse.json({ endorsement }, { status: 201 })
}