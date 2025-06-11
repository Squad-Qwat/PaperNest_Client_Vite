import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('documents', 'routes/dashboard-documents.tsx'),
  route('document/:documentId', 'routes/document.tsx'),
  route('document-edit/:documentId', 'routes/document-edit.tsx'),
  route('document/:documentId/citations', 'routes/document-citations.tsx'),
  route('document/:documentId/reviews', 'routes/document-reviews.tsx'),
  route('document/:documentId/settings', 'routes/document-settings.tsx'),
] satisfies RouteConfig
