import { type NextRequest, NextResponse } from "next/server"
import { getUserProfile } from "@/lib/services/user-service" // À implémenter selon votre structure

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userProfile = await getUserProfile(userId)

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      hasCV: !!userProfile.hasCV,
    })
  } catch (error) {
    console.error("Error checking if user has CV:", error)
    return NextResponse.json({ error: "Failed to check user CV status" }, { status: 500 })
  }
}
