import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Route } from './+types/document-reviews'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Calendar,
  User,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react'
import { useReviews } from '../hooks'
import { type StudentReview, type DosenReview } from '../services/reviews.service'

type ReviewStatus = 'Approved' | 'NeedsRevision' | 'Done'

interface AddReviewForm {
  studentName: string
  studentComment: string
  documentContent: string
}

export function meta({ params }: Route['MetaArgs']) {
  return [
    { title: `PaperNest - Document ${params.documentId} - Reviews` },
    { name: 'description', content: 'Manage reviews for your document in PaperNest' },
  ]
}

export default function DocumentReviews({ params }: Route['ComponentProps']) {
  const { documentId } = params
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Reviews')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState<string | null>(null)

  const { reviews, isLoading, isSaving, error, addReview, deleteReview } = useReviews(documentId)

  const [formData, setFormData] = useState<AddReviewForm>({
    studentName: '',
    studentComment: '',
    documentContent: '',
  })

  // Add new review
  const handleAddReview = async () => {
    if (!formData.studentName || !formData.studentComment || !formData.documentContent) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await addReview(formData)

      // Reset form
      setFormData({
        studentName: '',
        studentComment: '',
        documentContent: '',
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await deleteReview(reviewId)
    } catch (error) {
      console.error('Error deleting review:', error)
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
        // Already on reviews page
        break
      case 'Settings':
        navigate(`/document/${documentId}/settings`)
        break
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const getStatusIcon = (status: ReviewStatus) => {
    if (!status) return <Clock className="h-5 w-5 text-gray-400" />

    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'NeedsRevision':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'Done':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: ReviewStatus | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-600'

    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'NeedsRevision':
        return 'bg-red-100 text-red-800'
      case 'Done':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const selectedReview = reviews.find((r) => r.id === showDetailModal)
  const selectedDocumentReview = reviews.find((r) => r.id === showDocumentModal)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="px-6 py-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Reviews</h1>
              <span className="text-sm text-gray-500">{reviews.length} reviews</span>
            </div>
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
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to submit a review for this document.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-gray-900">{review.studentName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(review.submittedDate)}</span>
                        </div>
                        {review.dosenReview && (
                          <div className="flex items-center gap-2">
                            {getStatusIcon(review.dosenReview.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.dosenReview.status)}`}
                            >
                              {review.dosenReview.status}
                            </span>
                          </div>
                        )}
                        {!review.dosenReview && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending Review
                            </span>
                          </div>
                        )}
                      </div>{' '}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDocumentModal(review.id)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Lihat Dokumen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetailModal(review.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Student Comment:</h4>
                    <p className="text-gray-700 leading-relaxed">{review.studentComment}</p>
                  </div>

                  {review.dosenReview && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">Dosen Review:</span>
                        <span className="text-sm text-gray-600">Dosen</span>
                        <span className="text-sm text-gray-500">
                          •{' '}
                          {review.dosenReview.createdAt
                            ? formatDate(review.dosenReview.createdAt)
                            : 'Recent'}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.dosenReview.comment}</p>
                    </div>
                  )}
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
        {/* Add Review Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit New Review</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Mahasiswa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, studentName: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter student name"
                    />
                  </div>{' '}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.studentComment}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, studentComment: e.target.value }))
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Enter your review comment..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Content (Markdown) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.documentContent}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, documentContent: e.target.value }))
                      }
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                      placeholder="Enter document content in markdown format..."
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
                    onClick={handleAddReview}
                    disabled={isSaving}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSaving ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Detail Modal */}
        {showDetailModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Review Details</h2>
                  <Button variant="outline" onClick={() => setShowDetailModal(null)} size="sm">
                    Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Student Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Student Submission</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-gray-900">
                            {selectedReview.studentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(selectedReview.submittedDate)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedReview.studentComment}
                      </p>
                    </div>
                  </div>

                  {/* Dosen Review */}
                  {selectedReview.dosenReview ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Dosen Review</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span className="font-medium text-gray-900">Dosen</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {selectedReview.dosenReview.createdAt
                                  ? formatDate(selectedReview.dosenReview.createdAt)
                                  : 'Recent'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(selectedReview.dosenReview.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.dosenReview.status)}`}
                            >
                              {selectedReview.dosenReview.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedReview.dosenReview.comment}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Dosen Review</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">Pending Review</span>
                        </div>
                        <p className="text-yellow-700 mt-2">
                          This submission is waiting for dosen review.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}{' '}
        {/* Document Modal */}
        {showDocumentModal && selectedDocumentReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Document Content</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted by {selectedDocumentReview.studentName} on{' '}
                      {formatDate(selectedDocumentReview.submittedDate)}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setShowDocumentModal(null)} size="sm">
                    Close
                  </Button>
                </div>{' '}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4">
                    <div
                      className="markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: selectedDocumentReview.documentContent
                          .split('\n')
                          .map((line) => {
                            // Handle headers
                            if (line.startsWith('### ')) {
                              return `<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">${line.substring(4)}</h3>`
                            }
                            if (line.startsWith('## ')) {
                              return `<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3">${line.substring(3)}</h2>`
                            }
                            if (line.startsWith('# ')) {
                              return `<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${line.substring(2)}</h1>`
                            }
                            // Handle bold text
                            line = line.replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-semibold text-gray-900">$1</strong>'
                            )
                            // Handle bullet points
                            if (line.startsWith('- ')) {
                              return `<li class="ml-4 mb-1">${line.substring(2)}</li>`
                            }
                            // Handle numbered lists
                            if (/^\d+\./.test(line)) {
                              return `<li class="ml-4 mb-1">${line.substring(line.indexOf('.') + 2)}</li>`
                            }
                            // Handle empty lines
                            if (line.trim() === '') {
                              return '<br/>'
                            }
                            // Regular paragraphs
                            return `<p class="mb-3 text-gray-700 leading-relaxed">${line}</p>`
                          })
                          .join(''),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
