import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Route } from './+types/document-settings'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import { Settings, Save, Trash2 } from 'lucide-react'
import { useDocumentSettings } from '../hooks'

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { settings, isLoading, isSaving, error, updateSettings, saveSettings, deleteDocument } =
    useDocumentSettings(documentId)

  const handleSaveSettings = async () => {
    const success = await saveSettings()
    if (success) {
      alert('Settings saved successfully!')
    } else {
      alert('Error saving settings. Please try again.')
    }
  }

  const handleDeleteDocument = async () => {
    const success = await deleteDocument()
    if (success) {
      alert('Document deleted successfully!')
      navigate('/documents')
    } else {
      alert('Error deleting document. Please try again.')
    }
  }

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
                  onChange={(e) => updateSettings({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter document title"
                />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-4">
                These actions are destructive and cannot be reversed. Be careful!
              </p>

              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Document
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
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
                variant="destructive"
                onClick={() => {
                  handleDeleteDocument()
                  setShowDeleteConfirm(false)
                }}
                className="flex-1"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
