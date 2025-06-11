import type { Route } from './+types/workspace-documents'
import { DocumentsContent } from '@/components/documents-content'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'PaperNest - Workspace Documents' },
    { name: 'description', content: 'Manage your documents in PaperNest workspace' },
  ]
}

export default function WorkspaceDocuments() {
  return (
    <div className="h-screen w-full">
      <DocumentsContent />
    </div>
  )
}
