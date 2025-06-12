import { useState, useEffect, useCallback } from 'react'
import DocumentService, { type Document } from '../services/document.service'
import { handleApiError } from '../services/api'
import { getCurrentUser } from '../services/auth.service'

export function useDocuments(workspaceId?: string) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      let data: Document[]

      if (workspaceId) {
        // Fetch documents for specific workspace
        console.log('Fetching documents for workspace:', workspaceId)
        data = await DocumentService.getDocumentsByWorkspace(workspaceId)
      } else {
        // Fetch all documents if no workspace specified
        console.log('Fetching all documents')
        data = await DocumentService.getDocuments()
      }

      console.log('Documents fetched:', data)
      setDocuments(data)
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError(handleApiError(err))

      // Fallback untuk development dengan sample data
      const sampleDocuments: Document[] = [
        {
          id: '1',
          title: 'Machine Learning in Healthcare: A Comprehensive Review',
          savedContent: 'Lorem ipsum dolor sit amet...',
          createdAt: '2024-01-03T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          workspaceId: workspaceId || '1', // Assign to current workspace
        },
        {
          id: '2',
          title: 'Artificial Intelligence Ethics in Modern Healthcare',
          savedContent: 'Consectetur adipiscing elit...',
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-20T16:30:00Z',
          workspaceId: workspaceId || '1', // Assign to current workspace
        },
        {
          id: '3',
          title: 'Deep Learning Approaches in Medical Diagnosis',
          savedContent: 'Sed do eiusmod tempor incididunt...',
          createdAt: '2024-01-10T11:45:00Z',
          updatedAt: '2024-01-22T09:30:00Z',
          workspaceId: workspaceId || '1', // Assign to current workspace
        },
      ]

      // Filter by workspace if specified
      const filteredDocuments = workspaceId
        ? sampleDocuments.filter((doc) => doc.workspaceId === workspaceId)
        : sampleDocuments

      setDocuments(filteredDocuments)
    } finally {
      setIsLoading(false)
    }
  }, [workspaceId])

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
