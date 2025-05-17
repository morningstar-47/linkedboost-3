export interface Job {
  _id?: string
  title: string
  company: string
  companyLogo?: string
  companyWebsite?: string
  companyDescription?: string
  location: string
  type: string
  salary?: string
  description: string
  responsibilities?: string[]
  requirements?: string[]
  niceToHave?: string[]
  benefits?: string[]
  experienceLevel: string
  education?: string
  languages?: string[]
  remote: boolean
  urgent: boolean
  postedAt: Date
  startDate?: string
  applicationDeadline?: Date
  views: number
  applications: number
  status: "active" | "closed" | "draft"
  createdAt: Date
  updatedAt: Date
}

export interface JobApplication {
  _id?: string
  userId: string
  jobId: string
  coverLetter: string
  personalMessage?: string
  useLinkedInProfile: boolean
  status: "pending" | "reviewed" | "interviewed" | "accepted" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
  lastStatusChange?: Date
}
