import * as React from 'react'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: React.ReactNode
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>
}

interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
  children: React.ReactNode
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  className,
  children,
  asChild = false,
  ...props
}) => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className={cn('cursor-pointer', className)} onClick={() => setOpen(!open)} {...props}>
      {children}
    </div>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  children: React.ReactNode
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  className,
  align = 'center',
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md',
        align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
