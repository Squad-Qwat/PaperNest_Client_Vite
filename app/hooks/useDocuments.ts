import { useState, useEffect, useCallback } from 'react'
import DocumentService, { type Document } from '../services/document.service'
import { handleApiError } from '../services/api'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await DocumentService.getDocuments()
      setDocuments(data)
    } catch (err) {
      setError(handleApiError(err))

      // Fallback untuk development dengan sample data
      const sampleDocuments: Document[] = [
        {
          id: '1',
          title: 'Machine Learning in Healthcare: A Comprehensive Review',
          createdAt: '2024-01-03T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
        },
        {
          id: '2',
          title: 'Artificial Intelligence Ethics in Modern Healthcare',
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-20T16:30:00Z',
        },
        // Tambahkan sample data lain sesuai kebutuhan
      ]
      setDocuments(sampleDocuments)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createDocument = useCallback(async (documentData: Partial<Document>) => {
    try {
      const newDocument = await DocumentService.createDocument(documentData)
      setDocuments((prev) => [newDocument, ...prev])
      return newDocument
    } catch (err) {
      setError(handleApiError(err))
      throw err
    }
  }, [])

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      await DocumentService.deleteDocument(documentId)
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    } catch (err) {
      setError(handleApiError(err))
      throw err
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    createDocument,
    deleteDocument,
  }
}
