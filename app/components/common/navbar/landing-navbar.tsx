'use client'

import { Button } from '@/components/ui/button'
import { landingNavigationItems } from '@/data/landing-navbar-items'
import { useMediaQuery } from '@/lib/use-media-querry'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 backdrop-blur transition-all duration-200 bg-background/95 supports-[backdrop-filter]:bg-background/60',
        isScrolled ? 'border-b' : ''
      )}
    >
      <div className="flex justify-between items-center px-4 py-4 mx-auto max-w-7xl">
        <Link to="" className="mr-8 text-2xl font-black uppercase ita">
          PaperNest
        </Link>

        {isDesktop ? (
          <>
            <nav className="hidden items-center space-x-4 lg:flex">
              {landingNavigationItems.map((items, index) => (
                <Link
                  key={index}
                  to={items.href}
                  className="px-3 py-1 font-medium rounded text-foreground hover:bg-accent hover:text-foreground"
                >
                  {items.title}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/auth/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/auth/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
