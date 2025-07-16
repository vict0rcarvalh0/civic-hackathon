import { NextResponse } from "next/server"
import { getLeaderboard } from "@/lib/db"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get("category")
  const limitParam = url.searchParams.get("limit")
  const limit = limitParam ? parseInt(limitParam, 10) : 10
  
  if (limit > 100) {
    return NextResponse.json({ error: "Limit cannot exceed 100" }, { status: 400 })
  }
  
  try {
    const leaderboard = await getLeaderboard(category || undefined, limit)
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 