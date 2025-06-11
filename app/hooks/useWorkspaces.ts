import { useState, useEffect, useCallback } from 'react'
import WorkspacesService, {
  type Workspace,
  type CreateWorkspaceForm,
  type JoinWorkspaceResponse,
} from '../services/workspaces.service'
import { handleApiError } from '../services/api'

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('current-user-id') // Temporary for development

  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await WorkspacesService.getWorkspaces()
      setWorkspaces(data)
    } catch (err) {
      setError(handleApiError(err))

      // Fallback untuk development
      const sampleWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'Kelompok Penelitian Kesehatan',
          description: 'Workspace untuk kolaborasi proyek penelitian kesehatan',
          isPrivate: false,
          memberCount: 4,
          role: 'Member',
          createdAt: '2024-01-10T10:30:00Z',
          ownerId: 'owner-id-1',
        },
        {
          id: '2',
          name: 'Proyek Tugas Akhir',
          description: 'Workspace untuk pengerjaan tugas akhir',
          isPrivate: true,
          memberCount: 2,
          role: 'Owner',
          createdAt: '2024-02-05T14:15:00Z',
          ownerId: 'owner-id-2',
        },
      ]
      setWorkspaces(sampleWorkspaces)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createWorkspace = useCallback(
    async (data: CreateWorkspaceForm) => {
      try {
        setIsSaving(true)
        setError(null)

        const newWorkspace = await WorkspacesService.createWorkspace({
          ...data,
          ownerId: currentUserId,
        })

        setWorkspaces((prev) => [newWorkspace, ...prev])

        return newWorkspace
      } catch (err) {
        setError(handleApiError(err))
        return null
      } finally {
        setIsSaving(false)
      }
    },
    [currentUserId]
  )

  const joinWorkspace = useCallback(
    async (workspaceId: string) => {
      try {
        setIsSaving(true)
        setError(null)

        const response = await WorkspacesService.joinWorkspace(workspaceId, currentUserId)

        setWorkspaces((prev) => {
          // Jika workspace sudah ada, perbarui; jika tidak, tambahkan
          const exists = prev.some((w) => w.id === workspaceId)
          if (exists) {
            return prev.map((w) => (w.id === workspaceId ? response.workspace : w))
          } else {
            return [...prev, response.workspace]
          }
        })

        return true // Berhasil
      } catch (err) {
        setError(handleApiError(err))
        return false // Gagal
      } finally {
        setIsSaving(false)
      }
    },
    [currentUserId]
  )

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  return {
    workspaces,
    isLoading,
    isSaving,
    error,
    fetchWorkspaces,
    createWorkspace,
    joinWorkspace,
  }
}
