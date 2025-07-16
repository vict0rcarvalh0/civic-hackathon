import { NextResponse } from "next/server"
import { getUserProfile, createOrUpdateProfile } from "@/lib/db"

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const profile = await getUserProfile(userId)
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }
  
  return NextResponse.json({ profile })
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const body = await req.json()
  if (!body.address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }
  
  const profile = await createOrUpdateProfile(userId, body.address, {
    displayName: body.displayName,
    bio: body.bio,
    avatar: body.avatar,
  })
  
  return NextResponse.json({ profile }, { status: 201 })
}

export async function PUT(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const body = await req.json()
  if (!body.address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }
  
  const profile = await createOrUpdateProfile(userId, body.address, {
    displayName: body.displayName,
    bio: body.bio,
    avatar: body.avatar,
  })
  
  return NextResponse.json({ profile })
} 