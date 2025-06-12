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

      console.log('Fetching document settings for:', documentId)

      // Gunakan getDocumentById dari DocumentService
      const documentData = await DocumentService.getDocumentById(documentId)

      const settings: DocumentSettings = {
        id: documentData.id,
        title: documentData.title,
      }

      console.log('Document settings loaded:', settings)
      setSettings(settings)
    } catch (err) {
      console.error('Error fetching document settings:', err)
      setError(handleApiError(err))

      // Fallback untuk development
      setSettings({
        id: documentId,
        title: 'Sample Document Title',
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

      console.log('Saving document settings:', settings)

      // Get current document to preserve savedContent
      const currentDocument = await DocumentService.getDocumentById(documentId)

      const updateData = {
        title: settings.title,
        savedContent: currentDocument.savedContent || '', // Preserve existing content
      }

      await DocumentService.updateDocument(documentId, updateData)
      console.log('Document settings saved successfully')

      return true // Berhasil
    } catch (err) {
      console.error('Error saving document settings:', err)
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
    fetchSettings, // Export this for manual refresh if needed
  }
}
