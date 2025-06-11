import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('workspace/documents', 'routes/workspace-documents.tsx'),
] satisfies RouteConfig
