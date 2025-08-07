import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32 mt-1" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-4 w-40 mt-2" />
                  </div>
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Banks Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40 mt-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
