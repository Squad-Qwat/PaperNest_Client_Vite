import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  // Landing pages yang bisa diakses tanpa login
  ...prefix('/', [
    layout('layouts/landing-layout.tsx', [
      index('routes/landing/_index.tsx'),
      route('about', 'routes/landing/about.tsx'),
      route('pricing', 'routes/landing/pricing.tsx'),
    ]),
  ]),

  // Auth pages
  ...prefix('auth/', [
    layout('layouts/auth-layout.tsx', [
      route('signup', 'routes/landing/auth/sign-up.tsx'),
      route('login', 'routes/landing/auth/log-in.tsx'),
    ]),
  ]),
  // Dashboard dan document pages yang membutuhkan autentikasi
  ...prefix('/', [
    layout('components/common/private-route.tsx', [
      route('document/:documentId', 'routes/document.tsx'),
      route('document-edit/:documentId', 'routes/document-edit.tsx'),
      route('document/:documentId/citations', 'routes/document-citations.tsx'),
      route('document/:documentId/reviews', 'routes/document-reviews.tsx'),
      route('document/:documentId/settings', 'routes/document-settings.tsx'),

      ...prefix('dashboard', [
        layout('layouts/dashboard-layout.tsx', [index('routes/dashboard-documents.tsx')]),
      ]),
    ]),
  ]),
] satisfies RouteConfig
