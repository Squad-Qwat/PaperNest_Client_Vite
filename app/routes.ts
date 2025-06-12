import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/', [
    layout('layouts/landing-layout.tsx', [
      index('routes/landing/_index.tsx'),
      route('about', 'routes/landing/about.tsx'),
      route('pricing', 'routes/landing/pricing.tsx'),
    ]),
  ]),

  ...prefix('auth/', [
    layout('layouts/auth-layout.tsx', [
      route('signup', 'routes/landing/auth/sign-up.tsx'),
      route('login', 'routes/landing/auth/log-in.tsx'),
    ]),
  ]),

  ...prefix('dashboard', [
    layout('layouts/dashboard-layout.tsx', [index('routes/dashboard/_index.tsx')]),
  ]),
] satisfies RouteConfig
