// Konfigurasi API dasar
// Base URL uses proxy configuration in vite.config.ts that points to https://localhost:7208
export const API_BASE_URL = '/api'

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
