import { NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

const CIVIC_JWT_COOKIE = "civic-auth-token" // Adjust if Civic uses a different cookie name

export async function GET(req: NextRequest) {
  const token = req.cookies.get(CIVIC_JWT_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  try {
    const user = jwtDecode(token)
    return NextResponse.json({ authenticated: true, user })
  } catch (e) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
} 