import { useState, useEffect, useCallback } from 'react'
import DocumentService, { type Document, type DocumentVersion } from '../services/document.service'
import { handleApiError } from '../services/api'

export function useDocument(documentId: string | undefined, userId?: string) {
  const [document, setDocument] = useState<Document | null>(null)
  const [documentVersion, setDocumentVersion] = useState<DocumentVersion | null>(null)
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocument = useCallback(async () => {
    if (!documentId) return

    try {
      setIsLoading(true)
      setError(null)

      // Fetch dokumen metadata
      const docData = await DocumentService.getDocumentById(documentId)
      setDocument(docData)

      // Fetch konten dokumen (versi terbaru)
      try {
        const versionData = await DocumentService.getDocumentContent(documentId)
        setDocumentVersion(versionData)
        setContent(versionData.content || '')
      } catch (err) {
        console.error('Error mengambil konten dokumen:', err)

        // Fallback untuk development
        const sampleContent = `# Machine Learning in Healthcare: Current Applications and Future Perspectives

## Abstract

Machine learning (ML) has emerged as a transformative technology in healthcare, offering unprecedented opportunities to improve patient outcomes, streamline clinical workflows, and advance medical research. This comprehensive review examines the current state of ML applications in healthcare, discusses the challenges and limitations, and explores future directions for this rapidly evolving field.

## Introduction

Healthcare is experiencing a digital transformation driven by the exponential growth of medical data and advances in artificial intelligence. Machine learning, a subset of AI that enables computers to learn and make predictions from data without explicit programming, has shown remarkable potential in various healthcare domains.`

        setContent(sampleContent)
      }
    } catch (err) {
      setError(handleApiError(err))

      // Fallback untuk development jika dokumen tidak ditemukan
      setDocument({
        id: documentId,
        title: 'Sample Document',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const sampleContent = `# Machine Learning in Healthcare: Current Applications and Future Perspectives

## Abstract

Machine learning (ML) has emerged as a transformative technology in healthcare, offering unprecedented opportunities to improve patient outcomes, streamline clinical workflows, and advance medical research. This comprehensive review examines the current state of ML applications in healthcare, discusses the challenges and limitations, and explores future directions for this rapidly evolving field.

## Introduction

Healthcare is experiencing a digital transformation driven by the exponential growth of medical data and advances in artificial intelligence. Machine learning, a subset of AI that enables computers to learn and make predictions from data without explicit programming, has shown remarkable potential in various healthcare domains.`

      setContent(sampleContent)
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const saveDocument = useCallback(async () => {
    if (!documentId || !userId) return false

    try {
      setIsSaving(true)
      setError(null)

      // Simpan konten dokumen sebagai versi baru
      await DocumentService.saveDocumentContent(documentId, content, userId)
      return true // Berhasil
    } catch (err) {
      setError(handleApiError(err))
      return false // Gagal
    } finally {
      setIsSaving(false)
    }
  }, [documentId, content, userId])

  useEffect(() => {
    if (documentId) {
      fetchDocument()
    }
  }, [documentId, fetchDocument])

  return {
    document,
    documentVersion,
    content,
    isLoading,
    isSaving,
    error,
    updateContent,
    saveDocument,
  }
}
