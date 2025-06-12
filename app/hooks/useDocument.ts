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

      // Set content dari savedContent field
      if (docData.savedContent) {
        setContent(docData.savedContent)
      } else {
        // Fallback content jika tidak ada savedContent
        const sampleContent = `# ${docData.title || 'Sample Document'}

## Introduction

Start writing your document content here...

## Content

Add your main content in this section.

### Subsection

You can add subsections as needed.

## Conclusion

Summarize your document here.`

        setContent(sampleContent)
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      console.warn('Error fetching document, using fallback data:', errorMessage)

      // Check if it's a 404 error (document not found)
      const is404 = errorMessage.includes('404') || errorMessage.includes('not found')

      if (is404) {
        // For 404 errors, create a fallback document but don't set error state
        // This allows the user to still use the interface
        console.log('Document not found, creating fallback document')
        setDocument({
          id: documentId,
          title: 'New Document',
          savedContent: `# New Document

## Introduction

Welcome to your new document. Start writing your content here...

## Main Content

Add your main content in this section.

### Subsection

You can organize your content with subsections like this.

## Conclusion

Summarize your document here.

---

*This document was created automatically because the requested document was not found.*`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        setContent(`# New Document

## Introduction

Welcome to your new document. Start writing your content here...

## Main Content

Add your main content in this section.

### Subsection

You can organize your content with subsections like this.

## Conclusion

Summarize your document here.

---

*This document was created automatically because the requested document was not found.*`)

        // Don't set error for 404, let user interact normally
        setError(null)
      } else {
        // For other errors, show the error message
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const saveDocument = useCallback(
    async (newTitle?: string, newContent?: string) => {
      if (!documentId) return false

      try {
        setIsSaving(true)
        setError(null)

        // Gunakan title dan content yang diberikan, atau fallback ke state saat ini
        const titleToSave = newTitle !== undefined ? newTitle : document?.title || ''
        const contentToSave = newContent !== undefined ? newContent : content

        // Update dokumen menggunakan API PUT
        const updatedDocument = await DocumentService.updateDocument(documentId, {
          title: titleToSave,
          savedContent: contentToSave,
        })

        // Update local state
        setDocument(updatedDocument)
        setContent(contentToSave)

        return true // Berhasil
      } catch (err) {
        setError(handleApiError(err))
        return false // Gagal
      } finally {
        setIsSaving(false)
      }
    },
    [documentId, content, document?.title]
  )

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
