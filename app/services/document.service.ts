import { API_BASE_URL, type ApiResponse, handleApiError } from './api'

export interface Document {
  id: string
  title: string
  content?: string
  description?: string
  createdAt: string
  updatedAt: string
  userId?: string
  workspaceId?: string
}

export interface DocumentSettings {
  id: string
  title: string
  description?: string
}

export interface DocumentVersion {
  id: string
  comment: string
  content: string
  createdAt: string
  documentId: string
  userCreatorId: string
}

const DocumentService = {
  // Mengambil semua dokumen
  async getDocuments(): Promise<Document[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Gagal mengambil dokumen: ${response.status}`)
      }

      const result: ApiResponse<Document[]> = await response.json()
      return result.data
    } catch (error) {
      console.error('Error pada getDocuments:', error)
      throw error
    }
  },

  // Mengambil dokumen berdasarkan ID
  async getDocumentById(id: string): Promise<Document> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Gagal mengambil dokumen: ${response.status}`)
      }

      const result: ApiResponse<Document> = await response.json()
      return result.data
    } catch (error) {
      console.error(`Error mengambil dokumen ${id}:`, error)
      throw error
    }
  },

  // Membuat dokumen baru
  async createDocument(data: Partial<Document>): Promise<Document> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title || 'Dokumen Baru',
          description: data.description || '',
          userId: data.userId,
          workspaceId: data.workspaceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat dokumen')
      }

      const result: ApiResponse<Document> = await response.json()
      return result.data
    } catch (error) {
      console.error('Error membuat dokumen:', error)
      throw error
    }
  },

  // Memperbarui dokumen
  async updateDocument(id: string, data: Partial<Document>): Promise<Document> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Gagal memperbarui dokumen')
      }

      const result: ApiResponse<Document> = await response.json()
      return result.data
    } catch (error) {
      console.error(`Error memperbarui dokumen ${id}:`, error)
      throw error
    }
  },

  // Menghapus dokumen
  async deleteDocument(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus dokumen')
      }
    } catch (error) {
      console.error(`Error menghapus dokumen ${id}:`, error)
      throw error
    }
  },

  // Mengambil versi dokumen terakhir
  async getDocumentContent(id: string): Promise<DocumentVersion> {
    try {
      const response = await fetch(`${API_BASE_URL}/document/${id}/version/current`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil konten dokumen')
      }

      return await response.json()
    } catch (error) {
      console.error(`Error mengambil konten untuk dokumen ${id}:`, error)
      throw error
    }
  },

  // Menyimpan versi dokumen baru
  async saveDocumentContent(
    id: string,
    content: string,
    userCreatorId: string
  ): Promise<DocumentVersion> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/document/${id}/version?userCreatorId=${userCreatorId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comment: 'Pembaruan dokumen',
            content: content,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Gagal menyimpan konten dokumen')
      }

      return await response.json()
    } catch (error) {
      console.error(`Error menyimpan konten untuk dokumen ${id}:`, error)
      throw error
    }
  },

  // Mengambil pengaturan dokumen
  async getDocumentSettings(id: string): Promise<DocumentSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil pengaturan dokumen')
      }

      const result: ApiResponse<Document> = await response.json()

      // Konversi hasil ke DocumentSettings
      const settings: DocumentSettings = {
        id: result.data.id,
        title: result.data.title,
        description: result.data.description,
      }

      return settings
    } catch (error) {
      console.error(`Error mengambil pengaturan untuk dokumen ${id}:`, error)
      throw error
    }
  },

  // Memperbarui pengaturan dokumen
  async updateDocumentSettings(id: string, settings: DocumentSettings): Promise<DocumentSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: settings.title,
          description: settings.description,
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal memperbarui pengaturan dokumen')
      }

      const result: ApiResponse<Document> = await response.json()

      // Konversi hasil ke DocumentSettings
      const updatedSettings: DocumentSettings = {
        id: result.data.id,
        title: result.data.title,
        description: result.data.description,
      }

      return updatedSettings
    } catch (error) {
      console.error(`Error memperbarui pengaturan untuk dokumen ${id}:`, error)
      throw error
    }
  },

  // Mengambil semua versi dokumen
  async getDocumentVersions(id: string): Promise<DocumentVersion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/document/${id}/versions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil versi dokumen')
      }

      return await response.json()
    } catch (error) {
      console.error(`Error mengambil versi untuk dokumen ${id}:`, error)
      throw error
    }
  },
}

export default DocumentService
