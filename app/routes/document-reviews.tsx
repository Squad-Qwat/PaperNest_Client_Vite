import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Route } from './+types/document-reviews'
import { TopNavBar } from '@/components/ui/document-top-navbar'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Calendar,
  User,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react'

type ReviewStatus = 'Approved' | 'NeedsRevision' | 'Done'

interface StudentReview {
  id: string
  studentName: string
  studentComment: string
  submittedDate: string
  documentContent: string
  dosenReview?: {
    dosenName: string
    comment: string
    status: ReviewStatus
    reviewedDate: string
  } | null
}

interface AddReviewForm {
  studentName: string
  studentComment: string
  documentContent: string
}

export function meta({ params }: Route['MetaArgs']) {
  return [
    { title: `PaperNest - Document ${params.documentId} - Reviews` },
    { name: 'description', content: 'Manage reviews for your document in PaperNest' },
  ]
}

export default function DocumentReviews({ params }: Route['ComponentProps']) {
  const { documentId } = params
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Reviews')
  const [reviews, setReviews] = useState<StudentReview[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<AddReviewForm>({
    studentName: '',
    studentComment: '',
    documentContent: '',
  })

  // API Base URL - Adjust with your API URL
  const API_BASE_URL = 'https://your-api-url.com/api'

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      // Example API call - adjust with your API endpoint
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // If using authentication
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error) // Fallback to sample data for development
      setReviews([
        {
          id: '1',
          studentName: 'Ahmad Rizki',
          studentComment:
            'Saya telah menyelesaikan penelitian tentang machine learning dalam healthcare. Mohon review untuk metodologi dan hasil analisis yang saya lakukan. Terima kasih.',
          submittedDate: '2024-03-10T10:30:00Z',
          documentContent: `# Machine Learning dalam Healthcare

## Abstract
Penelitian ini mengkaji implementasi machine learning dalam sistem healthcare untuk meningkatkan akurasi diagnosis dan efisiensi pelayanan medis.

## Pendahuluan
Machine learning telah menjadi teknologi yang sangat penting dalam transformasi digital sektor healthcare. Dengan kemampuan untuk menganalisis data dalam jumlah besar dan mengidentifikasi pola-pola kompleks, machine learning dapat membantu:

- Diagnosis penyakit yang lebih akurat
- Prediksi risiko kesehatan
- Personalisasi pengobatan
- Optimalisasi alur kerja rumah sakit

## Metodologi
### Dataset
- Data pasien dari 3 rumah sakit besar
- 10,000 rekam medis elektronik
- Periode pengumpulan: 2020-2023

### Algoritma
1. **Random Forest** untuk klasifikasi diagnosis
2. **Neural Network** untuk prediksi risiko
3. **SVM** untuk analisis citra medis

## Hasil dan Pembahasan
Implementasi machine learning menunjukkan peningkatan akurasi diagnosis sebesar 15% dibandingkan metode konvensional.

## Kesimpulan
Machine learning terbukti efektif dalam meningkatkan kualitas pelayanan healthcare.`,
          dosenReview: {
            dosenName: 'Dr. Sarah Johnson',
            comment:
              'Penelitian sudah baik, namun perlu perbaikan pada bagian metodologi. Silakan tambahkan lebih banyak referensi terkini dan perbaiki analisis statistik.',
            status: 'NeedsRevision',
            reviewedDate: '2024-03-12T14:20:00Z',
          },
        },
        {
          id: '2',
          studentName: 'Siti Nurhaliza',
          studentComment:
            'Draft tesis saya sudah selesai. Mohon review untuk keseluruhan struktur dan konten. Saya sudah merevisi berdasarkan masukan sebelumnya.',
          submittedDate: '2024-03-08T14:20:00Z',
          documentContent: `# Analisis Sentimen Media Sosial

## Latar Belakang
Media sosial telah menjadi platform utama untuk ekspresi opini publik. Analisis sentimen dapat membantu memahami persepsi masyarakat terhadap berbagai topik.

## Tujuan Penelitian
- Mengembangkan model analisis sentimen yang akurat
- Menganalisis tren sentimen pada platform Twitter
- Mengidentifikasi faktor-faktor yang mempengaruhi sentimen publik

## Metodologi
### Pengumpulan Data
- 100,000 tweet dari Twitter API
- Preprocessing: cleaning, tokenization, stemming
- Labeling sentimen: positif, negatif, netral

### Model
- **LSTM** untuk sequence modeling
- **BERT** untuk contextual understanding
- **Ensemble method** untuk kombinasi model

## Hasil
Model ensemble mencapai akurasi 89.5% pada dataset testing.

## Kontribusi
1. Model analisis sentimen dengan akurasi tinggi
2. Dataset sentimen Bahasa Indonesia yang besar
3. Framework untuk monitoring sentimen real-time`,
          dosenReview: {
            dosenName: 'Prof. Michael Chen',
            comment:
              'Excellent work! Tesis sudah sangat baik dan siap untuk ujian. Semua revisi sudah sesuai dengan yang diminta.',
            status: 'Approved',
            reviewedDate: '2024-03-10T09:15:00Z',
          },
        },
        {
          id: '3',
          studentName: 'Budi Santoso',
          studentComment:
            'Ini adalah pengajuan review terbaru untuk bab 4 dan 5 tesis saya. Mohon feedback terkait analisis data dan pembahasan hasil penelitian.',
          submittedDate: '2024-03-15T09:15:00Z',
          documentContent: `# Sistem Rekomendasi E-Commerce

## Bab 4: Implementasi Sistem

### 4.1 Arsitektur Sistem
Sistem rekomendasi yang dikembangkan menggunakan arsitektur microservices dengan komponen:

- **Data Processing Service**: Mengolah data transaksi dan profil pengguna
- **ML Model Service**: Menjalankan algoritma collaborative filtering dan content-based filtering
- **API Gateway**: Mengelola request dan response
- **Caching Layer**: Redis untuk mempercepat response time

### 4.2 Algoritma Rekomendasi
#### Collaborative Filtering
- Matrix Factorization menggunakan SVD
- User-based dan Item-based filtering
- Handling cold start problem dengan content-based approach

#### Content-Based Filtering
- TF-IDF untuk representasi produk
- Cosine similarity untuk mencari produk serupa
- Feature engineering dari kategori, harga, dan rating

### 4.3 Evaluasi Model
- **Precision@K**: 0.75 untuk K=10
- **Recall@K**: 0.68 untuk K=10
- **NDCG**: 0.82
- **Coverage**: 85% produk mendapat rekomendasi

## Bab 5: Hasil dan Pembahasan

### 5.1 Analisis Performa
Sistem menunjukkan peningkatan engagement rate sebesar 23% dan conversion rate sebesar 18% dibandingkan sistem sebelumnya.

### 5.2 A/B Testing
Testing dilakukan selama 3 bulan dengan 10,000 pengguna menunjukkan:
- Peningkatan click-through rate: 15%
- Peningkatan purchase rate: 12%
- Peningkatan user session duration: 20%

### 5.3 Limitasi
- Cold start problem untuk pengguna baru
- Computational complexity untuk real-time recommendation
- Data sparsity pada long-tail products`,
          dosenReview: null, // Latest submission, belum ada review dari dosen
        },
        {
          id: '4',
          studentName: 'Dewi Permatasari',
          studentComment:
            'Telah melakukan revisi sesuai saran. Mohon review ulang untuk bagian yang sudah diperbaiki.',
          submittedDate: '2024-03-14T16:45:00Z',
          documentContent: `# Blockchain untuk Supply Chain Management

## Abstract
Penelitian ini mengusulkan implementasi teknologi blockchain untuk meningkatkan transparansi dan traceability dalam supply chain management.

## Pendahuluan
Supply chain modern menghadapi tantangan dalam hal:
- Transparansi informasi
- Keaslian produk
- Traceability dari produsen ke konsumen
- Trust antar stakeholder

Blockchain dapat mengatasi masalah-masalah tersebut dengan:
- Immutable ledger
- Smart contracts
- Decentralized verification
- Real-time tracking

## Metodologi
### Desain Blockchain
- **Platform**: Hyperledger Fabric
- **Consensus**: Practical Byzantine Fault Tolerance (PBFT)
- **Smart Contract**: Chaincode untuk business logic

### Use Case
Implementasi pada supply chain produk makanan organik dengan stakeholder:
- Petani
- Distributor
- Retailer
- Konsumen
- Badan sertifikasi

### Metrics
- Transaction throughput
- Latency
- Storage efficiency
- User adoption rate

## Hasil
- Peningkatan transparansi: 95%
- Reduction in fraud: 78%
- Faster dispute resolution: 60%
- Consumer trust improvement: 85%

## Kesimpulan
Blockchain terbukti efektif dalam meningkatkan transparansi dan trust dalam supply chain management.`,
          dosenReview: {
            dosenName: 'Dr. Emily Rodriguez',
            comment:
              'Revisi sudah selesai dengan baik. Penelitian sudah memenuhi standar dan siap untuk tahap selanjutnya.',
            status: 'Done',
            reviewedDate: '2024-03-16T11:30:00Z',
          },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }
  // Add new review
  const handleAddReview = async () => {
    if (!formData.studentName || !formData.studentComment || !formData.documentContent) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsSaving(true)
      // Example API call to add review
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // If using authentication
        },
        body: JSON.stringify({
          studentName: formData.studentName,
          studentComment: formData.studentComment,
          documentContent: formData.documentContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add review')
      }

      const newReview = await response.json()
      setReviews((prev) => [...prev, newReview])

      // Reset form
      setFormData({
        studentName: '',
        studentComment: '',
        documentContent: '',
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding review:', error)
      // Fallback for development - add review locally
      const newReview: StudentReview = {
        id: Date.now().toString(),
        studentName: formData.studentName,
        studentComment: formData.studentComment,
        submittedDate: new Date().toISOString(),
        documentContent: formData.documentContent,
        dosenReview: null,
      }
      setReviews((prev) => [...prev, newReview])
      setFormData({
        studentName: '',
        studentComment: '',
        documentContent: '',
      })
      setShowAddForm(false)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [documentId])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'Overview':
        navigate(`/document/${documentId}`)
        break
      case 'Citations':
        navigate(`/document/${documentId}/citations`)
        break
      case 'Reviews':
        // Already on reviews page
        break
      case 'Settings':
        navigate(`/document/${documentId}/settings`)
        break
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const getStatusIcon = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'NeedsRevision':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'Done':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'NeedsRevision':
        return 'bg-red-100 text-red-800'
      case 'Done':
        return 'bg-blue-100 text-blue-800'
    }
  }

  const selectedReview = reviews.find((r) => r.id === showDetailModal)
  const selectedDocumentReview = reviews.find((r) => r.id === showDocumentModal)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="px-6 py-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Reviews</h1>
              <span className="text-sm text-gray-500">{reviews.length} reviews</span>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to submit a review for this document.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-gray-900">{review.studentName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(review.submittedDate)}</span>
                        </div>
                        {review.dosenReview && (
                          <div className="flex items-center gap-2">
                            {getStatusIcon(review.dosenReview.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.dosenReview.status)}`}
                            >
                              {review.dosenReview.status}
                            </span>
                          </div>
                        )}
                        {!review.dosenReview && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending Review
                            </span>
                          </div>
                        )}
                      </div>{' '}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDocumentModal(review.id)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Lihat Dokumen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetailModal(review.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Student Comment:</h4>
                    <p className="text-gray-700 leading-relaxed">{review.studentComment}</p>
                  </div>

                  {review.dosenReview && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">Dosen Review:</span>
                        <span className="text-sm text-gray-600">
                          {review.dosenReview.dosenName}
                        </span>
                        <span className="text-sm text-gray-500">
                          • {formatDate(review.dosenReview.reviewedDate)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.dosenReview.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          <Plus className="h-6 w-6" />
        </button>
        {/* Add Review Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit New Review</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Mahasiswa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, studentName: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter student name"
                    />
                  </div>{' '}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.studentComment}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, studentComment: e.target.value }))
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Enter your review comment..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Content (Markdown) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.documentContent}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, documentContent: e.target.value }))
                      }
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                      placeholder="Enter document content in markdown format..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddReview}
                    disabled={isSaving}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSaving ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Detail Modal */}
        {showDetailModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Review Details</h2>
                  <Button variant="outline" onClick={() => setShowDetailModal(null)} size="sm">
                    Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Student Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Student Submission</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-gray-900">
                            {selectedReview.studentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(selectedReview.submittedDate)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedReview.studentComment}
                      </p>
                    </div>
                  </div>

                  {/* Dosen Review */}
                  {selectedReview.dosenReview ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Dosen Review</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span className="font-medium text-gray-900">
                                {selectedReview.dosenReview.dosenName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(selectedReview.dosenReview.reviewedDate)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(selectedReview.dosenReview.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.dosenReview.status)}`}
                            >
                              {selectedReview.dosenReview.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedReview.dosenReview.comment}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Dosen Review</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">Pending Review</span>
                        </div>
                        <p className="text-yellow-700 mt-2">
                          This submission is waiting for dosen review.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}{' '}
        {/* Document Modal */}
        {showDocumentModal && selectedDocumentReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Document Content</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted by {selectedDocumentReview.studentName} on{' '}
                      {formatDate(selectedDocumentReview.submittedDate)}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setShowDocumentModal(null)} size="sm">
                    Close
                  </Button>
                </div>{' '}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4">
                    <div
                      className="markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: selectedDocumentReview.documentContent
                          .split('\n')
                          .map((line) => {
                            // Handle headers
                            if (line.startsWith('### ')) {
                              return `<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">${line.substring(4)}</h3>`
                            }
                            if (line.startsWith('## ')) {
                              return `<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3">${line.substring(3)}</h2>`
                            }
                            if (line.startsWith('# ')) {
                              return `<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${line.substring(2)}</h1>`
                            }
                            // Handle bold text
                            line = line.replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-semibold text-gray-900">$1</strong>'
                            )
                            // Handle bullet points
                            if (line.startsWith('- ')) {
                              return `<li class="ml-4 mb-1">${line.substring(2)}</li>`
                            }
                            // Handle numbered lists
                            if (/^\d+\./.test(line)) {
                              return `<li class="ml-4 mb-1">${line.substring(line.indexOf('.') + 2)}</li>`
                            }
                            // Handle empty lines
                            if (line.trim() === '') {
                              return '<br/>'
                            }
                            // Regular paragraphs
                            return `<p class="mb-3 text-gray-700 leading-relaxed">${line}</p>`
                          })
                          .join(''),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
