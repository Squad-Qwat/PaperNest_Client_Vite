import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard' }, { name: 'description', content: 'Welcome to PaperNest!' }]
}

export default function Home() {
  return (
    <>
      <h1>Dashboard</h1>
    </>
  )
}
