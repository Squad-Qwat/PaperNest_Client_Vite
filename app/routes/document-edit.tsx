import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { MDEditorClient } from '@/components/ui/md-editor-client'
import { Button } from '@/components/ui/button'
import { TopNavBar } from '@/components/ui/document-top-navbar'

interface DocumentData {
  id: string
  content: string
}

export default function DocumentEdit() {
  const { documentId } = useParams()
  const navigate = useNavigate()

  // State for document data
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // API Base URL - Adjust with your API URL
  const API_BASE_URL = 'https://your-api-url.com/api'

  // Fetch document data from API
  const fetchDocument = async () => {
    try {
      setIsLoading(true)
      // Example API call - adjust with your API endpoint
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // If using authentication
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch document')
      }
      const data: DocumentData = await response.json()
      setContent(data.content)
    } catch (error) {
      console.error('Error fetching document:', error)
      // Fallback to sample data for development
      setContent(`# Machine Learning in Healthcare: Current Applications and Future Perspectives

## Abstract

Machine learning (ML) has emerged as a transformative technology in healthcare, offering unprecedented opportunities to improve patient outcomes, streamline clinical workflows, and advance medical research. This comprehensive review examines the current state of ML applications in healthcare, discusses the challenges and limitations, and explores future directions for this rapidly evolving field.

## Introduction

Healthcare is experiencing a digital transformation driven by the exponential growth of medical data and advances in artificial intelligence. Machine learning, a subset of AI that enables computers to learn and make predictions from data without explicit programming, has shown remarkable potential in various healthcare domains.

## Current Applications

### 1. Diagnostic Imaging

ML algorithms have demonstrated exceptional performance in medical image analysis:

- **Radiology**: Deep learning models can detect abnormalities in X-rays, CT scans, and MRIs with accuracy comparable to or exceeding human radiologists
- **Pathology**: Computer vision systems can identify cancer cells in tissue samples, assisting pathologists in diagnosis
- **Ophthalmology**: AI systems can screen for diabetic retinopathy and other eye diseases from retinal photographs

### 2. Drug Discovery and Development

Machine learning is revolutionizing pharmaceutical research:

- **Target Identification**: ML algorithms analyze biological data to identify potential drug targets
- **Lead Optimization**: AI models predict molecular properties and optimize drug candidates
- **Clinical Trial Design**: ML helps identify suitable patient populations and predict trial outcomes

### 3. Personalized Medicine

ML enables tailored treatment approaches:

- **Genomic Analysis**: Algorithms analyze genetic data to predict disease risk and treatment response
- **Precision Oncology**: ML models help select optimal cancer treatments based on tumor characteristics
- **Pharmacogenomics**: AI predicts how patients will respond to specific medications

### 4. Electronic Health Records (EHR) Analysis

ML extracts valuable insights from clinical data:

- **Risk Prediction**: Models identify patients at risk of developing complications
- **Clinical Decision Support**: AI systems provide real-time recommendations to clinicians
- **Population Health Management**: ML analyzes large datasets to identify health trends and patterns

## Challenges and Limitations

Despite promising applications, several challenges remain:

### Data Quality and Availability

- **Data Standardization**: Need for consistent data formats across institutions
- **Privacy Concerns**: Balancing data utility with patient privacy
- **Bias in Training Data**: Ensuring diverse and representative datasets

### Regulatory and Ethical Issues

- **FDA Approval**: Navigating regulatory pathways for ML-based medical devices
- **Explainability**: Need for interpretable AI in clinical settings
- **Liability**: Determining responsibility when AI systems make errors

## Future Directions

The future of ML in healthcare is promising, with emerging trends including:

- **Federated Learning**: Training models across institutions without sharing raw data
- **Quantum Computing**: Potential for solving complex optimization problems
- **Digital Twins**: Virtual representations of patients for personalized medicine

## Conclusion

Machine learning represents a paradigm shift in healthcare, offering tools to improve diagnosis, treatment, and patient care. While challenges remain, continued advances in technology, regulations, and clinical integration will unlock the full potential of AI in medicine. The future of healthcare will likely be characterized by intelligent systems that augment human expertise and enable more precise, personalized, and effective medical care.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Save document to API
  const saveDocument = async () => {
    try {
      setIsSaving(true)
      const documentData = {
        id: documentId,
        content,
      }

      // Example API call - adjust with your API endpoint
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // If using authentication
        },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) {
        throw new Error('Failed to save document')
      }

      // Navigate back to document view after successful save
      navigate(`/document/${documentId}`)
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Error saving document. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Load document data on component mount
  useEffect(() => {
    if (documentId) {
      fetchDocument()
    }
  }, [documentId])

  const handleCancel = () => {
    navigate(`/document/${documentId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading document...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="container mx-auto py-8">
        <div className="">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4">Edit Document</h1>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={saveDocument} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Document'}
              </Button>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content</label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              {' '}
              <MDEditorClient
                value={content}
                onChange={(val) => setContent(val || '')}
                preview="edit"
                hideToolbar={false}
                visibleDragbar={false}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
