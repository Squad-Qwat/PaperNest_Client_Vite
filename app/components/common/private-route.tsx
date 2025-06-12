import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/contexts/auth-context'

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    // Tampilkan spinner atau loading state
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect ke halaman login jika tidak terotentikasi
    return <Navigate to="/auth/login" replace />
  }

  // Render child routes jika terotentikasi
  return <Outlet />
}
