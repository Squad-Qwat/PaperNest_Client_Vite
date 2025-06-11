import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Route } from './+types/document-citations'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, ExternalLink, BookOpen, User, Edit, Trash2 } from 'lucide-react'
import { useCitations } from '../hooks'
import { type Citation } from '../services/citations.service'

// Interface untuk form tambah citation
interface AddCitationForm {
  title: string
  author: string
  publicationInfo: string
  publicationDate: string
  accessDate: string
  DOI: string
  type: string
}

export function meta({ params }: Route['MetaArgs']) {
  return [
    { title: `PaperNest - Document ${params.documentId} - Citations` },
    { name: 'description', content: 'Manage citations for your document in PaperNest' },
  ]
}

export default function DocumentCitations({ params }: Route['ComponentProps']) {
  const { documentId } = params
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Citations')
  const [showAddForm, setShowAddForm] = useState(false)

  const { citations, apaFormats, isLoading, error, addCitation, deleteCitation } =
    useCitations(documentId)

  const [formData, setFormData] = useState<AddCitationForm>({
    title: '',
    author: '',
    publicationInfo: '',
    publicationDate: '',
    accessDate: '',
    DOI: '',
    type: 'Journal',
  })

  const [isSaving, setIsSaving] = useState(false)

  // Add new citation using the service
  const handleAddCitation = async () => {
    if (!formData.title || !formData.author || !formData.publicationInfo) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsSaving(true)

      await addCitation({
        title: formData.title,
        author: formData.author,
        publicationInfo: formData.publicationInfo,
        publicationDate: formData.publicationDate,
        accessDate: formData.accessDate,
        DOI: formData.DOI,
        type: formData.type,
        FK_DocumentId: documentId || '',
      })

      // Reset form
      setFormData({
        title: '',
        author: '',
        publicationInfo: '',
        publicationDate: '',
        accessDate: '',
        DOI: '',
        type: 'Journal',
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding citation:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Delete citation using the service
  const handleDeleteCitation = async (citationId: string) => {
    if (!confirm('Are you sure you want to delete this citation?')) {
      return
    }

    try {
      await deleteCitation(citationId)
    } catch (error) {
      console.error('Error deleting citation:', error)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'Overview':
        navigate(`/document/${documentId}`)
        break
      case 'Citations':
        // Already on citations page
        break
      case 'Reviews':
        navigate(`/document/${documentId}/reviews`)
        break
      case 'Settings':
        navigate(`/document/${documentId}/settings`)
        break
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="px-6 py-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Citations</h1>
            <span className="text-sm text-gray-500">{citations.length} citations</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : citations.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No citations yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your bibliography by adding your first citation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {citations.map((citation) => (
                <div
                  key={citation.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{citation.title}</h3>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{citation.author}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{citation.publicationInfo}</span>
                        </div>

                        {citation.publicationDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Published: {formatDate(citation.publicationDate)}</span>
                          </div>
                        )}

                        {citation.accessDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Accessed: {formatDate(citation.accessDate)}</span>
                          </div>
                        )}

                        {citation.DOI && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <a
                              href={`https://doi.org/${citation.DOI}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              DOI: {citation.DOI}
                            </a>
                          </div>
                        )}
                      </div>

                      {apaFormats && apaFormats[citation.id] && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-700">
                          <p className="font-medium mb-1">APA Format:</p>
                          <p className="italic">{apaFormats[citation.id]}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCitation(citation.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Add Citation Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Citation</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Journal">Journal</option>
                      <option value="Book">Book</option>
                      <option value="Website">Website</option>
                      <option value="Conference">Conference</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter citation title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter author(s)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publication Info <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.publicationInfo}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, publicationInfo: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Journal name, volume, pages, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publication Date
                      </label>
                      <input
                        type="date"
                        value={formData.publicationDate}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, publicationDate: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Date
                      </label>
                      <input
                        type="date"
                        value={formData.accessDate}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, accessDate: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DOI</label>
                    <input
                      type="text"
                      value={formData.DOI}
                      onChange={(e) => setFormData((prev) => ({ ...prev, DOI: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="10.1000/example"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCitation}
                    disabled={isSaving}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSaving ? 'Adding...' : 'Add Citation'}
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
