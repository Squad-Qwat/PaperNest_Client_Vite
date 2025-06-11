import { API_BASE_URL, type ApiResponse, handleApiError } from './api'

export type ReviewStatus = 'Approved' | 'NeedsRevision' | 'Done'

export interface DosenReview {
  id?: string
  comment: string
  status: ReviewStatus
  createdAt?: string
  documentBodyId: string
  lecturerId: string
}

export interface DocumentBody {
  id: string
  comment: string
  content: string
  createdAt: string
  documentId: string
  userCreatorId: string
}

export interface StudentReview {
  id: string
  studentName: string
  studentComment: string
  submittedDate: string
  documentContent: string
  dosenReview: DosenReview | null
  documentBodyId?: string
}

export interface AddReviewForm {
  studentName: string
  studentComment: string
  documentContent: string
}

const ReviewsService = {
  // Mengambil semua review untuk dokumen (versi dokumen)
  async getReviewsForDocument(documentId: string): Promise<StudentReview[]> {
    try {
      // Pertama, dapatkan versi dokumen terakhir
      const versionsResponse = await fetch(`${API_BASE_URL}/document/${documentId}/versions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!versionsResponse.ok) {
        throw new Error('Gagal mengambil versi dokumen')
      }

      const documentVersions: DocumentBody[] = await versionsResponse.json()
      if (!documentVersions.length) {
        return []
      }

      // Untuk setiap versi, dapatkan reviewnya
      const reviews: StudentReview[] = []

      for (const version of documentVersions) {
        const reviewResponse = await fetch(`${API_BASE_URL}/review/${version.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (reviewResponse.ok) {
          const dosenReviews: DosenReview[] = await reviewResponse.json()

          // Buat student review berdasarkan versi dokumen
          if (dosenReviews.length > 0) {
            reviews.push({
              id: version.id,
              studentName: 'Mahasiswa', // Tidak ada data studentName dari API
              studentComment: version.comment,
              submittedDate: version.createdAt,
              documentContent: version.content,
              dosenReview: dosenReviews[0],
              documentBodyId: version.id,
            })
          } else {
            reviews.push({
              id: version.id,
              studentName: 'Mahasiswa', // Tidak ada data studentName dari API
              studentComment: version.comment,
              submittedDate: version.createdAt,
              documentContent: version.content,
              dosenReview: null,
              documentBodyId: version.id,
            })
          }
        }
      }

      return reviews
    } catch (error) {
      console.error(`Error mengambil review untuk dokumen ${documentId}:`, error)
      throw error
    }
  },

  // Menambahkan review ke dokumen (membuat versi dokumen baru)
  async addReview(documentId: string, review: AddReviewForm): Promise<StudentReview> {
    try {
      // Buat versi dokumen baru
      const createVersionResponse = await fetch(
        `${API_BASE_URL}/document/${documentId}/version?userCreatorId=student-user-id`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comment: review.studentComment,
            content: review.documentContent,
          }),
        }
      )

      if (!createVersionResponse.ok) {
        throw new Error('Gagal menambahkan review')
      }

      const documentBody: DocumentBody = await createVersionResponse.json()

      // Return dalam format StudentReview
      return {
        id: documentBody.id,
        studentName: review.studentName,
        studentComment: documentBody.comment,
        submittedDate: documentBody.createdAt,
        documentContent: documentBody.content,
        dosenReview: null,
        documentBodyId: documentBody.id,
      }
    } catch (error) {
      console.error(`Error menambahkan review ke dokumen ${documentId}:`, error)
      throw error
    }
  },

  // Menambahkan review dosen ke review mahasiswa
  async addDosenReview(
    documentId: string,
    documentBodyId: string,
    dosenReview: DosenReview
  ): Promise<StudentReview> {
    try {
      // Tambahkan review dosen
      const response = await fetch(
        `${API_BASE_URL}/review/${documentBodyId}/${dosenReview.lecturerId}?status=${dosenReview.status}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dosenReview.comment),
        }
      )

      if (!response.ok) {
        throw new Error('Gagal menambahkan review dosen')
      }

      const createdDosenReview = await response.json()

      // Dapatkan informasi dokumen body
      const documentBodyResponse = await fetch(
        `${API_BASE_URL}/document/${documentId}/version/${documentBodyId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!documentBodyResponse.ok) {
        throw new Error('Gagal mengambil versi dokumen')
      }

      const documentBody: DocumentBody = await documentBodyResponse.json()

      // Return dalam format StudentReview
      return {
        id: documentBodyId,
        studentName: 'Mahasiswa', // Tidak ada data studentName dari API
        studentComment: documentBody.comment,
        submittedDate: documentBody.createdAt,
        documentContent: documentBody.content,
        dosenReview: createdDosenReview,
        documentBodyId,
      }
    } catch (error) {
      console.error(`Error menambahkan review dosen ke review mahasiswa ${documentBodyId}:`, error)
      throw error
    }
  },

  // Menghapus review
  async deleteReview(documentId: string, reviewId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/review/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus review')
      }
    } catch (error) {
      console.error(`Error menghapus review ${reviewId}:`, error)
      throw error
    }
  },
}

export default ReviewsService
