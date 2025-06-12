import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { Link } from 'react-router'

export default function LoginNavbar() {
  return (
    <nav className="border-b">
      <div className="container px-4 py-3 mx-auto sm:py-4">
        <div className="flex flex-wrap gap-y-4 gap-x-9 justify-between items-center">
          <Link to="/" className="text-2xl font-black uppercase">
            PaperNest
          </Link>

          <div className="hidden items-center space-x-4 md:flex">
            <Link to="/help">
              <Button variant="outline">
                <HelpCircle />
                Help
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
