import { DocumentsContent } from '@/components/pages/documents-content'
import { useDocuments } from '../hooks'
import { useWorkspaces } from '../hooks'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function meta() {
  return [
    { title: 'PaperNest - Dashboard Documents' },
    { name: 'description', content: 'Manage your documents in PaperNest dashboard' },
  ]
}

export default function DashboardDocuments() {
  const { documents, isLoading, error, fetchDocuments, createDocument, deleteDocument } =
    useDocuments()
  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces()

  // Get the selected workspace (first available workspace for now)
  const selectedWorkspace = workspaces.length > 0 ? workspaces[0] : null

  // Tampilkan sementara pesan loading selama kedua data dimuat
  if (isLoading && isLoadingWorkspaces) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Jika tidak memiliki workspace, tampilkan pesan untuk membuat workspace terlebih dahulu
  if (!isLoadingWorkspaces && workspaces.length === 0) {
    return (
      <div className="h-screen w-full">
        <DocumentsContent
          documents={[]}
          onRefresh={fetchDocuments}
          onCreateDocument={createDocument}
          onDeleteDocument={deleteDocument}
          isLoading={false}
          error={null}
          hasWorkspace={false}
          selectedWorkspace={null}
          emptyStateContent={
            <div className="text-center py-12">
              <PlusCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                You don't have any workspace yet
              </h3>
              <p className="text-gray-600 mb-4">
                Please create or join a workspace first to manage documents
              </p>
            </div>
          }
        />
      </div>
    )
  }

  // Tampilkan error jika ada
  if (error && documents.length === 0) {
    return (
      <div className="h-screen w-full">
        <DocumentsContent
          documents={[]}
          onRefresh={fetchDocuments}
          onCreateDocument={createDocument}
          onDeleteDocument={deleteDocument}
          isLoading={false}
          error={error}
          hasWorkspace={workspaces.length > 0}
          selectedWorkspace={selectedWorkspace}
          emptyStateContent={
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Documents</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={fetchDocuments}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Try Again
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  // Tampilkan dokumen jika tersedia
  return (
    <div className="h-screen w-full">
      <DocumentsContent
        documents={documents}
        onRefresh={fetchDocuments}
        onCreateDocument={createDocument}
        onDeleteDocument={deleteDocument}
        isLoading={isLoading}
        error={error}
        hasWorkspace={workspaces.length > 0}
        selectedWorkspace={selectedWorkspace}
      />
    </div>
  )
}
