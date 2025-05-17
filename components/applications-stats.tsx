import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, FileText } from "lucide-react"

interface ApplicationsStatsProps {
  applications: any[]
}

export function ApplicationsStats({ applications }: ApplicationsStatsProps) {
  // Calculer les statistiques
  const totalApplications = applications.length
  const pendingApplications = applications.filter((app) => app.status === "pending").length
  const reviewedApplications = applications.filter((app) =>
    ["reviewed", "interviewed", "accepted", "rejected"].includes(app.status),
  ).length
  const acceptedApplications = applications.filter((app) => app.status === "accepted").length
  const rejectedApplications = applications.filter((app) => app.status === "rejected").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-500" />
            Candidatures totales
          </CardTitle>
          <CardDescription>Nombre total de candidatures envoyées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalApplications}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingApplications} en attente • {reviewedApplications} traitées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Candidatures acceptées
          </CardTitle>
          <CardDescription>Offres pour lesquelles vous avez été retenu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{acceptedApplications}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {totalApplications > 0
              ? `${Math.round((acceptedApplications / totalApplications) * 100)}% de taux d'acceptation`
              : "Aucune candidature envoyée"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Clock className="mr-2 h-5 w-5 text-amber-500" />
            Temps de réponse moyen
          </CardTitle>
          <CardDescription>Délai moyen de réponse des recruteurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{reviewedApplications > 0 ? "7 jours" : "N/A"}</div>
          <p className="text-sm text-muted-foreground mt-1">{pendingApplications} candidatures en attente de réponse</p>
        </CardContent>
      </Card>
    </div>
  )
}
