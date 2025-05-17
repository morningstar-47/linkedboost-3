import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb-service"

export async function getUserProfile(userId: string): Promise<any | null> {
  try {
    const db = await getDatabase()

    // Simuler une recherche d'utilisateur dans la base de données
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return null
    }

    // Simuler des données de profil supplémentaires
    const profile = {
      hasCV: true, // Simuler la présence d'un CV
      industry: "Marketing",
      // ... autres informations de profil
    }

    return {
      ...user,
      ...profile,
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}
