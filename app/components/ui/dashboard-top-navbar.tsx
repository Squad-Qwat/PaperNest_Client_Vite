import { Button } from '../ui/button'
import { Search, Bell, Settings, ChevronsUpDown, UserRoundPlus } from 'lucide-react'

interface TopNavBarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  isMinimal?: boolean
  title?: string
  selectedDocumentId?: string
}

export function DashboardTopNavBar({
  activeTab = 'Overview',
  onTabChange,
  isMinimal = false,
  title = 'Dashboard',
  selectedDocumentId,
}: TopNavBarProps) {
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
                  <span>My Workspace</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                    Private
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - User controls */}
          <div className="flex items-center gap-3">
            <select className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700">
              <option>(1) - Online user</option>
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
