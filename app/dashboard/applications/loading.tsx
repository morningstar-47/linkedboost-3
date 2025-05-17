import { Skeleton } from "@/components/ui/skeleton"

export default function ApplicationsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-5 w-[450px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="border rounded-lg">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}
