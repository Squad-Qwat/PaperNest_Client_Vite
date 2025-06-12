'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'

interface CrosshairConfig {
  topLeft?: boolean
  topRight?: boolean
  bottomLeft?: boolean
  bottomRight?: boolean
}

interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  crosshairs?: CrosshairConfig
  gridLines?: boolean
  columns?: 8 | 12 | 16
  lineVariant?: 'all' | 'vertical' | 'horizontal' | 'center' | 'none'
}

function CrosshairIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export default function GridLayout({
  children,
  crosshairs,
  gridLines = true,
  columns = 16,
  lineVariant = 'all',
  className,
  ...props
}: GridLayoutProps) {
  return (
    <div
      className={cn(
        'relative grid w-full gap-0',
        gridLines && 'border-grid-line border',
        columns === 16 && 'grid-cols-grid-16',
        columns === 12 && 'grid-cols-grid-12',
        columns === 8 && 'grid-cols-grid-8',
        className
      )}
      {...props}
    >
      {gridLines && (
        <div className="absolute inset-0 z-0">
          {/* Vertikale Linien */}
          {(lineVariant === 'all' || lineVariant === 'vertical' || lineVariant === 'center') && (
            <div className="flex absolute inset-0 justify-center">
              {lineVariant === 'center' ? (
                <div className="w-px h-full border-r border-grid-line" />
              ) : (
                <div
                  className={cn(
                    'grid size-full',
                    columns === 16 && 'grid-cols-grid-16',
                    columns === 12 && 'grid-cols-grid-12',
                    columns === 8 && 'grid-cols-grid-8'
                  )}
                >
                  {Array.from({ length: columns }).map((_, i) => (
                    <div
                      key={i}
                      className={cn('border-grid-line border-r', i === 0 && 'border-l')}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Horizontale Linien */}
          {(lineVariant === 'all' || lineVariant === 'horizontal') && (
            <div className="absolute inset-0 grid grid-rows-[repeat(16,1fr)]">
              {Array.from({ length: 17 }).map((_, i) => (
                <div key={i} className={cn('border-grid-line border-t', i === 16 && 'border-b')} />
              ))}
            </div>
          )}
        </div>
      )}

      {crosshairs?.topLeft && <CrosshairIcon className="absolute -top-2 -left-2 text-grid-line" />}
      {crosshairs?.topRight && (
        <CrosshairIcon className="absolute -top-2 -right-2 text-grid-line" />
      )}
      {crosshairs?.bottomLeft && (
        <CrosshairIcon className="absolute -bottom-2 -left-2 text-grid-line" />
      )}
      {crosshairs?.bottomRight && (
        <CrosshairIcon className="absolute -right-2 -bottom-2 text-grid-line" />
      )}

      <div className="relative z-10 col-span-full">{children}</div>
    </div>
  )
}
