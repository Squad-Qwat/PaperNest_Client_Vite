import { useState, useCallback } from 'react'
import UserWorkspaceService, {
  type UserWorkspaceRelation,
} from '../services/user-workspace.service'
import { handleApiError } from '../services/api'

export function useUserWorkspace() {
  const [userWorkspaces, setUserWorkspaces] = useState<UserWorkspaceRelation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mengambil semua relasi user-workspace untuk user tertentu
  const fetchUserWorkspaces = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await UserWorkspaceService.getUserWorkspaceRelations(userId)
      setUserWorkspaces(data)
      return data
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('Error fetching user workspaces:', errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Membuat relasi owner workspace
  const createOwnerRelation = useCallback(async (userId: string, workspaceId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const newRelation = await UserWorkspaceService.createOwnerRelation(userId, workspaceId)

      // Update state dengan relasi baru
      setUserWorkspaces((prev) => [...prev, newRelation])

      console.log('Owner relation created successfully:', newRelation)
      return newRelation
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('Error creating owner relation:', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Membuat relasi member workspace
  const createMemberRelation = useCallback(async (userId: string, workspaceId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const newRelation = await UserWorkspaceService.createMemberRelation(userId, workspaceId)

      // Update state dengan relasi baru
      setUserWorkspaces((prev) => [...prev, newRelation])

      console.log('Member relation created successfully:', newRelation)
      return newRelation
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('Error creating member relation:', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Membuat relasi lecturer workspace
  const createLecturerRelation = useCallback(async (userId: string, workspaceId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const newRelation = await UserWorkspaceService.createLecturerRelation(userId, workspaceId)

      // Update state dengan relasi baru
      setUserWorkspaces((prev) => [...prev, newRelation])

      console.log('Lecturer relation created successfully:', newRelation)
      return newRelation
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('Error creating lecturer relation:', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Menghapus user dari workspace
  const removeUserFromWorkspace = useCallback(async (userId: string, workspaceId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await UserWorkspaceService.removeUserFromWorkspace(userId, workspaceId)

      // Update state dengan menghapus relasi
      setUserWorkspaces((prev) =>
        prev.filter(
          (relation) => !(relation.userId === userId && relation.workspaceId === workspaceId)
        )
      )

      console.log('User removed from workspace successfully')
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('Error removing user from workspace:', errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Helper function untuk mengecek role user dalam workspace tertentu
  const getUserRoleInWorkspace = useCallback(
    (userId: string, workspaceId: string): 'Owner' | 'Member' | 'Lecturer' | null => {
      const relation = userWorkspaces.find(
        (rel) => rel.userId === userId && rel.workspaceId === workspaceId
      )
      return relation ? relation.role : null
    },
    [userWorkspaces]
  )

  // Helper function untuk mengecek apakah user adalah owner workspace
  const isUserOwnerOfWorkspace = useCallback(
    (userId: string, workspaceId: string): boolean => {
      return getUserRoleInWorkspace(userId, workspaceId) === 'Owner'
    },
    [getUserRoleInWorkspace]
  )

  return {
    userWorkspaces,
    isLoading,
    error,
    fetchUserWorkspaces,
    createOwnerRelation,
    createMemberRelation,
    createLecturerRelation,
    removeUserFromWorkspace,
    getUserRoleInWorkspace,
    isUserOwnerOfWorkspace,
  }
}
