import { notFound } from "next/navigation"
import { getJobById, getSimilarJobs } from "@/lib/jobs-service"
import { JobDetail } from "@/components/job-detail"
import { JobApplicationForm } from "@/components/job-application-form"
import { SimilarJobs } from "@/components/similar-jobs"

interface JobPageProps {
  params: {
    id: string
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await getJobById(params.id)

  if (!job) {
    notFound()
  }

  const similarJobs = await getSimilarJobs(job.id)

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <JobDetail job={job} />
        </div>
        <div className="space-y-6">
          <JobApplicationForm jobId={job.id} jobTitle={job.title} companyName={job.company} />
          <SimilarJobs jobs={similarJobs} />
        </div>
      </div>
    </div>
  )
}
