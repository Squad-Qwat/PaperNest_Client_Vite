import { API_BASE_URL, handleApiError } from './api'
import type { ApiResponse } from './api'
import type { User } from './auth.service'

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const result: ApiResponse<User[]> = await response.json()
    return result.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

// Get user by ID
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`)

    if (!response.ok) {
      throw new Error(`User not found with ID: ${userId}`)
    }

    const result: ApiResponse<User> = await response.json()
    return result.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

// Get user by email
export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`)

    if (!response.ok) {
      throw new Error(`User not found with email: ${email}`)
    }

    const result: ApiResponse<User> = await response.json()
    return result.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

// Get user by username
export const getUserByUsername = async (username: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/username/${encodeURIComponent(username)}`)

    if (!response.ok) {
      throw new Error(`User not found with username: ${username}`)
    }

    const result: ApiResponse<User> = await response.json()
    return result.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

// Update user
export const updateUser = async (
  userId: string,
  userData: { name?: string; username?: string }
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update user with ID: ${userId}`)
    }

    await response.json()
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete user with ID: ${userId}`)
    }

    await response.json()
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}
