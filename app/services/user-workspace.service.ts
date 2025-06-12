import { API_BASE_URL } from './api'

export interface UserWorkspaceRelation {
  id: string
  userId: string
  workspaceId: string
  role: 'Owner' | 'Member' | 'Lecturer'
  createdAt?: string
  updatedAt?: string
}

export interface UserWorkspaceWithDetails {
  id: string
  userId: string
  workspaceId: string
  role: 'Owner' | 'Member' | 'Lecturer'
  createdAt: string
  workspace?: {
    id: string
    title: string
    description?: string
    createdAt?: string
    ownerId?: string
  }
}

const UserWorkspaceService = {
  // Mengambil semua relasi user-workspace
  async getAllUserWorkspaces(): Promise<UserWorkspaceRelation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/workspace`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data user-workspace')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching user workspaces:', error)
      throw error
    }
  },

  // Metode untuk student bergabung dengan workspace yang sudah ada
  async joinAsStudent(userId: string, workspaceId: string): Promise<UserWorkspaceRelation> {
    try {
      console.log(`Student ${userId} joining workspace ${workspaceId}`)
      const response = await fetch(`${API_BASE_URL}/user/workspace/${userId}/${workspaceId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Join workspace error:', errorText)
        throw new Error('Gagal bergabung dengan workspace. Pastikan ID workspace benar.')
      }

      const result = await response.json()
      console.log('Join workspace result:', result)
      return result.data || result
    } catch (error) {
      console.error('Error joining workspace as student:', error)
      throw error
    }
  },

  // Metode untuk lecturer bergabung dengan workspace yang sudah ada
  async joinAsLecturer(userId: string, workspaceId: string): Promise<UserWorkspaceRelation> {
    try {
      console.log(`Lecturer ${userId} joining workspace ${workspaceId}`)
      const response = await fetch(
        `${API_BASE_URL}/user/workspace/${userId}/${workspaceId}/lecturer/join`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Join workspace as lecturer error:', errorText)
        throw new Error(
          'Gagal bergabung dengan workspace sebagai dosen. Pastikan ID workspace benar.'
        )
      }

      const result = await response.json()
      console.log('Join workspace as lecturer result:', result)
      return result.data || result
    } catch (error) {
      console.error('Error joining workspace as lecturer:', error)
      throw error
    }
  },

  // Mengambil workspace yang diikuti user dengan detail
  async getUserWorkspacesWithDetails(userId: string): Promise<UserWorkspaceWithDetails[]> {
    try {
      console.log('Fetching user workspaces for userId:', userId)
      const response = await fetch(`${API_BASE_URL}/user/workspace/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('getUserWorkspacesWithDetails response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('getUserWorkspacesWithDetails error response:', errorText)
        throw new Error('Gagal mengambil data workspace user')
      }

      const result = await response.json()
      console.log('getUserWorkspacesWithDetails result:', result)
      return result.data
    } catch (error) {
      console.error('Error fetching user workspaces with details:', error)
      throw error
    }
  },
  // Membuat relasi user sebagai owner workspace
  async createOwnerRelation(userId: string, workspaceId: string): Promise<UserWorkspaceRelation> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/workspace/${userId}/${workspaceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal membuat relasi owner workspace')
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creating owner relation:', error)
      throw error
    }
  },

  // Membuat relasi user sebagai member workspace
  async createMemberRelation(userId: string, workspaceId: string): Promise<UserWorkspaceRelation> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/workspace/${userId}/${workspaceId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal membuat relasi member workspace')
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creating member relation:', error)
      throw error
    }
  },
  // Membuat relasi user sebagai lecturer workspace
  async createLecturerRelation(
    userId: string,
    workspaceId: string
  ): Promise<UserWorkspaceRelation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/workspace/${userId}/${workspaceId}/lecturer/join`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        throw new Error('Gagal membuat relasi lecturer workspace')
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creating lecturer relation:', error)
      throw error
    }
  },

  // Mengambil semua relasi user-workspace
  async getUserWorkspaceRelations(userId: string): Promise<UserWorkspaceRelation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/workspace/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil relasi user-workspace')
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error fetching user workspace relations:', error)
      throw error
    }
  },

  // Menghapus relasi user dari workspace
  async removeUserFromWorkspace(userId: string, workspaceId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/workspace/${userId}/${workspaceId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus user dari workspace')
      }
    } catch (error) {
      console.error('Error removing user from workspace:', error)
      throw error
    }
  },
}

export default UserWorkspaceService
