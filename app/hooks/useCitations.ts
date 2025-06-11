import { useState, useEffect, useCallback } from 'react'
import CitationsService, { type Citation } from '../services/citations.service'
import { handleApiError } from '../services/api'

export function useCitations(documentId: string | undefined) {
  const [citations, setCitations] = useState<Citation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apaFormats, setApaFormats] = useState<Record<string, string>>({})

  const fetchCitations = useCallback(async () => {
    if (!documentId) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await CitationsService.getCitationsForDocument(documentId)
      setCitations(data)

      // Ambil format APA untuk setiap sitasi
      const apaFormatPromises = data.map(async (citation) => {
        try {
          const apaFormat = await CitationsService.getCitationApaFormat(citation.id)
          return { id: citation.id, apaFormat }
        } catch (err) {
          return {
            id: citation.id,
            apaFormat: `${citation.author}. (${citation.publicationDate}). ${citation.title}. ${citation.publicationInfo}.`,
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
      setError(handleApiError(err))

      // Fallback untuk development
      const sampleCitations: Citation[] = [
        {
          id: '1',
          type: 'Journal',
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
          type: 'Journal',
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

      // Fallback untuk APA format
      const fallbackApaFormats: Record<string, string> = {}
      sampleCitations.forEach((citation) => {
        fallbackApaFormats[citation.id] =
          `${citation.author} (${new Date(citation.publicationDate).getFullYear()}). ${citation.title}. ${citation.publicationInfo}. https://doi.org/${citation.DOI}`
      })
      setApaFormats(fallbackApaFormats)
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  const addCitation = useCallback(
    async (citation: Omit<Citation, 'id'>) => {
      if (!documentId) return null

      try {
        setIsSaving(true)
        setError(null)

        const newCitation = await CitationsService.addCitation(documentId, citation)

        setCitations((prev) => [...prev, newCitation])

        // Get APA format
        try {
          const apaFormat = await CitationsService.getCitationApaFormat(newCitation.id)
          setApaFormats((prev) => ({
            ...prev,
            [newCitation.id]: apaFormat,
          }))
        } catch (err) {
          // Fallback untuk APA format
          setApaFormats((prev) => ({
            ...prev,
            [newCitation.id]: `${newCitation.author} (${new Date(newCitation.publicationDate).getFullYear()}). ${newCitation.title}. ${newCitation.publicationInfo}.`,
          }))
        }

        return newCitation
      } catch (err) {
        setError(handleApiError(err))
        return null
      } finally {
        setIsSaving(false)
      }
    },
    [documentId]
  )

  const updateCitation = useCallback(
    async (citationId: string, citation: Partial<Citation>) => {
      if (!documentId) return false

      try {
        setIsSaving(true)
        setError(null)

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
        } catch (err) {
          // Fallback untuk APA format jika gagal
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

        return true // Berhasil
      } catch (err) {
        setError(handleApiError(err))
        return false // Gagal
      } finally {
        setIsSaving(false)
      }
    },
    [documentId, citations]
  )

  const deleteCitation = useCallback(
    async (citationId: string) => {
      if (!documentId) return false

      try {
        setIsSaving(true)
        setError(null)

        await CitationsService.deleteCitation(documentId, citationId)

        setCitations((prev) => prev.filter((c) => c.id !== citationId))

        // Hapus format APA juga
        setApaFormats((prev) => {
          const newFormats = { ...prev }
          delete newFormats[citationId]
          return newFormats
        })

        return true // Berhasil
      } catch (err) {
        setError(handleApiError(err))
        return false // Gagal
      } finally {
        setIsSaving(false)
      }
    },
    [documentId]
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
  }
}
