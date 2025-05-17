import type { Job } from "@/lib/jobs-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookmarkIcon, Building2, Calendar, Clock, ExternalLink, MapPin, Share2 } from "lucide-react"
import Image from "next/image"

interface JobDetailProps {
  job: Job
}

export function JobDetail({ job }: JobDetailProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-32 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <Image
                src={job.companyLogo || "/placeholder.svg?height=80&width=80&query=company logo"}
                alt={job.company}
                width={80}
                height={80}
                className="rounded-md object-contain"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-12 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {job.type}
              </div>
              {job.salary && <div className="text-sm text-muted-foreground">💰 {job.salary}</div>}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant={job.urgent ? "destructive" : "outline"}>{job.urgent ? "Urgent" : "Standard"}</Badge>
              <Badge variant={job.remote ? "default" : "outline"}>{job.remote ? "Télétravail" : "Sur site"}</Badge>
              <Badge variant="outline">{job.experienceLevel}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1">
              <BookmarkIcon className="h-4 w-4" />
              Sauvegarder
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Publié {job.postedAt}
          </div>
          <div>{job.views} vues</div>
          <div>{job.applications} candidatures</div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Description du poste</h2>
            <div className="prose prose-sm max-w-none">
              <p>{job.description}</p>
            </div>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Responsabilités</h2>
              <ul className="list-disc pl-5 space-y-1">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Prérequis</h2>
              <ul className="list-disc pl-5 space-y-1">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.niceToHave && job.niceToHave.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Atouts supplémentaires</h2>
              <ul className="list-disc pl-5 space-y-1">
                {job.niceToHave.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Avantages</h2>
              <ul className="list-disc pl-5 space-y-1">
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.companyDescription && (
            <div>
              <h2 className="text-lg font-semibold mb-3">À propos de {job.company}</h2>
              <p>{job.companyDescription}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
