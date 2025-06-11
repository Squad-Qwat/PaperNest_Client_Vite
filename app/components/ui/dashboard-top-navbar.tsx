import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Bell,
  Settings,
  ChevronsUpDown,
  UserRoundPlus,
  Plus,
  Users,
  Check,
} from 'lucide-react'

interface Workspace {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  memberCount: number
  role: 'owner' | 'admin' | 'member'
  createdAt: string
}

interface TopNavBarProps {
  activeTab?: string
  currentWorkspace?: Workspace
  onWorkspaceChange?: (workspace: Workspace) => void
}

export function TopNavBar({
  activeTab = 'Overview',
  currentWorkspace,
  onWorkspaceChange,
}: TopNavBarProps) {
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    isPrivate: true,
  })
  const [joinWorkspaceId, setJoinWorkspaceId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = 'https://your-api-url.com/api'

  const navItems = [
    { name: 'Overview', href: '#' },
    { name: 'AI Chat', href: '#' },
    { name: 'Trash', href: '#' },
    { name: 'Settings', href: '#' },
  ]

  const defaultWorkspace: Workspace = {
    id: 'default',
    name: "PaperNest's workspace",
    isPrivate: true,
    memberCount: 1,
    role: 'owner',
    createdAt: new Date().toISOString(),
  }

  const displayWorkspace = currentWorkspace || defaultWorkspace

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch workspaces: ${response.status} ${response.statusText}`)
      }

      const data: Workspace[] = await response.json()
      setWorkspaces(data)
    } catch (error) {
      console.error('Error fetching workspaces:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch workspaces')

      const sampleWorkspaces: Workspace[] = [
        {
          id: '1',
          name: "PaperNest's workspace",
          description: 'Main research workspace',
          isPrivate: true,
          memberCount: 1,
          role: 'owner',
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Healthcare AI Research',
          description: 'Collaborative workspace for AI in healthcare research',
          isPrivate: false,
          memberCount: 5,
          role: 'admin',
          createdAt: '2024-02-01T14:20:00Z',
        },
        {
          id: '3',
          name: 'Machine Learning Lab',
          description: 'University ML research group',
          isPrivate: false,
          memberCount: 12,
          role: 'member',
          createdAt: '2024-01-20T09:15:00Z',
        },
      ]
      setWorkspaces(sampleWorkspaces)
    } finally {
      setIsLoading(false)
    }
  }

  const createWorkspace = async () => {
    if (!createFormData.name.trim()) {
      setError('Workspace name is required')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      })

      if (!response.ok) {
        throw new Error('Failed to create workspace')
      }

      const newWorkspace: Workspace = await response.json()
      setWorkspaces((prev) => [newWorkspace, ...prev])
      setCreateFormData({ name: '', description: '', isPrivate: true })
      setShowCreateForm(false)

      if (onWorkspaceChange) {
        onWorkspaceChange(newWorkspace)
      }
    } catch (error) {
      console.error('Error creating workspace:', error)
      setError(error instanceof Error ? error.message : 'Failed to create workspace')
    } finally {
      setIsLoading(false)
    }
  }

  const joinWorkspace = async () => {
    if (!joinWorkspaceId.trim()) {
      setError('Workspace ID is required')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/workspaces/${joinWorkspaceId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to join workspace')
      }

      const joinedWorkspace: Workspace = await response.json()
      setWorkspaces((prev) => [joinedWorkspace, ...prev])
      setJoinWorkspaceId('')
      setShowJoinForm(false)

      if (onWorkspaceChange) {
        onWorkspaceChange(joinedWorkspace)
      }
    } catch (error) {
      console.error('Error joining workspace:', error)
      setError(error instanceof Error ? error.message : 'Failed to join workspace')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWorkspaceSelect = (workspace: Workspace) => {
    if (onWorkspaceChange) {
      onWorkspaceChange(workspace)
    }
    setShowWorkspaceModal(false)
  }

  const handleOpenModal = () => {
    setShowWorkspaceModal(true)
    fetchWorkspaces()
  }

  const handleCloseModal = () => {
    setShowWorkspaceModal(false)
    setShowCreateForm(false)
    setShowJoinForm(false)
    setError(null)
    setCreateFormData({ name: '', description: '', isPrivate: true })
    setJoinWorkspaceId('')
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">PaperNest</h1>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <div className="px-2">/</div>
                  <span>{displayWorkspace.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      displayWorkspace.isPrivate
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {displayWorkspace.isPrivate ? 'Private' : 'Public'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                    onClick={handleOpenModal}
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700">
                <option>
                  ({displayWorkspace.memberCount}) - Online user
                  {displayWorkspace.memberCount > 1 ? 's' : ''}
                </option>
              </select>
              <Button variant="outline" size="sm" className="text-sm">
                <UserRoundPlus className="h-4 w-4" />
                Invite members
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                  <Settings className="h-4 w-4" />
                </Button>
                <div className="w-8 h-8 bg-gray-300 rounded-full ml-1"></div>
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium py-2 ${
                  activeTab === item.name ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Workspace Switcher Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Switch Workspace</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Create Workspace Form */}
              {showCreateForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Create New Workspace</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Workspace Name *
                      </label>
                      <Input
                        value={createFormData.name}
                        onChange={(e) =>
                          setCreateFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Enter workspace name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Input
                        value={createFormData.description}
                        onChange={(e) =>
                          setCreateFormData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Enter workspace description"
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPrivate"
                        checked={createFormData.isPrivate}
                        onChange={(e) =>
                          setCreateFormData((prev) => ({ ...prev, isPrivate: e.target.checked }))
                        }
                        className="rounded"
                      />
                      <label htmlFor="isPrivate" className="text-sm text-gray-700">
                        Private workspace
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={createWorkspace}
                        disabled={isLoading}
                        size="sm"
                        className="flex-1"
                      >
                        {isLoading ? 'Creating...' : 'Create'}
                      </Button>
                      <Button
                        onClick={() => setShowCreateForm(false)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Join Workspace Form */}
              {showJoinForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Join Workspace</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Workspace ID *
                      </label>
                      <Input
                        value={joinWorkspaceId}
                        onChange={(e) => setJoinWorkspaceId(e.target.value)}
                        placeholder="Enter workspace ID"
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={joinWorkspace}
                        disabled={isLoading}
                        size="sm"
                        className="flex-1"
                      >
                        {isLoading ? 'Joining...' : 'Join'}
                      </Button>
                      <Button
                        onClick={() => setShowJoinForm(false)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!showCreateForm && !showJoinForm && (
                <div className="flex gap-2 mb-6">
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Workspace
                  </Button>
                  <Button
                    onClick={() => setShowJoinForm(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Join Workspace
                  </Button>
                </div>
              )}

              {/* Workspaces List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Your Workspaces</h3>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  </div>
                ) : workspaces.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No workspaces found</p>
                ) : (
                  workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        workspace.id === displayWorkspace.id
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleWorkspaceSelect(workspace)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-900">{workspace.name}</h4>
                            {workspace.id === displayWorkspace.id && (
                              <Check className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          {workspace.description && (
                            <p className="text-xs text-gray-500 mt-1">{workspace.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span
                              className={`px-2 py-1 rounded ${
                                workspace.isPrivate
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {workspace.isPrivate ? 'Private' : 'Public'}
                            </span>
                            <span>
                              {workspace.memberCount} member{workspace.memberCount > 1 ? 's' : ''}
                            </span>
                            <span className="capitalize">{workspace.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
