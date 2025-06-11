import { API_BASE_URL, type ApiResponse, handleApiError } from './api'

export interface Citation {
  id: string
  type: string
  title: string
  author: string
  publicationInfo: string
  publicationDate: string
  accessDate: string
  DOI: string
  FK_DocumentId: string
}

const CitationsService = {
  // Mengambil semua sitasi untuk dokumen
  async getCitationsForDocument(documentId: string): Promise<Citation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/citations/document/${documentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Gagal mengambil sitasi: ${response.status}`)
      }

      const result: ApiResponse<Citation[]> = await response.json()
      return result.data
    } catch (error) {
      console.error(`Error mengambil sitasi untuk dokumen ${documentId}:`, error)
      throw error
    }
  },

  // Menambahkan sitasi ke dokumen
  async addCitation(documentId: string, citation: Omit<Citation, 'id'>): Promise<Citation> {
    try {
      const response = await fetch(`${API_BASE_URL}/citations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...citation,
          FK_DocumentId: documentId,
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal menambahkan sitasi')
      }

      const result: ApiResponse<Citation> = await response.json()
      return result.data
    } catch (error) {
      console.error(`Error menambahkan sitasi ke dokumen ${documentId}:`, error)
      throw error
    }
  },

  // Memperbarui sitasi
  async updateCitation(
    documentId: string,
    citationId: string,
    citation: Partial<Citation>
  ): Promise<Citation> {
    try {
      const response = await fetch(`${API_BASE_URL}/citations/${citationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citation),
      })

      if (!response.ok) {
        throw new Error('Gagal memperbarui sitasi')
      }

      const result: ApiResponse<Citation> = await response.json()
      return result.data
    } catch (error) {
      console.error(`Error memperbarui sitasi ${citationId}:`, error)
      throw error
    }
  },

  // Menghapus sitasi
  async deleteCitation(documentId: string, citationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/citations/${citationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus sitasi')
      }
    } catch (error) {
      console.error(`Error menghapus sitasi ${citationId}:`, error)
      throw error
    }
  },

  // Mendapatkan sitasi dalam format APA
  async getCitationApaFormat(citationId: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/citations/${citationId}/apa`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil format APA untuk sitasi')
      }

      const result: ApiResponse<string> = await response.json()
      return result.data
    } catch (error) {
      console.error(`Error mendapatkan format APA untuk sitasi ${citationId}:`, error)
      throw error
    }
  },
}

export default CitationsService
