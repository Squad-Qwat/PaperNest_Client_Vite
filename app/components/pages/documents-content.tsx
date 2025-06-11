import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { TopNavBar } from '@/components/ui/dashboard-top-navbar'
import { Plus, Filter, Grid3X3, List, FileText, MoreHorizontal, Trash2, Edit } from 'lucide-react'

interface Document {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

interface DocumentsContentProps {
  documents: Document[]
  onRefresh: () => void
  onCreateDocument: (documentData: Partial<Document>) => Promise<Document>
  onDeleteDocument: (documentId: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function DocumentsContent({
  documents,
  onRefresh,
  onCreateDocument,
  onDeleteDocument,
  isLoading,
  error,
}: DocumentsContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const navigate = useNavigate()

  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const handleDocumentClick = (documentId: string) => {
    navigate(`/document/${documentId}`)
  }

  const handleEditClick = (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation()
    navigate(`/document-edit/${documentId}`)
  }

  const handleDeleteClick = async (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await onDeleteDocument(documentId)
      } catch (error) {
        alert('Failed to delete document. Please try again.')
      }
    }
  }

  const handleCreateDocument = async () => {
    try {
      const newDoc = await onCreateDocument({
        title: 'New Document',
      })
      navigate(`/document-edit/${newDoc.id}`)
    } catch (error) {
      alert('Failed to create document. Please try again.')
    }
  }
  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <TopNavBar activeTab="Overview" />

      {/* Welcome Section */}
      <div className="px-6 py-8 bg-gray-50 border-b">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Welcome to PaperNest Caldera!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Create stunning document and show the world of your research!
          </p>

          {/* Search Bar */}
          <div className="relative w-2xl">
            <Input
              placeholder="Search documents by title..."
              className="pl-4 pr-20 py-3 text-sm bg-white border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                Ask
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                Research
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                Build
              </Button>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Documents</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredDocuments.length} of {documents.length} documents
              {error && <span className="text-red-500 ml-2">({error})</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg bg-white shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-r-none border-r ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-l-none ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter */}
            <Button variant="outline" size="sm" className="bg-white shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              className="bg-white shadow-sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Documents Grid/List */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first document to get started'}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {filteredDocuments.map((document) => (
              <Card
                key={document.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-gray-100 border-gray-200 hover:border-gray-300 relative"
                onClick={() => handleDocumentClick(document.id)}
              >
                <CardContent className={viewMode === 'grid' ? 'p-5' : 'p-4'}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                          <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200"
                            onClick={(e) => handleEditClick(e, document.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                            onClick={(e) => handleDeleteClick(e, document.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                          {document.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>Created: {formatDate(document.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Updated: {formatDate(document.updatedAt)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{document.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <span>Created: {formatDate(document.createdAt)}</span>
                            <span>•</span>
                            <span>Updated: {formatDate(document.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                          onClick={(e) => handleEditClick(e, document.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                          onClick={(e) => handleDeleteClick(e, document.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg h-12 w-12 rounded-full p-0"
            onClick={handleCreateDocument}
            disabled={isLoading}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  )
}
