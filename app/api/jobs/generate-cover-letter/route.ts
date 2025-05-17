import { type NextRequest, NextResponse } from "next/server"
import { generateCoverLetter } from "@/lib/services/ai-service"
import { getUserProfile } from "@/lib/services/user-service" // À implémenter selon votre structure

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, companyName, userId } = await request.json()

    if (!jobTitle || !companyName || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Récupérer le profil utilisateur pour personnaliser la lettre
    const userProfile = await getUserProfile(userId)

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const coverLetter = await generateCoverLetter(jobTitle, companyName, userProfile)

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error("Error generating cover letter:", error)
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 })
  }
}
