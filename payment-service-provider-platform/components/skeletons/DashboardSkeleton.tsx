import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Top Section - Main Balance and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-24 bg-white/20" />
                  <Skeleton className="h-8 w-40 mt-2 bg-white/20" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Skeleton className="w-8 h-5 bg-white/20" />
                    <Skeleton className="w-8 h-5 bg-white/20" />
                  </div>
                  <Skeleton className="h-4 w-32 bg-white/20" />
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-3 w-16 bg-white/20" />
                    <Skeleton className="h-4 w-12 mt-1 bg-white/20" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-20 bg-white/20" />
                    <Skeleton className="h-4 w-16 mt-1 bg-white/20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Limit Card Skeleton */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-6 w-16 mt-1" />
                  <Skeleton className="h-3 w-12 mt-1" />
                </div>
                <Skeleton className="w-12 h-16 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Transactions Skeleton */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-12 mb-2" />
                <div className="h-8 flex items-end space-x-1">
                  {[...Array(12)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${Math.random() * 100 + 20}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Payments Skeleton */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-8 mb-2" />
                <div className="h-8 flex items-end space-x-1">
                  {[...Array(12)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${Math.random() * 60 + 10}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Wallet Usage Skeleton */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-4 w-36" />
                  <div className="flex items-center mt-1">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-4 w-20 ml-2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="h-16 relative">
                <Skeleton className="absolute inset-0 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Transactions Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20 mt-1" />
                      <Skeleton className="h-3 w-40 mt-1" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
