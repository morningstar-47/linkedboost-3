import type { Job } from "@/lib/jobs-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface SimilarJobsProps {
  jobs: Job[]
}

export function SimilarJobs({ jobs }: SimilarJobsProps) {
  if (jobs.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Offres similaires</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block group">
              <div className="flex gap-3 p-3 rounded-lg border border-transparent group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                <div className="flex-shrink-0">
                  <Image
                    src={job.companyLogo || "/placeholder.svg?height=40&width=40&query=company logo"}
                    alt={job.company}
                    width={40}
                    height={40}
                    className="rounded-md object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap text-xs text-muted-foreground gap-y-1">
                    <div className="flex items-center">
                      <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                      {job.company}
                    </div>
                    <span className="hidden sm:inline mx-1">•</span>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      {job.location}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
