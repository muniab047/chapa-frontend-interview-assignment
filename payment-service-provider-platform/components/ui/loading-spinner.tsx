import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-[#7DC400]",
        sizeClasses[size],
        className
      )}
    />
  )
}
