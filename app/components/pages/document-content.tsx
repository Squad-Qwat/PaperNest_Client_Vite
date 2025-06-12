import { useState } from 'react'
import { useNavigate } from 'react-router'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, ExternalLink, BookOpen, User } from 'lucide-react'
import { useDocument } from '@/hooks'

interface Citation {
  id: string
  title: string
  author: string
  publicationInfo: string
  publicationDate?: string
  accessDate?: string
  doi?: string
}

interface DocumentContentProps {
  documentId?: string
}

export function DocumentContent({ documentId }: DocumentContentProps) {
  const [activeTab, setActiveTab] = useState('Overview')
  const navigate = useNavigate()

  // Fetch document data
  const { document, isLoading, error } = useDocument(documentId)

  // Sample citations data
  const [citations, setCitations] = useState<Citation[]>([
    {
      id: '1',
      title: 'Deep Learning for Medical Image Analysis',
      author: 'Zhang, L., Wang, S., Liu, B.',
      publicationInfo: 'Nature Medicine, Vol. 28, No. 4, pp. 123-135',
      publicationDate: '2024-02-15',
      accessDate: '2024-03-10',
      doi: '10.1038/s41591-024-0234-1',
    },
    {
      id: '2',
      title: 'Artificial Intelligence in Healthcare: Current Applications and Future Prospects',
      author: 'Johnson, M., Smith, A., Brown, K.',
      publicationInfo: 'Journal of Medical Internet Research, Vol. 26, e45678',
      publicationDate: '2024-01-20',
      accessDate: '2024-03-05',
      doi: '10.2196/45678',
    },
    {
      id: '3',
      title: 'Machine Learning Algorithms for Predictive Healthcare Analytics',
      author: 'Chen, H., Davis, R., Wilson, T.',
      publicationInfo: 'IEEE Transactions on Biomedical Engineering, Vol. 71, No. 3',
      publicationDate: '2024-03-01',
      accessDate: '2024-03-12',
      doi: '10.1109/TBME.2024.3456789',
    },
  ])

  const [showAddCitation, setShowAddCitation] = useState(false)
  const handleEditDocument = () => {
    navigate(`/document-edit/${documentId}`)
  }

  const handleAddCitation = () => {
    setShowAddCitation(true)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'Overview':
        // Already on overview
        break
      case 'Citations':
        navigate(`/document/${documentId}/citations`)
        break
      case 'Reviews':
        navigate(`/document/${documentId}/reviews`)
        break
      case 'Settings':
        navigate(`/document/${documentId}/settings`)
        break
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        if (isLoading) {
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          )
        }

        if (error) {
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-amber-200 p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-amber-800">Unable to load document</h3>
                    <p className="mt-1 text-sm text-amber-700">
                      {error.includes('404') || error.includes('not found')
                        ? 'The document you\'re looking for doesn\'t exist. You can create a new document by clicking the "Edit Document" button below.'
                        : `Error: ${error}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <p className="text-lg font-medium text-gray-900">
                    {document?.title || 'Untitled Document'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created Date
                  </label>
                  <p className="text-gray-900">
                    {document?.createdAt
                      ? new Date(document.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleEditDocument}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Edit Document
                </Button>
              </div>
            </div>
          </div>
        )
      case 'Citations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Citations</h2>
            <p className="text-gray-600">Citation management coming soon...</p>
          </div>
        )
      case 'Reviews':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <p className="text-gray-600">Review system coming soon...</p>
          </div>
        )
      case 'Settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Document Settings</h2>
            <p className="text-gray-600">Document settings coming soon...</p>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <p className="text-gray-600">Content not found</p>
          </div>
        )
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="px-6 py-6">{renderContent()}</main>
    </div>
  )
}
