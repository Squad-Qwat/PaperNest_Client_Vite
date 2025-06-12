import { useState, useEffect, useCallback } from 'react'
import CitationsService, {
  type Citation,
  type CreateCitationForm,
  CitationType,
} from '../services/citations.service'
import { handleApiError } from '../services/api'
import { getCurrentUser } from '../services/auth.service'

export function useCitations(documentId: string | undefined) {
  const [citations, setCitations] = useState<Citation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apaFormats, setApaFormats] = useState<Record<string, string>>({})

  // Check user authentication
  const getCurrentUserId = useCallback(() => {
    const user = getCurrentUser()
    if (!user || !user.id) {
      throw new Error('User not authenticated. Please log in to manage citations.')
    }
    return user.id
  }, [])

  const fetchCitations = useCallback(async () => {
    if (!documentId) return

    try {
      setIsLoading(true)
      setError(null)

      // Check authentication before fetching
      getCurrentUserId()

      const data = await CitationsService.getCitationsForDocument(documentId)
      setCitations(data)

      // Fetch APA format for each citation
      const apaFormatPromises = data.map(async (citation) => {
        try {
          const apaFormat = await CitationsService.getCitationApaFormat(citation.id)
          return { id: citation.id, apaFormat }
        } catch (err) {
          console.warn(`Failed to get APA format for citation ${citation.id}:`, err)
          // Fallback to manual APA format
          return {
            id: citation.id,
            apaFormat: `${citation.author}. (${new Date(citation.publicationDate).getFullYear()}). ${citation.title}. ${citation.publicationInfo}.`,
          }
        }
      })

      const apaResults = await Promise.all(apaFormatPromises)
      const apaFormatsObj: Record<string, string> = {}
      apaResults.forEach((item) => {
        apaFormatsObj[item.id] = item.apaFormat
      })
      setApaFormats(apaFormatsObj)
    } catch (err) {
      console.error('Error fetching citations:', err)
      setError(handleApiError(err))

      // Fallback for development/demo purposes
      const sampleCitations: Citation[] = [
        {
          id: '1',
          type: CitationType.JournalArticle,
          title: 'Deep Learning for Health Informatics',
          author: 'Cao, C., Liu, F., Tan, H., et al.',
          publicationInfo: 'IEEE Journal of Biomedical and Health Informatics, 21(1), 4-21',
          publicationDate: '2017-01-15',
          accessDate: '2023-11-20',
          DOI: '10.1109/JBHI.2016.2636665',
          FK_DocumentId: documentId || '',
        },
        {
          id: '2',
          type: CitationType.JournalArticle,
          title:
            'Machine Learning for Healthcare: On the Verge of a Major Shift in Healthcare Epidemiology',
          author: 'Wiens, J., Shenoy, E.S.',
          publicationInfo: 'Clinical Infectious Diseases, 66(1), 149-153',
          publicationDate: '2018-01-06',
          accessDate: '2023-11-18',
          DOI: '10.1093/cid/cix731',
          FK_DocumentId: documentId || '',
        },
      ]
      setCitations(sampleCitations)

      // Fallback APA formats
      const fallbackApaFormats: Record<string, string> = {}
      sampleCitations.forEach((citation) => {
        fallbackApaFormats[citation.id] =
          `${citation.author} (${new Date(citation.publicationDate).getFullYear()}). ${citation.title}. ${citation.publicationInfo}. https://doi.org/${citation.DOI}`
      })
      setApaFormats(fallbackApaFormats)
    } finally {
      setIsLoading(false)
    }
  }, [documentId, getCurrentUserId])

  const addCitation = useCallback(
    async (citation: CreateCitationForm) => {
      if (!documentId) return null

      try {
        setIsSaving(true)
        setError(null)

        // Check authentication
        getCurrentUserId()

        const newCitation = await CitationsService.addCitation(documentId, citation)

        setCitations((prev) => [...prev, newCitation])

        // Get APA format for the new citation
        try {
          const apaFormat = await CitationsService.getCitationApaFormat(newCitation.id)
          setApaFormats((prev) => ({
            ...prev,
            [newCitation.id]: apaFormat,
          }))
        } catch (apaError) {
          console.warn('Failed to get APA format for new citation:', apaError)
          // Fallback APA format
          setApaFormats((prev) => ({
            ...prev,
            [newCitation.id]: `${newCitation.author} (${new Date(newCitation.publicationDate).getFullYear()}). ${newCitation.title}. ${newCitation.publicationInfo}.`,
          }))
        }

        return newCitation
      } catch (err) {
        console.error('Error adding citation:', err)
        setError(handleApiError(err))
        return null
      } finally {
        setIsSaving(false)
      }
    },
    [documentId, getCurrentUserId]
  )

  const updateCitation = useCallback(
    async (citationId: string, citation: Partial<CreateCitationForm>) => {
      if (!documentId) return false

      try {
        setIsSaving(true)
        setError(null)

        // Check authentication
        getCurrentUserId()

        const updatedCitation = await CitationsService.updateCitation(
          documentId,
          citationId,
          citation
        )

        setCitations((prev) => prev.map((c) => (c.id === citationId ? updatedCitation : c)))

        // Update APA format
        try {
          const apaFormat = await CitationsService.getCitationApaFormat(citationId)
          setApaFormats((prev) => ({
            ...prev,
            [citationId]: apaFormat,
          }))
        } catch (apaError) {
          console.warn('Failed to update APA format:', apaError)
          // Fallback APA format
          const citationToUpdate = citations.find((c) => c.id === citationId)
          if (citationToUpdate) {
            const author = citation.author || citationToUpdate.author
            const title = citation.title || citationToUpdate.title
            const pubInfo = citation.publicationInfo || citationToUpdate.publicationInfo
            const pubDate = citation.publicationDate || citationToUpdate.publicationDate

            setApaFormats((prev) => ({
              ...prev,
              [citationId]: `${author} (${new Date(pubDate).getFullYear()}). ${title}. ${pubInfo}.`,
            }))
          }
        }

        return true
      } catch (err) {
        console.error('Error updating citation:', err)
        setError(handleApiError(err))
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [documentId, citations, getCurrentUserId]
  )

  const deleteCitation = useCallback(
    async (citationId: string) => {
      if (!documentId) return false

      try {
        setIsSaving(true)
        setError(null)

        // Check authentication
        getCurrentUserId()

        await CitationsService.deleteCitation(documentId, citationId)

        setCitations((prev) => prev.filter((c) => c.id !== citationId))

        // Remove APA format
        setApaFormats((prev) => {
          const newFormats = { ...prev }
          delete newFormats[citationId]
          return newFormats
        })

        return true
      } catch (err) {
        console.error('Error deleting citation:', err)
        setError(handleApiError(err))
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [documentId, getCurrentUserId]
  )

  // Get citation by ID for editing
  const getCitationById = useCallback(
    async (citationId: string): Promise<Citation | null> => {
      try {
        getCurrentUserId()
        return await CitationsService.getCitationById(citationId)
      } catch (err) {
        console.error('Error fetching citation by ID:', err)
        setError(handleApiError(err))
        return null
      }
    },
    [getCurrentUserId]
  )

  useEffect(() => {
    if (documentId) {
      fetchCitations()
    }
  }, [documentId, fetchCitations])

  return {
    citations,
    apaFormats,
    isLoading,
    isSaving,
    error,
    fetchCitations,
    addCitation,
    updateCitation,
    deleteCitation,
    getCitationById,
  }
}
