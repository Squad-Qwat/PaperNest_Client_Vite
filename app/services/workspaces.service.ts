import { API_BASE_URL, type ApiResponse, handleApiError } from './api'

export type WorkspaceRole = 'Owner' | 'Member' | 'Lecturer'

export interface Workspace {
  id: string
  title: string
  description?: string
  isPrivate?: boolean
  memberCount?: number
  role?: WorkspaceRole
  createdAt?: string
  ownerId?: string
}

export interface CreateWorkspaceForm {
  title: string
  description?: string
  ownerId: string
}

// Interface untuk API request body (sesuai backend)
export interface CreateWorkspaceAPIRequest {
  title: string
  description?: string
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
      console.log('Fetching user workspaces for userId:', userId)
      const response = await fetch(`${API_BASE_URL}/workspaces/user/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('getUserWorkspaces response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('getUserWorkspaces error response:', errorText)
        throw new Error('Gagal mengambil data workspace user')
      }

      const result = await response.json()
      console.log('getUserWorkspaces result:', result)
      return result.data
    } catch (error) {
      console.error('Error fetching user workspaces:', error)
      throw error
    }
  },

  // Mengambil workspace yang diikuti user
  async getJoinedWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      console.log('Fetching joined workspaces for userId:', userId)
      const response = await fetch(`${API_BASE_URL}/workspaces/joined/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('getJoinedWorkspaces response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('getJoinedWorkspaces error response:', errorText)
        throw new Error('Gagal mengambil data workspace yang diikuti')
      }

      const result = await response.json()
      console.log('getJoinedWorkspaces result:', result)
      return result.data
    } catch (error) {
      console.error('Error fetching joined workspaces:', error)
      throw error
    }
  },

  // Membuat workspace baru
  async createWorkspace(data: CreateWorkspaceForm): Promise<Workspace> {
    try {
      // Convert ke format API backend (title bukan name, tanpa ownerId)
      const apiRequest: CreateWorkspaceAPIRequest = {
        title: data.title,
        description: data.description || '',
      }

      console.log('Creating workspace with API request:', apiRequest)

      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiRequest),
      })

      console.log('Create workspace response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create workspace error response:', errorText)
        throw new Error(`Gagal membuat workspace: ${response.status}`)
      }

      const result = await response.json()
      console.log('Create workspace success result:', result)

      // Convert response back ke format frontend (title dari title)
      const workspace: Workspace = {
        id: result.data.id,
        title: result.data.title || result.data.name, // Handle both formats
        description: result.data.description,
        createdAt: result.data.createdAt,
        ownerId: data.ownerId, // Set dari frontend data
      }

      return workspace
    } catch (error) {
      console.error('Error creating workspace:', error)
      throw error
    }
  },

  // Membuat workspace baru - versi alternatif untuk backend yang menggunakan 'title'
  async createWorkspaceSimple(data: CreateWorkspaceForm): Promise<Workspace> {
    try {
      // Payload sederhana sesuai dengan format backend saat ini
      const apiRequest: CreateWorkspaceAPIRequest = {
        title: data.title,
        description: data.description || '',
      }

      console.log('Creating workspace with simple payload:', apiRequest)

      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiRequest),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Workspace creation failed:', errorText)
        throw new Error(`Gagal membuat workspace baru: ${response.status}`)
      }

      const result = await response.json()
      console.log('Workspace creation response:', result)

      // Convert response ke format frontend
      const workspace: Workspace = {
        id: result.data?.id || `temp-workspace-${Date.now()}`,
        title: result.data?.title || result.data?.name || data.title,
        description: result.data?.description || data.description,
        ownerId: data.ownerId,
        createdAt: result.data?.createdAt || new Date().toISOString(),
      }

      return workspace
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
