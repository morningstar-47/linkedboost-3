import { type NextRequest, NextResponse } from "next/server"
import { hasUserApplied } from "@/lib/services/jobs-mongodb-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options" // Assurez-vous d'avoir ce fichier configuré

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const userId = searchParams.get("userId") || session.user.id

    if (!jobId) {
      return NextResponse.json({ error: "ID de l'offre manquant" }, { status: 400 })
    }

    // Vérifier si l'utilisateur a déjà postulé
    const result = await hasUserApplied(userId, jobId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la vérification de la candidature:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la vérification" }, { status: 500 })
  }
}
