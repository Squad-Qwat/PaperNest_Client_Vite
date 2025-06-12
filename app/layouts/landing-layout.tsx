import LandingNavbar from '@/components/common/navbar/landing-navbar'
import { Outlet } from 'react-router'

export default function LandingLayout() {
  return (
    <>
      <LandingNavbar />
      <main className="relative px-4 lg:px-0">
        <Outlet />
      </main>
    </>
  )
}
