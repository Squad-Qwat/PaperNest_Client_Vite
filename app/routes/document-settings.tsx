import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Route } from './+types/document-settings'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import { Settings, Save, Trash2, AlertTriangle, FileText } from 'lucide-react'
import { useDocumentSettings } from '../hooks'
import { getCurrentUser } from '../services/auth.service'

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
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { settings, isLoading, isSaving, error, updateSettings, saveSettings, deleteDocument } =
    useDocumentSettings(documentId)

  // Check for authentication
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/auth/login')
      return
    }
  }, [navigate])

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(false)
  }, [settings])

  const handleSettingsChange = (newSettings: any) => {
    updateSettings(newSettings)
    setHasUnsavedChanges(true)
  }

  const handleSaveSettings = async () => {
    const success = await saveSettings()
    if (success) {
      setHasUnsavedChanges(false)
      alert('Settings saved successfully!')
    } else {
      alert('Error saving settings. Please try again.')
    }
  }

  const handleDeleteDocument = async () => {
    if (deleteConfirmText !== settings.title) {
      alert('Please type the exact document title to confirm deletion.')
      return
    }

    const success = await deleteDocument()
    if (success) {
      alert('Document deleted successfully!')
      navigate('/dashboard/documents')
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Settings</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your document title and other settings
              </p>
            </div>
            <div className="flex gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center text-orange-600 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Unsaved changes
                </div>
              )}
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving || !hasUnsavedChanges}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>{' '}
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Error</span>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}

            {/* Document Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Document Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => handleSettingsChange({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter document title"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This title will be displayed throughout the application
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Document ID</h3>
                  <code className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                    {settings.id}
                  </code>
                  <p className="text-xs text-gray-500 mt-1">
                    This is the unique identifier for your document
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <div className="flex items-center mb-4">
                <Trash2 className="h-5 w-5 text-red-600 mr-2" />
                <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                These actions are destructive and cannot be reversed. Please be careful!
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Warning</span>
                </div>
                <p className="text-red-700 text-sm">
                  Deleting this document will permanently remove:
                </p>
                <ul className="text-red-700 text-sm mt-2 ml-4 space-y-1">
                  <li>• All document content and versions</li>
                  <li>• All reviews and comments</li>
                  <li>• All citations and references</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>

              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Document Permanently
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-red-600">Confirm Deletion</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                This action will permanently delete the document and cannot be undone.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm font-medium mb-2">
                  To confirm deletion, please type the document title:
                </p>
                <p className="text-red-700 text-sm font-mono bg-white px-2 py-1 rounded border">
                  {settings.title}
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type the document title here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteDocument}
                disabled={deleteConfirmText !== settings.title || isSaving}
                className="flex-1"
              >
                {isSaving ? 'Deleting...' : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
