"use client"

import { useState, useEffect } from 'react'

interface InteractiveLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InteractiveLoading({ size = 'md', className }: InteractiveLoadingProps) {
  const [activeButton, setActiveButton] = useState(0)

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const containerSizes = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveButton((prev) => (prev + 1) % 3)
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex items-center justify-center ${containerSizes[size]} ${className}`}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            transition-all 
            duration-300 
            ease-in-out
            ${activeButton === index 
              ? 'bg-[#7DC400] scale-125 shadow-lg' 
              : 'bg-gray-300 scale-100'
            }
          `}
        />
      ))}
    </div>
  )
}
