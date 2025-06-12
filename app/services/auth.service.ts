import { API_BASE_URL, handleApiError } from './api'
import type { ApiResponse } from './api'

// User type definition sesuai dengan API Documentation
export type User = {
  id: string
  name: string
  email: string
  username: string
  role: string
}

// Register request payload sesuai dengan dokumentasi
export type RegisterRequest = {
  name: string
  email: string
  username: string
  password: string
  role?: string
}

// Login request payload sesuai dengan dokumentasi
export type LoginRequest = {
  email: string
  password: string
}

export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    console.log('Register payload:', userData)
    const payloadString = JSON.stringify(userData)
    console.log('Register payload (stringified):', payloadString)

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payloadString,
    })

    console.log('Register response status:', response.status)

    // Tangani error response
    if (!response.ok) {
      // Coba ambil detail error dari response
      try {
        const errorText = await response.text()
        console.error('Error response text:', errorText)

        if (errorText) {
          try {
            const errorData = JSON.parse(errorText)
            console.error('Error response parsed:', errorData)
            throw new Error(errorData.message || `Registrasi gagal: ${response.status}`)
          } catch (jsonError) {
            // Tidak bisa parse JSON
            throw new Error(`Registrasi gagal: ${errorText}`)
          }
        } else {
          throw new Error(`Registrasi gagal dengan status: ${response.status}`)
        }
      } catch (textError) {
        // Tidak bisa ambil text
        throw new Error(`Registrasi gagal dengan status: ${response.status}`)
      }
    }

    // Tangani kemungkinan respons kosong
    const text = await response.text()
    console.log('Register response text:', text)
    if (!text) {
      console.log('Empty response received, creating user from request data')
      // Jika respons kosong, buat user dari data yang dikirim
      const fallbackUser: User = {
        id: 'temp-id', // ID sementara
        name: userData.name,
        email: userData.email,
        username: userData.username,
        role: userData.role || 'Student',
      }

      // Simpan data user di localStorage
      localStorage.setItem('user', JSON.stringify(fallbackUser))
      console.log('Fallback user data saved to localStorage:', fallbackUser)

      return fallbackUser
    }
    try {
      const result = JSON.parse(text)
      console.log('Register result parsed:', result)

      let userResult: User

      // Periksa struktur data
      if (result.data) {
        userResult = result.data
      } else if (result.id) {
        // Mungkin API langsung mengembalikan user object
        userResult = result
      } else {
        console.log('Using temp user object due to unexpected response format')
        userResult = {
          id: 'temp-id',
          name: userData.name,
          email: userData.email,
          username: userData.username,
          role: userData.role || 'Student',
        }
      }

      // Simpan data user di localStorage setelah registrasi berhasil
      localStorage.setItem('user', JSON.stringify(userResult))
      console.log('User data saved to localStorage:', userResult)

      return userResult
    } catch (err) {
      console.error('Failed to parse JSON response:', text, err)
      throw new Error('Respons server tidak valid')
    }
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

export const login = async (credentials: LoginRequest): Promise<User> => {
  try {
    console.log('Login request:', credentials)

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    console.log('Login response status:', response.status)

    if (!response.ok) {
      // Handle login errors
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login gagal')
      } catch (jsonError) {
        throw new Error(`Login gagal dengan status: ${response.status}`)
      }
    }

    const text = await response.text()
    console.log('Login response text:', text)

    if (!text) {
      throw new Error('Respons server kosong')
    }

    try {
      const result = JSON.parse(text)
      console.log('Login result parsed:', result)

      // Handle API response format
      let userData: User

      if (result.data) {
        // Check if data contains user info or just email/password
        if (result.data.id && result.data.name) {
          // Complete user data
          userData = result.data
        } else if (result.data.email) {
          // Only email/password returned, need to fetch user data
          console.log('Incomplete user data, fetching user by email...')

          try {
            // Try to get user data by email
            const userResponse = await fetch(
              `${API_BASE_URL}/users/email/${encodeURIComponent(result.data.email)}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            )

            if (userResponse.ok) {
              const userResult = await userResponse.json()
              userData = userResult.data
            } else {
              // Fallback with basic user data
              userData = {
                id: 'temp-id',
                name: result.data.email.split('@')[0], // Use email prefix as name
                email: result.data.email,
                username: result.data.email.split('@')[0],
                role: 'Student',
              }
            }
          } catch (fetchError) {
            console.warn('Failed to fetch user data:', fetchError)
            // Fallback with basic user data
            userData = {
              id: 'temp-id',
              name: result.data.email.split('@')[0],
              email: result.data.email,
              username: result.data.email.split('@')[0],
              role: 'Student',
            }
          }
        } else {
          throw new Error('Format respons login tidak valid')
        }
      } else {
        throw new Error('Data user tidak ditemukan dalam respons')
      }

      // Simpan data user di localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('User data saved to localStorage:', userData)

      return userData
    } catch (parseError) {
      console.error('Failed to parse login response:', text, parseError)
      throw new Error('Respons server tidak valid')
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const resetPassword = async (userEmail: string, newPassword: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/reset-password?userEmail=${encodeURIComponent(userEmail)}&newPassword=${encodeURIComponent(newPassword)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Reset password gagal')
    }

    await response.json()
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export const changeEmail = async (oldEmail: string, newEmail: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldEmail, newEmail }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Perubahan email gagal')
    }

    await response.json()
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export const getCurrentUser = (): User | null => {
  const userJSON = localStorage.getItem('user')
  if (!userJSON) return null

  try {
    return JSON.parse(userJSON) as User
  } catch {
    return null
  }
}

export const logout = (): void => {
  localStorage.removeItem('user')
}
