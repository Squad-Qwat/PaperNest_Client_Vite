import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | null>(null)

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog: React.FC<DialogProps> = ({ children, open = false, onOpenChange }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild = false }) => {
  const context = React.useContext(DialogContext)

  const handleClick = () => {
    context?.onOpenChange(true)
  }

  if (asChild) {
    // For asChild, we wrap the child and handle the click
    return (
      <div onClick={handleClick} style={{ display: 'inline-block' }}>
        {children}
      </div>
    )
  }

  return <button onClick={handleClick}>{children}</button>
}

interface DialogPortalProps {
  children: React.ReactNode
}

const DialogPortal: React.FC<DialogPortalProps> = ({ children }) => {
  return <>{children}</>
}

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
  )
)
DialogOverlay.displayName = 'DialogOverlay'

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DialogContext)

    if (!context?.open) return null

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        context.onOpenChange(false)
      }
    }

    const handleCloseClick = () => {
      context.onOpenChange(false)
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        <DialogOverlay />
        <div
          ref={ref}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg sm:rounded-lg',
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
          <button
            onClick={handleCloseClick}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    )
  }
)
DialogContent.displayName = 'DialogContent'

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
DialogTitle.displayName = 'DialogTitle'

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
  )
)
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
