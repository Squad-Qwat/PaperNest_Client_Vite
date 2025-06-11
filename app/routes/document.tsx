import type { Route } from './+types/document'
import { DocumentContent } from '@/components/pages/document-content'

export function meta({ params }: Route['MetaArgs']) {
  return [
    { title: `PaperNest - Document ${params.documentId}` },
    { name: 'description', content: 'View and manage your document in PaperNest' },
  ]
}

export default function Document({ params }: Route['ComponentProps']) {
  return (
    <div className="h-screen w-full ">
      <DocumentContent documentId={params.documentId} />
    </div>
  )
}
