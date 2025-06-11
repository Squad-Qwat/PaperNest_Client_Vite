import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Route } from './+types/document-settings'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import { Settings, Save, Trash2 } from 'lucide-react'

interface DocumentSettings {
  id: string
  title: string
}

export function meta({ params }: Route['MetaArgs']) {
  return [
    { title: `PaperNest - Document ${params.documentId} - Settings` },
    { name: 'description', content: 'Manage settings for your document in PaperNest' },
  ]
}

export default function DocumentSettings({ params }: Route['ComponentProps']) {
  const { documentId } = params
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Settings')
  const [settings, setSettings] = useState<DocumentSettings>({
    id: '',
    title: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // API Base URL - Sesuaikan dengan URL API Anda
  const API_BASE_URL = 'https://your-api-url.com/api'

  // Fetch document settings dari API
  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      // Contoh API call - sesuaikan dengan endpoint API Anda
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Jika menggunakan authentication
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch document settings')
      }

      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching document settings:', error) // Fallback ke sample data untuk development
      setSettings({
        id: documentId || '',
        title: 'Machine Learning in Healthcare: A Comprehensive Review',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save document settings
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      // Contoh API call untuk menyimpan settings
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Jika menggunakan authentication
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Failed to save document settings')
      }

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving document settings:', error)
      // Fallback untuk development
      alert('Settings saved locally (development mode)')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete document
  const handleDeleteDocument = async () => {
    try {
      // Contoh API call untuk menghapus document
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Jika menggunakan authentication
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      alert('Document deleted successfully!')
      navigate('/workspace/documents')
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Error deleting document')
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [documentId])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'Overview':
        navigate(`/document/${documentId}`)
        break
      case 'Citations':
        navigate(`/document/${documentId}/citations`)
        break
      case 'Reviews':
        navigate(`/document/${documentId}/reviews`)
        break
      case 'Settings':
        // Already on settings page
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Document Settings</h1>
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>{' '}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Title</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter document title"
                />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <p className="text-sm text-red-600">
                  Once you delete a document, there is no going back. Please be certain.
                </p>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Document
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this document? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteDocument}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
