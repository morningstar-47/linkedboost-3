import { type NextRequest, NextResponse } from "next/server"
import { submitApplication } from "@/lib/services/jobs-mongodb-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options" // Assurez-vous d'avoir ce fichier configuré

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { jobId, userId, coverLetter, personalMessage, useLinkedInProfile } = await request.json()

    if (!jobId || !coverLetter) {
      return NextResponse.json({ error: "Informations de candidature incomplètes" }, { status: 400 })
    }

    // Vérifier que l'utilisateur soumet sa propre candidature
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas soumettre une candidature pour un autre utilisateur" },
        { status: 403 },
      )
    }

    // Soumettre la candidature
    const result = await submitApplication({
      userId,
      jobId,
      coverLetter,
      personalMessage,
      useLinkedInProfile,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la soumission de la candidature:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la soumission de votre candidature" },
      { status: 500 },
    )
  }
}
