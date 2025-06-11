import { API_BASE_URL, type ApiResponse, handleApiError } from './api'

export type WorkspaceRole = 'Owner' | 'Member' | 'Lecturer'

export interface Workspace {
  id: string
  name: string
  description?: string
  isPrivate?: boolean
  memberCount?: number
  role?: WorkspaceRole
  createdAt?: string
  ownerId?: string
}

export interface CreateWorkspaceForm {
  name: string
  description?: string
  ownerId: string
}

export interface UserWorkspace {
  id: string
  userId: string
  workspaceId: string
  role: WorkspaceRole
}

export interface JoinWorkspaceResponse {
  workspace: Workspace
  userWorkspace: UserWorkspace
}

const WorkspacesService = {
  // Mengambil semua workspace
  async getWorkspaces(): Promise<Workspace[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data workspace')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching workspaces:', error)
      throw error
    }
  },

  // Mengambil workspace yang dimiliki user
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/workspaces/user/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data workspace user')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching user workspaces:', error)
      throw error
    }
  },

  // Mengambil workspace yang diikuti user
  async getJoinedWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/workspaces/joined/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data workspace yang diikuti')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching joined workspaces:', error)
      throw error
    }
  },

  // Membuat workspace baru
  async createWorkspace(data: CreateWorkspaceForm): Promise<Workspace> {
    try {
      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat workspace baru')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error creating workspace:', error)
      throw error
    }
  },

  // Mendapatkan role user dalam workspace
  async getUserRoleInWorkspace(workspaceId: string, userId: string): Promise<WorkspaceRole> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/workspaces/${workspaceId}/user/${userId}/role`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        throw new Error('Gagal mengambil role user di workspace')
      }

      const result = await response.json()
      return result.data.role
    } catch (error) {
      console.error('Error fetching user role:', error)
      throw error
    }
  },

  // Bergabung dengan workspace
  async joinWorkspace(workspaceId: string, userId: string): Promise<JoinWorkspaceResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/workspaces/join?workspaceId=${workspaceId}&userId=${userId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        throw new Error('Gagal bergabung dengan workspace')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error joining workspace:', error)
      throw error
    }
  },

  // Mengupdate workspace
  async updateWorkspace(workspaceId: string, data: Partial<Workspace>): Promise<Workspace> {
    try {
      const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Gagal mengupdate workspace')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error updating workspace:', error)
      throw error
    }
  },

  // Menghapus workspace
  async deleteWorkspace(workspaceId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus workspace')
      }
    } catch (error) {
      console.error('Error deleting workspace:', error)
      throw error
    }
  },
}

export default WorkspacesService
