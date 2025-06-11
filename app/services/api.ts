// Konfigurasi API dasar
export const API_BASE_URL = 'https://localhost:5001/api'

// Format respons sesuai dokumentasi API
export type ApiResponse<T> = {
  message: string
  data: T
}

// Fungsi untuk menangani error dari API
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'Terjadi kesalahan yang tidak diketahui'
}
