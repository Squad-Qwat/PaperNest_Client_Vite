import { API_BASE_URL, type ApiResponse, handleApiError } from './api'
import { getCurrentUser } from './auth.service'

// Citation type enum - matches backend integer values
export enum CitationType {
  Book = 0,
  JournalArticle = 1,
  Website = 2,
  ConferencePaper = 3,
  Thesis = 4,
}

// Helper function to get citation type display name
export const getCitationTypeDisplayName = (type: CitationType): string => {
  switch (type) {
    case CitationType.Book:
      return 'Book'
    case CitationType.JournalArticle:
      return 'Journal Article'
    case CitationType.Website:
      return 'Website'
    case CitationType.ConferencePaper:
      return 'Conference Paper'
    case CitationType.Thesis:
      return 'Thesis'
    default:
      return 'Unknown'
  }
}

// Helper function to get citation type from string
export const getCitationTypeFromString = (typeString: string): CitationType => {
  switch (typeString.toLowerCase()) {
    case 'book':
      return CitationType.Book
    case 'journal':
    case 'journal article':
    case 'journalarticle':
      return CitationType.JournalArticle
    case 'website':
      return CitationType.Website
    case 'conference':
    case 'conference paper':
    case 'conferencepaper':
      return CitationType.ConferencePaper
    case 'thesis':
      return CitationType.Thesis
    default:
      return CitationType.JournalArticle // Default fallback
  }
}

export interface Citation {
  id: string
  type: CitationType
  title: string
  author: string
  publicationInfo: string
  publicationDate: string
  accessDate: string
  DOI: string
  FK_DocumentId: string
}

export interface CreateCitationForm {
  type: CitationType
  title: string
  author: string
  publicationInfo: string
  publicationDate?: string
  accessDate?: string
  DOI?: string
}

const CitationsService = {
  // Helper method to ensure user is authenticated
  ensureAuthenticated(): string {
    const user = getCurrentUser()
    if (!user || !user.id) {
      throw new Error('User not authenticated. Please log in to manage citations.')
    }
    return user.id
  },

  // Mengambil semua sitasi untuk dokumen
  async getCitationsForDocument(documentId: string): Promise<Citation[]> {
    try {
      this.ensureAuthenticated() // Ensure user is authenticated

      console.log(`Fetching citations for document: ${documentId}`)
      const response = await fetch(`${API_BASE_URL}/citations/document/${documentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching citations: ${response.status} - ${errorText}`)
        throw new Error(`Failed to fetch citations: ${response.status}`)
      }

      const result: ApiResponse<Citation[]> = await response.json()
      console.log(`Successfully fetched ${result.data?.length || 0} citations`)
      return result.data || []
    } catch (error) {
      console.error(`Error fetching citations for document ${documentId}:`, error)
      throw error
    }
  },

  // Menambahkan sitasi ke dokumen
  async addCitation(documentId: string, citation: CreateCitationForm): Promise<Citation> {
    try {
      this.ensureAuthenticated() // Ensure user is authenticated

      console.log(`Adding citation to document: ${documentId}`, citation)

      const citationData = {
        type: citation.type, // Send enum integer value
        title: citation.title,
        author: citation.author,
        publicationInfo: citation.publicationInfo,
        FK_DocumentId: documentId,
        publicationDate: citation.publicationDate || '',
        accessDate: citation.accessDate || '',
        DOI: citation.DOI || '',
      }

      console.log('Citation data being sent to API:', citationData)

      const response = await fetch(`${API_BASE_URL}/citations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citationData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error adding citation: ${response.status} - ${errorText}`)
        throw new Error(`Failed to add citation: ${response.status}`)
      }

      const result: ApiResponse<Citation> = await response.json()
      console.log('Citation added successfully:', result.data)
      return result.data
    } catch (error) {
      console.error(`Error adding citation to document ${documentId}:`, error)
      throw error
    }
  },

  // Memperbarui sitasi
  async updateCitation(
    documentId: string,
    citationId: string,
    citation: Partial<CreateCitationForm>
  ): Promise<Citation> {
    try {
      this.ensureAuthenticated() // Ensure user is authenticated

      console.log(`Updating citation ${citationId} in document ${documentId}:`, citation)

      const response = await fetch(`${API_BASE_URL}/citations/${citationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citation),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error updating citation: ${response.status} - ${errorText}`)
        throw new Error(`Failed to update citation: ${response.status}`)
      }

      const result: ApiResponse<Citation> = await response.json()
      console.log('Citation updated successfully:', result.data)
      return result.data
    } catch (error) {
      console.error(`Error updating citation ${citationId}:`, error)
      throw error
    }
  },

  // Menghapus sitasi
  async deleteCitation(documentId: string, citationId: string): Promise<void> {
    try {
      this.ensureAuthenticated() // Ensure user is authenticated

      console.log(`Deleting citation ${citationId} from document ${documentId}`)

      const response = await fetch(`${API_BASE_URL}/citations/${citationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error deleting citation: ${response.status} - ${errorText}`)
        throw new Error(`Failed to delete citation: ${response.status}`)
      }

      console.log('Citation deleted successfully')
    } catch (error) {
      console.error(`Error deleting citation ${citationId}:`, error)
      throw error
    }
  },

  // Mendapatkan sitasi dalam format APA
  async getCitationApaFormat(citationId: string): Promise<string> {
    try {
      this.ensureAuthenticated() // Ensure user is authenticated

      console.log(`Fetching APA format for citation: ${citationId}`)

      const response = await fetch(`${API_BASE_URL}/citations/${citationId}/apa`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching APA format: ${response.status} - ${errorText}`)
        throw new Error(`Failed to get APA format: ${response.status}`)
      }

      const result: ApiResponse<string> = await response.json()
      console.log('APA format retrieved successfully')
      return result.data
    } catch (error) {
      console.error(`Error getting APA format for citation ${citationId}:`, error)
      throw error
    }
  },

  // Get citation by ID for editing
  async getCitationById(citationId: string): Promise<Citation> {
    try {
      this.ensureAuthenticated() // Ensure user is authenticated

      console.log(`Fetching citation by ID: ${citationId}`)

      const response = await fetch(`${API_BASE_URL}/citations/${citationId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching citation: ${response.status} - ${errorText}`)
        throw new Error(`Failed to fetch citation: ${response.status}`)
      }

      const result: ApiResponse<Citation> = await response.json()
      console.log('Citation retrieved successfully:', result.data)
      return result.data
    } catch (error) {
      console.error(`Error fetching citation ${citationId}:`, error)
      throw error
    }
  },
}

export default CitationsService
