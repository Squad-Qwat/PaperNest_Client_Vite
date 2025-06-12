import { Button } from '../ui/button'
import { Search, Bell, Settings, UserRoundPlus, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { WorkspaceSelectorModal } from './workspace-selector-modal'
import { logout } from '@/services/auth.service'
import { useNavigate } from 'react-router'
import type { User as UserType } from '@/services/auth.service'
import type { UserWorkspaceWithDetails } from '@/services/user-workspace.service'
import type { CreateWorkspaceForm } from '@/services/workspaces.service'

interface TopNavBarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  isMinimal?: boolean
  title?: string
  selectedDocumentId?: string
  currentUser?: UserType | null
  selectedWorkspace?: UserWorkspaceWithDetails | null
  userWorkspaces?: UserWorkspaceWithDetails[]
  onSelectWorkspace?: (workspace: UserWorkspaceWithDetails) => void
  onCreateWorkspace?: (data: CreateWorkspaceForm) => Promise<UserWorkspaceWithDetails>
  onJoinWorkspace?: (workspaceId: string) => Promise<UserWorkspaceWithDetails>
  isWorkspaceLoading?: boolean
  isWorkspaceSaving?: boolean
}

export function DashboardTopNavBar({
  activeTab = 'Overview',
  onTabChange,
  isMinimal = false,
  title = 'Dashboard',
  selectedDocumentId,
  currentUser = null,
  selectedWorkspace = null,
  userWorkspaces = [],
  onSelectWorkspace,
  onCreateWorkspace,
  onJoinWorkspace,
  isWorkspaceLoading = false,
  isWorkspaceSaving = false,
}: TopNavBarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }
  // Navigation items - only Overview and Settings
  const navItems = [
    { name: 'Overview', href: '#' },
    { name: 'Settings', href: '#' },
  ]
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and workspace info */}
          <div className="flex items-center gap-8">
            {/* Logo with workspace info */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">PaperNest</h1>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <div className="px-2">/</div>
                <div className="flex items-center gap-1">
                  <span>{selectedWorkspace?.workspace?.title || 'No Workspace'}</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                    {selectedWorkspace?.role || 'Private'}
                  </span>

                  {/* Workspace Selector Modal */}
                  {onSelectWorkspace && onCreateWorkspace && onJoinWorkspace && (
                    <WorkspaceSelectorModal
                      selectedWorkspace={selectedWorkspace}
                      userWorkspaces={userWorkspaces}
                      onSelectWorkspace={onSelectWorkspace}
                      onCreateWorkspace={onCreateWorkspace}
                      onJoinWorkspace={onJoinWorkspace}
                      isLoading={isWorkspaceLoading}
                      isSaving={isWorkspaceSaving}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - User controls */}
          <div className="flex items-center gap-3">
            <select className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700">
              <option>
                {currentUser ? `${currentUser.name} (${currentUser.role})` : '(1) - Online user'}
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

              {/* User Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1">
                    {currentUser ? (
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {getInitials(currentUser.name)}
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {currentUser && (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-gray-600">{currentUser.email}</p>
                        <p className="text-xs text-gray-500">{currentUser.role}</p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {/* Navigation tabs - only Overview and Settings */}
        {!isMinimal && (
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onTabChange?.(item.name)}
                className={`text-sm font-medium py-2 transition-colors ${
                  activeTab === item.name ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
