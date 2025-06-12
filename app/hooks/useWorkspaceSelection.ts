import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser } from '../services/auth.service'
import UserWorkspaceService, {
  type UserWorkspaceWithDetails,
} from '../services/user-workspace.service'
import WorkspacesService, {
  type Workspace,
  type CreateWorkspaceForm,
} from '../services/workspaces.service'
import { handleApiError } from '../services/api'

export function useWorkspaceSelection() {
  const [userWorkspaces, setUserWorkspaces] = useState<UserWorkspaceWithDetails[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<UserWorkspaceWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get current user ID from session
  const getCurrentUserId = useCallback(() => {
    const user = getCurrentUser()
    return user?.id || null
  }, [])
  // Fetch user workspaces with details
  const fetchUserWorkspaces = useCallback(async () => {
    const userId = getCurrentUserId()
    if (!userId) {
      setError('User not logged in')
      setIsLoading(false)
      return
    }

    console.log('Fetching workspaces for user ID:', userId)

    try {
      setIsLoading(true)
      setError(null)
      console.log('Calling WorkspacesService to get user workspaces...')

      // Use workspace service to get user's workspaces (both owned and joined)
      const ownedWorkspaces = await WorkspacesService.getUserWorkspaces(userId)
      const joinedWorkspaces = await WorkspacesService.getJoinedWorkspaces(userId)

      console.log('Owned workspaces:', ownedWorkspaces)
      console.log('Joined workspaces:', joinedWorkspaces)

      // Combine and deduplicate workspaces
      const allWorkspaces = [...ownedWorkspaces, ...joinedWorkspaces]
      const uniqueWorkspaces = allWorkspaces.filter(
        (workspace, index, self) => index === self.findIndex((w) => w.id === workspace.id)
      )

      console.log('Combined unique workspaces:', uniqueWorkspaces)

      // Convert to UserWorkspaceWithDetails format
      const userWorkspacesData: UserWorkspaceWithDetails[] = uniqueWorkspaces.map((workspace) => ({
        id: `${userId}-${workspace.id}`, // Generate a relation ID
        userId: userId,
        workspaceId: workspace.id,
        role: workspace.role || (workspace.ownerId === userId ? 'Owner' : 'Member'),
        createdAt: workspace.createdAt || new Date().toISOString(),
        workspace: workspace,
      }))

      console.log('Processed user workspaces:', userWorkspacesData)

      setUserWorkspaces(userWorkspacesData) // Select the most recently joined workspace (latest createdAt)
      if (userWorkspacesData.length > 0) {
        const sortedByCreatedAt = userWorkspacesData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        console.log('Selected workspace (most recent):', sortedByCreatedAt[0])
        setSelectedWorkspace(sortedByCreatedAt[0])
      } else {
        console.log('No workspaces found for user')
        setSelectedWorkspace(null)
      }
    } catch (err) {
      console.error('Error fetching user workspaces:', err)
      setError(handleApiError(err))

      // Fallback untuk development
      console.log('Using fallback sample data...')
      const sampleUserWorkspaces: UserWorkspaceWithDetails[] = [
        {
          id: '1',
          userId: userId,
          workspaceId: '1',
          role: 'Owner',
          createdAt: '2024-01-15T10:30:00Z',
          workspace: {
            id: '1',
            title: 'Kelompok Penelitian Kesehatan',
            description: 'Workspace untuk kolaborasi proyek penelitian kesehatan',
            createdAt: '2024-01-10T10:30:00Z',
            ownerId: userId,
          },
        },
        {
          id: '2',
          userId: userId,
          workspaceId: '2',
          role: 'Member',
          createdAt: '2024-02-05T14:15:00Z',
          workspace: {
            id: '2',
            title: 'Proyek Tugas Akhir',
            description: 'Workspace untuk pengerjaan tugas akhir',
            createdAt: '2024-02-01T14:15:00Z',
            ownerId: 'other-user-id',
          },
        },
      ]
      setUserWorkspaces(sampleUserWorkspaces)
      setSelectedWorkspace(sampleUserWorkspaces[0]) // Most recent by createdAt
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentUserId])

  // Create new workspace
  const createWorkspace = useCallback(
    async (data: CreateWorkspaceForm) => {
      const userId = getCurrentUserId()
      if (!userId) {
        throw new Error('User not logged in')
      }

      try {
        setIsSaving(true)
        setError(null)

        // Create workspace
        const newWorkspace = await WorkspacesService.createWorkspace({
          ...data,
          ownerId: userId,
        })

        // Create UserWorkspace relation as Owner
        const userWorkspaceRelation = await UserWorkspaceService.createOwnerRelation(
          userId,
          newWorkspace.id
        )

        // Create new UserWorkspaceWithDetails object
        const newUserWorkspace: UserWorkspaceWithDetails = {
          id: userWorkspaceRelation.id,
          userId: userId,
          workspaceId: newWorkspace.id,
          role: 'Owner',
          createdAt: new Date().toISOString(),
          workspace: newWorkspace,
        }

        // Add to list and select it
        setUserWorkspaces((prev) => [newUserWorkspace, ...prev])
        setSelectedWorkspace(newUserWorkspace)

        return newUserWorkspace
      } catch (err) {
        setError(handleApiError(err))
        throw err
      } finally {
        setIsSaving(false)
      }
    },
    [getCurrentUserId]
  )

  // Join workspace by ID
  const joinWorkspace = useCallback(
    async (workspaceId: string) => {
      const userId = getCurrentUserId()
      if (!userId) {
        throw new Error('User not logged in')
      }

      try {
        setIsSaving(true)
        setError(null)

        // Join workspace
        const response = await WorkspacesService.joinWorkspace(workspaceId, userId)

        // Create UserWorkspaceWithDetails object
        const newUserWorkspace: UserWorkspaceWithDetails = {
          id: response.userWorkspace.id,
          userId: userId,
          workspaceId: workspaceId,
          role: response.userWorkspace.role,
          createdAt: new Date().toISOString(),
          workspace: response.workspace,
        }

        // Add to list and select it
        setUserWorkspaces((prev) => [newUserWorkspace, ...prev])
        setSelectedWorkspace(newUserWorkspace)

        return newUserWorkspace
      } catch (err) {
        setError(handleApiError(err))
        throw err
      } finally {
        setIsSaving(false)
      }
    },
    [getCurrentUserId]
  )

  // Select workspace manually
  const selectWorkspace = useCallback((workspace: UserWorkspaceWithDetails) => {
    setSelectedWorkspace(workspace)
  }, [])

  useEffect(() => {
    fetchUserWorkspaces()
  }, [fetchUserWorkspaces])

  return {
    userWorkspaces,
    selectedWorkspace,
    isLoading,
    isSaving,
    error,
    fetchUserWorkspaces,
    createWorkspace,
    joinWorkspace,
    selectWorkspace,
  }
}
