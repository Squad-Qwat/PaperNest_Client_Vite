// import type { Route } from './+types/home'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: 'New React Router App' },
//     { name: 'description', content: 'Welcome to React Router!' },
//   ]
// }

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Welcome to PaperNest</h1>
        <p className="text-muted-foreground">Your document management solution</p>
        <Button asChild>
          <Link to="/workspace/documents">Go to Workspace Documents</Link>
        </Button>
      </div>
    </div>
  )
}
