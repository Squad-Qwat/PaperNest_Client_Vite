import { useState } from 'react'
import { useNavigate } from 'react-router'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, ExternalLink, BookOpen, User } from 'lucide-react'

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
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <p className="text-lg font-medium text-gray-900">
                    Machine Learning in Healthcare: A Comprehensive Review
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-700 leading-relaxed">
                    This comprehensive review explores the current applications and future potential
                    of machine learning in healthcare. We examine various ML techniques used in
                    medical diagnosis, treatment planning, and patient monitoring. The paper
                    discusses challenges, opportunities, and ethical considerations in implementing
                    AI-driven healthcare solutions.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created Date
                  </label>
                  <p className="text-gray-900">March 15, 2024</p>
                </div>
              </div>{' '}
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
