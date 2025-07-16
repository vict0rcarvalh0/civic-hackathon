import { NextResponse } from "next/server"
import { getSkill, updateSkill, deleteSkill } from "@/lib/db"

/* ---------- GET ---------- */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = req.headers.get("x-user-id")
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const skill = await getSkill(userId, id)
  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ skill })
}

/* ---------- PUT ---------- */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = req.headers.get("x-user-id")
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  
  // Validate level if provided
  if (body.level) {
    const validLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]
    if (!validLevels.includes(body.level)) {
      return NextResponse.json({ error: "Invalid level. Must be one of: " + validLevels.join(", ") }, { status: 400 })
    }
  }
  
  const updated = await updateSkill(userId, id, body)
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ skill: updated })
}

/* ---------- DELETE ---------- */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = req.headers.get("x-user-id")
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ok = await deleteSkill(userId, id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}