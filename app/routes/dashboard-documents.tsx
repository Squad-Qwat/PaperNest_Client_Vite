import { useState, useEffect } from 'react'
import { DocumentsContent } from '@/components/pages/documents-content'

interface Document {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export function meta() {
  return [
    { title: 'PaperNest - Dashboard Documents' },
    { name: 'description', content: 'Manage your documents in PaperNest dashboard' },
  ]
}

export default function DashboardDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = 'https://your-api-url.com/api'

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`)
      }

      const data: Document[] = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch documents')

      const sampleDocuments: Document[] = [
        {
          id: '1',
          title: 'Machine Learning in Healthcare: A Comprehensive Review',
          createdAt: '2024-01-03T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
        },
        {
          id: '2',
          title: 'Artificial Intelligence Ethics in Modern Healthcare',
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-20T16:30:00Z',
        },
        {
          id: '3',
          title: 'Blockchain Technology for Medical Records Management',
          createdAt: '2024-01-08T11:45:00Z',
          updatedAt: '2024-01-22T13:10:00Z',
        },
        {
          id: '4',
          title: 'Natural Language Processing in Clinical Documentation',
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-25T10:45:00Z',
        },
        {
          id: '5',
          title: 'IoT Devices in Patient Monitoring Systems',
          createdAt: '2024-01-12T08:30:00Z',
          updatedAt: '2024-01-28T15:20:00Z',
        },
      ]
      setDocuments(sampleDocuments)
    } finally {
      setIsLoading(false)
    }
  }

  const createDocument = async (documentData: Partial<Document>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: documentData.title || 'New Document',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create document')
      }

      const newDocument = await response.json()
      setDocuments((prev) => [newDocument, ...prev])
      return newDocument
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  if (error && documents.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
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
          <button
            onClick={fetchDocuments}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full">
      <DocumentsContent
        documents={documents}
        onRefresh={fetchDocuments}
        onCreateDocument={createDocument}
        onDeleteDocument={deleteDocument}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
