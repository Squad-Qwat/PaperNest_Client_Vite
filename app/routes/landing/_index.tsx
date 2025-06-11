import HeroSection from '@/components/landing/home/hero-section'
import type { Route } from './+types/_index'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Home' }, { name: 'description', content: 'Welcome to PaperNest!' }]
}

export default function Home() {
  return (
    <>
      <HeroSection />
    </>
  )
}
