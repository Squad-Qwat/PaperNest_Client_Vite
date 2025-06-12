import { API_BASE_URL, type ApiResponse, handleApiError } from './api'

export interface Document {
  id: string
  title: string
  savedContent?: string
  description?: string
  createdAt: string
  updatedAt: string
  userId?: string
  workspaceId?: string
  fK_WorkspaceId?: string // API format
}

export interface CreateDocumentRequest {
  title: string
  savedContent?: string
  fK_WorkspaceId: string
}

export interface UpdateDocumentRequest {
  title: string
  savedContent: string
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

  // Mengambil dokumen berdasarkan workspace ID
  async getDocumentsByWorkspace(workspaceId: string): Promise<Document[]> {
    try {
      console.log('Fetching documents for workspace:', workspaceId)

      const response = await fetch(`${API_BASE_URL}/documents/workspace/${workspaceId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Gagal mengambil dokumen workspace: ${response.status}`)
      }

      const result: ApiResponse<Document[]> = await response.json()
      console.log('Documents fetched for workspace:', result.data)
      return result.data
    } catch (error) {
      console.error(`Error mengambil dokumen workspace ${workspaceId}:`, error)
      throw error
    }
  },

  // Mengambil dokumen berdasarkan ID
  async getDocumentById(id: string): Promise<Document> {
    try {
      console.log('Fetching document by ID:', id)

      const response = await fetch(`${API_BASE_URL}/documents/${id}?documentId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('Document fetch response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Document fetch error response:', errorText)
        throw new Error(`Gagal mengambil dokumen: ${response.status}`)
      }

      const result: ApiResponse<Document> = await response.json()
      console.log('Document fetched successfully:', result)
      return result.data
    } catch (error) {
      console.error(`Error mengambil dokumen ${id}:`, error)
      throw error
    }
  },

  // Membuat dokumen baru
  async createDocument(data: Partial<Document>): Promise<Document> {
    try {
      // Format sesuai API documentation
      const createRequest: CreateDocumentRequest = {
        title: data.title || 'New Document',
        savedContent: data.savedContent || '',
        fK_WorkspaceId: data.workspaceId || data.fK_WorkspaceId || '',
      }

      console.log('Creating document with request:', createRequest)

      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createRequest),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create document error response:', errorText)
        throw new Error(`Gagal membuat dokumen: ${response.status}`)
      }

      const result: ApiResponse<Document> = await response.json()
      console.log('Document created successfully:', result)
      return result.data
    } catch (error) {
      console.error('Error membuat dokumen:', error)
      throw error
    }
  },

  // Memperbarui dokumen
  async updateDocument(
    id: string,
    data: { title?: string; savedContent?: string }
  ): Promise<Document> {
    try {
      // Format sesuai API documentation - hanya title dan savedContent
      const updateRequest: UpdateDocumentRequest = {
        title: data.title || '',
        savedContent: data.savedContent || '',
      }

      console.log('Updating document with request:', updateRequest)

      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateRequest),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update document error response:', errorText)
        throw new Error(`Gagal memperbarui dokumen: ${response.status}`)
      }

      const result: ApiResponse<Document> = await response.json()
      console.log('Document updated successfully:', result)
      return result.data
    } catch (error) {
      console.error(`Error memperbarui dokumen ${id}:`, error)
      throw error
    }
  },

  // Menghapus dokumen
  async deleteDocument(id: string): Promise<void> {
    try {
      console.log(`Deleting document with ID: ${id}`)

      // Format sesuai dengan API: DELETE /api/documents/{id}?documentId={documentId}
      const response = await fetch(`${API_BASE_URL}/documents/${id}?documentId=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error deleting document: ${response.status} - ${errorText}`)
        throw new Error(`Gagal menghapus dokumen: ${response.status}`)
      }

      console.log('Document deleted successfully')
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
