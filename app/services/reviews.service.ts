import { API_BASE_URL, type ApiResponse, handleApiError } from './api'

export type ReviewStatus = 'Approved' | 'NeedsRevision' | 'Done'

// Mapping status untuk API (berdasarkan dokumentasi API)
export const StatusMapping = {
  NeedsRevision: 0,
  Approved: 1,
  Done: 2,
} as const

export const StatusFromNumber = {
  0: 'NeedsRevision',
  1: 'Approved',
  2: 'Done',
} as const

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
  // Method untuk mendapatkan content dokumen saat ini
  async getCurrentDocumentContent(documentId: string): Promise<string> {
    try {
      console.log('Fetching current document content for:', documentId)

      // Ambil data dokumen menggunakan document service
      const response = await fetch(
        `${API_BASE_URL}/documents/${documentId}?documentId=${documentId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        console.warn('Failed to fetch document, using fallback content')
        return `# Document ${documentId}

## Introduction

This is the current version of the document. Please review and provide your feedback.

## Content

Add your review content here...`
      }

      const documentData = await response.json()
      console.log('Document data fetched:', documentData)

      // Return savedContent dari document
      if (documentData.data && documentData.data.savedContent) {
        return documentData.data.savedContent
      } else if (documentData.savedContent) {
        return documentData.savedContent
      } else {
        // Fallback jika tidak ada savedContent
        return `# ${documentData.data?.title || documentData.title || 'Document'}

## Introduction

This is the current version of the document. Please review and provide your feedback.

## Content

Add your review content here...`
      }
    } catch (error) {
      console.error('Error fetching document content:', error)
      return `# Document Review

## Introduction

Unable to fetch current document content. Please add your review content below.

## Content

Add your review content here...`
    }
  },

  // Method untuk mendapatkan semua document bodies (versions) untuk dokumen
  async getDocumentBodies(documentId: string): Promise<DocumentBody[]> {
    try {
      console.log('Fetching document bodies for document:', documentId)

      const response = await fetch(`${API_BASE_URL}/document/${documentId}/versions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('Document versions response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Document versions error:', errorText)
        throw new Error('Gagal mengambil versi dokumen')
      }

      const responseData = await response.json()
      console.log('Document versions response:', responseData)

      // Handle API response format with "data" property
      let documentVersions: any[] = []
      if (responseData.data && Array.isArray(responseData.data)) {
        documentVersions = responseData.data
      } else if (Array.isArray(responseData)) {
        documentVersions = responseData
      } else {
        console.warn('Unexpected response format:', responseData)
        return []
      }

      // Map API response to DocumentBody interface
      const mappedVersions: DocumentBody[] = documentVersions.map((version: any) => ({
        id: version.id,
        comment: version.comment,
        content: version.content,
        createdAt: version.createdAt,
        documentId: version.fK_DocumentId || version.documentId,
        userCreatorId:
          version.fK_UserCreaotorId || version.fK_UserCreatorId || version.userCreatorId,
      }))

      console.log('Document versions fetched and mapped:', mappedVersions.length, 'versions')

      return mappedVersions
    } catch (error) {
      console.error('Error fetching document bodies:', error)
      throw error
    }
  },

  // Mengambil semua review untuk dokumen (versi dokumen)
  async getReviewsForDocument(documentId: string): Promise<StudentReview[]> {
    try {
      console.log('Getting reviews for document:', documentId)

      // Gunakan method khusus untuk fetch document bodies
      const documentVersions = await this.getDocumentBodies(documentId)

      if (!documentVersions.length) {
        console.log('No document versions found')
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
  async addReview(
    documentId: string,
    review: AddReviewForm,
    userCreatorId: string
  ): Promise<StudentReview> {
    try {
      console.log('Adding review with data:', { documentId, review, userCreatorId })

      // Buat versi dokumen baru dengan user ID yang authenticated
      const createVersionResponse = await fetch(
        `${API_BASE_URL}/document/${documentId}/version?userCreatorId=${userCreatorId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comment: review.studentComment,
            content: review.documentContent,
          }),
        }
      )

      console.log('Create version response status:', createVersionResponse.status)

      if (!createVersionResponse.ok) {
        const errorText = await createVersionResponse.text()
        console.error('Create version error:', errorText)
        throw new Error('Gagal menambahkan review')
      }

      const responseData = await createVersionResponse.json()
      console.log('Create version response data:', responseData)

      // Handle response format - might have 'data' wrapper or be direct object
      let documentBody: any
      if (responseData.data) {
        documentBody = responseData.data
      } else {
        documentBody = responseData
      }

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
