import type { RouteConfig } from '@react-router/dev/routes'

export interface Route {
  ComponentProps: {
    params: {
      documentId: string
    }
  }
  MetaArgs: {
    params: {
      documentId: string
    }
  }
}
