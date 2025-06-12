import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SimpleInput = React.forwardRef<HTMLInputElement, SimpleInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

SimpleInput.displayName = 'SimpleInput'

export { SimpleInput }
