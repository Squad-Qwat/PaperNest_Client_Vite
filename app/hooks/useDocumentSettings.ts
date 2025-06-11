import { useState, useEffect, useCallback } from 'react'
import DocumentService, { type DocumentSettings } from '../services/document.service'
import { handleApiError } from '../services/api'

export function useDocumentSettings(documentId: string | undefined) {
  const [settings, setSettings] = useState<DocumentSettings>({
    id: documentId || '',
    title: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    if (!documentId) return

    try {
      setIsLoading(true)
      setError(null)

      const data = await DocumentService.getDocumentSettings(documentId)
      setSettings(data)
    } catch (err) {
      setError(handleApiError(err))

      // Fallback untuk development
      setSettings({
        id: documentId,
        title: 'Machine Learning in Healthcare: A Comprehensive Review',
      })
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  const updateSettings = useCallback((newSettings: Partial<DocumentSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  const saveSettings = useCallback(async () => {
    if (!documentId) return false

    try {
      setIsSaving(true)
      setError(null)

      await DocumentService.updateDocumentSettings(documentId, settings)
      return true // Berhasil
    } catch (err) {
      setError(handleApiError(err))
      return false // Gagal
    } finally {
      setIsSaving(false)
    }
  }, [documentId, settings])

  const deleteDocument = useCallback(async () => {
    if (!documentId) return false

    try {
      setIsLoading(true)
      setError(null)

      await DocumentService.deleteDocument(documentId)
      return true // Berhasil
    } catch (err) {
      setError(handleApiError(err))
      return false // Gagal
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  useEffect(() => {
    if (documentId) {
      fetchSettings()
    }
  }, [documentId, fetchSettings])

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSettings,
    saveSettings,
    deleteDocument,
  }
}
