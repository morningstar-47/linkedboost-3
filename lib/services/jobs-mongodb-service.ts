import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb-service"

// Fonction pour récupérer les candidatures d'un utilisateur
export async function getUserApplications(userId: string) {
  try {
    const { db } = await connectToDatabase()

    // Convertir l'ID utilisateur en ObjectId si nécessaire
    const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId

    // Récupérer les candidatures avec les informations des offres associées
    const applications = await db
      .collection("jobApplications")
      .aggregate([
        {
          $match: { userId: userObjectId },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "jobId",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: {
            path: "$job",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray()

    // Convertir les ObjectId en chaînes pour la sérialisation JSON
    return applications.map((app) => ({
      ...app,
      _id: app._id.toString(),
      userId: app.userId.toString(),
      jobId: app.jobId.toString(),
      job: app.job
        ? {
            ...app.job,
            _id: app.job._id.toString(),
          }
        : null,
    }))
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error)
    return []
  }
}

// Vérifier si un utilisateur a déjà postulé à une offre
export async function hasUserApplied(userId: string, jobId: string) {
  try {
    const { db } = await connectToDatabase()

    // Convertir les IDs en ObjectId
    const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId
    const jobObjectId = typeof jobId === "string" ? new ObjectId(jobId) : jobId

    const application = await db.collection("jobApplications").findOne({
      userId: userObjectId,
      jobId: jobObjectId,
    })

    return { hasApplied: !!application }
  } catch (error) {
    console.error("Erreur lors de la vérification de la candidature:", error)
    return { hasApplied: false }
  }
}

// Soumettre une candidature
export async function submitApplication(applicationData: {
  userId: string
  jobId: string
  coverLetter: string
  personalMessage?: string
  useLinkedInProfile: boolean
}) {
  try {
    const { db } = await connectToDatabase()

    // Convertir les IDs en ObjectId
    const userObjectId =
      typeof applicationData.userId === "string" ? new ObjectId(applicationData.userId) : applicationData.userId

    const jobObjectId =
      typeof applicationData.jobId === "string" ? new ObjectId(applicationData.jobId) : applicationData.jobId

    // Vérifier si l'utilisateur a déjà postulé
    const existingApplication = await db.collection("jobApplications").findOne({
      userId: userObjectId,
      jobId: jobObjectId,
    })

    if (existingApplication) {
      return { success: false, error: "Vous avez déjà postulé à cette offre" }
    }

    // Créer la candidature
    const result = await db.collection("jobApplications").insertOne({
      userId: userObjectId,
      jobId: jobObjectId,
      coverLetter: applicationData.coverLetter,
      personalMessage: applicationData.personalMessage || "",
      useLinkedInProfile: applicationData.useLinkedInProfile,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastStatusChange: new Date(),
    })

    // Mettre à jour le compteur de candidatures pour l'offre
    await db.collection("jobs").updateOne({ _id: jobObjectId }, { $inc: { applications: 1 } })

    return {
      success: true,
      applicationId: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Erreur lors de la soumission de la candidature:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de la soumission de votre candidature",
    }
  }
}

// Autres fonctions existantes...
