import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options" // Assurez-vous d'avoir ce fichier configuré
import { ApplicationsTable } from "@/components/applications-table"
import { ApplicationsStats } from "@/components/applications-stats"
import { getUserApplications } from "@/lib/services/jobs-mongodb-service"

export const metadata: Metadata = {
  title: "Mes candidatures | LinkedBoost",
  description: "Suivez l'état de vos candidatures et gérez votre recherche d'emploi",
}

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/applications")
  }

  const applications = await getUserApplications(session.user.id)

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Mes candidatures</h1>
        <p className="text-muted-foreground">Suivez l'état de vos candidatures et gérez votre recherche d'emploi</p>
      </div>

      <ApplicationsStats applications={applications} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Toutes mes candidatures</h2>
        <ApplicationsTable applications={applications} />
      </div>
    </div>
  )
}
