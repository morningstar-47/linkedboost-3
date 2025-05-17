"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle, Clock, Eye, MoreHorizontal, Pencil, Trash2, XCircle, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface ApplicationsTableProps {
  applications: any[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Fonction pour trier les candidatures
  const sortedApplications = [...applications].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Fonction pour changer le tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  // Fonction pour afficher le statut avec la bonne couleur
  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En attente
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Examinée
          </Badge>
        )
      case "interviewed":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <Pencil className="h-3 w-3" />
            Entretien
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Acceptée
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Refusée
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
        <div className="mb-4 rounded-full bg-muted p-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Aucune candidature</h3>
        <p className="mb-4 text-sm text-muted-foreground max-w-md">
          Vous n'avez pas encore envoyé de candidature. Explorez les offres d'emploi disponibles pour commencer votre
          recherche.
        </p>
        <Button onClick={() => router.push("/jobs")}>Voir les offres d'emploi</Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("job.title")}>
              Poste
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("job.company")}>
              Entreprise
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
              Statut
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("createdAt")}>
              Date de candidature
            </TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.map((application) => (
            <TableRow key={application._id}>
              <TableCell className="font-medium">
                <Link href={`/jobs/${application.jobId}`} className="hover:underline">
                  {application.job?.title || "Poste non disponible"}
                </Link>
              </TableCell>
              <TableCell>{application.job?.company || "Entreprise inconnue"}</TableCell>
              <TableCell>{renderStatus(application.status)}</TableCell>
              <TableCell>
                {application.createdAt
                  ? formatDistanceToNow(new Date(application.createdAt), { addSuffix: true, locale: fr })
                  : "Date inconnue"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/jobs/${application.jobId}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir l'offre
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/applications/${application._id}`)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Détails
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        // Implémenter la suppression
                        if (confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
                          // deleteApplication(application._id)
                          console.log("Suppression de la candidature", application._id)
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
