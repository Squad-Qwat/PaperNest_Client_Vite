import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  ChevronsUpDown,
  Plus,
  Users,
  Calendar,
  Crown,
  UserCheck,
  GraduationCap,
  Hash,
  CheckCircle,
} from 'lucide-react'
import { type UserWorkspaceWithDetails } from '@/services/user-workspace.service'
import { type CreateWorkspaceForm } from '@/services/workspaces.service'

interface WorkspaceSelectorModalProps {
  selectedWorkspace: UserWorkspaceWithDetails | null
  userWorkspaces: UserWorkspaceWithDetails[]
  onSelectWorkspace: (workspace: UserWorkspaceWithDetails) => void
  onCreateWorkspace: (data: CreateWorkspaceForm) => Promise<UserWorkspaceWithDetails>
  onJoinWorkspace: (workspaceId: string) => Promise<UserWorkspaceWithDetails>
  isLoading?: boolean
  isSaving?: boolean
}

export function WorkspaceSelectorModal({
  selectedWorkspace,
  userWorkspaces,
  onSelectWorkspace,
  onCreateWorkspace,
  onJoinWorkspace,
  isLoading = false,
  isSaving = false,
}: WorkspaceSelectorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'join'>('list')
  // Create workspace form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
  })

  // Join workspace form state
  const [joinForm, setJoinForm] = useState({
    workspaceId: '',
  })

  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'Member':
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case 'Lecturer':
        return <GraduationCap className="h-4 w-4 text-green-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-yellow-100 text-yellow-800'
      case 'Member':
        return 'bg-blue-100 text-blue-800'
      case 'Lecturer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateWorkspace = async () => {
    if (!createForm.title.trim()) {
      setError('Workspace name is required')
      return
    }
    try {
      setError(null)
      await onCreateWorkspace({
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        ownerId: '', // Will be set in the hook
      })

      // Reset form and close modal
      setCreateForm({ title: '', description: '' })
      setIsOpen(false)
      setActiveTab('list')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace')
    }
  }

  const handleJoinWorkspace = async () => {
    if (!joinForm.workspaceId.trim()) {
      setError('Workspace ID is required')
      return
    }

    try {
      setError(null)
      await onJoinWorkspace(joinForm.workspaceId.trim())

      // Reset form and close modal
      setJoinForm({ workspaceId: '' })
      setIsOpen(false)
      setActiveTab('list')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join workspace')
    }
  }

  const handleWorkspaceSelect = (workspace: UserWorkspaceWithDetails) => {
    onSelectWorkspace(workspace)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Workspace</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            My Workspaces
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Create New
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'join'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Hash className="h-4 w-4 inline mr-2" />
            Join by ID
          </button>
        </div>

        {/* Error Display */}
        {error && <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">{error}</div>}

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {/* Workspace List Tab */}
          {activeTab === 'list' && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading workspaces...</div>
              ) : userWorkspaces.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No workspaces found</p>
                  <p className="text-sm">Create a new workspace or join an existing one</p>
                </div>
              ) : (
                userWorkspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedWorkspace?.id === workspace.id
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {workspace.workspace?.title || 'Unnamed Workspace'}
                          </h3>
                          {selectedWorkspace?.id === workspace.id && (
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {workspace.workspace?.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(workspace.role)}
                            <Badge className={`text-xs ${getRoleBadgeColor(workspace.role)}`}>
                              {workspace.role}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span> Joined {formatDate(workspace.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Create Workspace Tab */}
          {activeTab === 'create' && (
            <div className="space-y-4 pt-2">
              <div>
                {' '}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Name *
                </label>
                <Input
                  value={createForm.title}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter workspace name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe what this workspace is for..."
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              <Separator />

              <div className="flex space-x-3">
                <Button
                  onClick={() => setActiveTab('list')}
                  variant="outline"
                  className="flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWorkspace}
                  className="flex-1"
                  disabled={isSaving || !createForm.title.trim()}
                >
                  {isSaving ? 'Creating...' : 'Create Workspace'}
                </Button>
              </div>
            </div>
          )}

          {/* Join Workspace Tab */}
          {activeTab === 'join' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace ID *
                </label>
                <Input
                  value={joinForm.workspaceId}
                  onChange={(e) =>
                    setJoinForm((prev) => ({ ...prev, workspaceId: e.target.value }))
                  }
                  placeholder="Enter workspace ID"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ask the workspace owner for the workspace ID
                </p>
              </div>

              <Separator />

              <div className="flex space-x-3">
                <Button
                  onClick={() => setActiveTab('list')}
                  variant="outline"
                  className="flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleJoinWorkspace}
                  className="flex-1"
                  disabled={isSaving || !joinForm.workspaceId.trim()}
                >
                  {isSaving ? 'Joining...' : 'Join Workspace'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
