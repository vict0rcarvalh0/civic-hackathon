import { NextResponse } from "next/server"
import { getSkillsByUser, addSkill } from "@/lib/db"

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const skills = await getSkillsByUser(userId)
  return NextResponse.json({ skills })
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  if (!body.name || !body.category || !body.level) {
    return NextResponse.json({ error: "Missing required fields: name, category, level" }, { status: 400 })
  }
  
  const validLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]
  if (!validLevels.includes(body.level)) {
    return NextResponse.json({ error: "Invalid level. Must be one of: " + validLevels.join(", ") }, { status: 400 })
  }
  
  const skill = await addSkill(userId, {
    name: body.name,
    description: body.description || "",
    category: body.category,
    level: body.level,
  })
  
  return NextResponse.json({ skill }, { status: 201 })
}