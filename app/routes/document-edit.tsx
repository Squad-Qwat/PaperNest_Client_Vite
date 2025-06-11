import { useParams, useNavigate } from 'react-router'
import { MDEditorClient } from '@/components/ui/md-editor-client'
import { Button } from '@/components/ui/button'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { useDocument } from '../hooks'

export default function DocumentEdit() {
  const { documentId } = useParams()
  const navigate = useNavigate()

  const { content, isLoading, isSaving, error, updateContent, saveDocument } =
    useDocument(documentId)

  const handleSave = async () => {
    const success = await saveDocument()
    if (success) {
      navigate(`/document/${documentId}`)
    } else {
      alert('Error saving document. Please try again.')
    }
  }

  const handleCancel = () => {
    navigate(`/document/${documentId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading document...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="container mx-auto py-8">
        <div className="">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4">Edit Document</h1>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Document'}
              </Button>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content</label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <MDEditorClient
                value={content}
                onChange={(val) => updateContent(val || '')}
                preview="edit"
                hideToolbar={false}
                visibleDragbar={false}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
