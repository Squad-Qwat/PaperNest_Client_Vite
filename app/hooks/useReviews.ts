import { useState, useEffect, useCallback } from 'react'
import ReviewsService, {
  type StudentReview,
  type AddReviewForm,
  type DosenReview,
} from '../services/reviews.service'
import { handleApiError } from '../services/api'

export function useReviews(documentId: string) {
  const [reviews, setReviews] = useState<StudentReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ReviewsService.getReviewsForDocument(documentId)
      setReviews(data)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to load reviews')

      // Sample data untuk development
      const sampleReviews: StudentReview[] = [
        {
          id: '1',
          studentName: 'Budi Santoso',
          studentComment: 'Ini adalah revisi pertama dari dokumen penelitian saya.',
          submittedDate: '2024-01-15T08:30:00Z',
          documentContent:
            '# Judul Penelitian\n\n## Abstrak\n\nIni adalah abstrak penelitian.\n\n## Pendahuluan\n\nPenelitian ini bertujuan untuk menyelidiki...',
          dosenReview: {
            id: 'd1',
            comment: 'Bagus, tapi perlu perbaikan di bagian metodologi.',
            status: 'NeedsRevision',
            documentBodyId: '1',
            lecturerId: 'dosen-1',
            createdAt: '2024-01-18T14:20:00Z',
          },
          documentBodyId: 'body-1',
        },
        {
          id: '2',
          studentName: 'Ani Wijaya',
          studentComment: 'Revisi kedua setelah masukan dari dosen.',
          submittedDate: '2024-01-22T10:45:00Z',
          documentContent:
            '# Judul Penelitian\n\n## Abstrak\n\nIni adalah abstrak penelitian yang sudah direvisi.\n\n## Pendahuluan\n\nPenelitian ini bertujuan untuk menyelidiki...\n\n## Metodologi\n\nMetodologi yang digunakan adalah...',
          dosenReview: null,
          documentBodyId: 'body-2',
        },
      ]

      setReviews(sampleReviews)
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  const addReview = useCallback(
    async (data: AddReviewForm) => {
      try {
        setIsSaving(true)
        setError(null)

        const newReview = await ReviewsService.addReview(documentId, data)
        setReviews((prev) => [...prev, newReview])

        return true
      } catch (err) {
        console.error('Error adding review:', err)
        setError('Failed to add review')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [documentId]
  )

  const addDosenReview = useCallback(
    async (documentBodyId: string, dosenReview: DosenReview) => {
      try {
        setIsSaving(true)
        setError(null)

        const updatedReview = await ReviewsService.addDosenReview(
          documentId,
          documentBodyId,
          dosenReview
        )

        setReviews((prev) =>
          prev.map((review) => (review.id === documentBodyId ? updatedReview : review))
        )

        return true
      } catch (err) {
        console.error('Error adding dosen review:', err)
        setError('Failed to add dosen review')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [documentId]
  )

  const deleteReview = useCallback(
    async (reviewId: string) => {
      try {
        setIsSaving(true)
        setError(null)

        await ReviewsService.deleteReview(documentId, reviewId)
        setReviews((prev) => prev.filter((review) => review.id !== reviewId))

        return true
      } catch (err) {
        console.error('Error deleting review:', err)
        setError('Failed to delete review')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [documentId]
  )

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return {
    reviews,
    isLoading,
    isSaving,
    error,
    addReview,
    addDosenReview,
    deleteReview,
    fetchReviews,
  }
}
