import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TopNavBar } from '@/components/top-navbar'
import { Plus, Filter, Grid3X3, List, FileText, MoreHorizontal } from 'lucide-react'

const documents = [
  {
    id: 1,
    title: "PaperNest's Document",
    date: '3 Jan 2025',
    size: '6 Sites',
    type: 'doc',
  },
  {
    id: 2,
    title: "PaperNest's Document",
    date: '3 Jan 2025',
    size: '6 Sites',
    type: 'doc',
  },
  {
    id: 3,
    title: "PaperNest's Document",
    date: '3 Jan 2025',
    size: '6 Sites',
    type: 'doc',
  },
]

export function DocumentsContent() {
  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <TopNavBar activeTab="Overview" />

      {/* Welcome Section */}
      <div className="px-6 py-8 bg-gray-50 border-b">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Welcome to PaperNest Caldera!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Create stunning document and show the world of your research!
          </p>

          {/* Search Bar */}
          <div className="relative w-2xl">
            <Input
              placeholder="Ask or find anything from your workspace..."
              className="pl-4 pr-20 py-3 text-sm bg-white border border-gray-300 rounded-lg"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                Ask
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                Research
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                Build
              </Button>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Hari ini</h3>

          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg bg-white shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-r-none border-r bg-purple-600 text-white hover:bg-purple-700"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-l-none hover:bg-gray-50"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter */}
            <Button variant="outline" size="sm" className="bg-white shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <Card
              key={document.id}
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-gray-100 border-gray-200 hover:border-gray-300 relative"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-gray-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {document.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{document.date}</span>
                    <span>•</span>
                    <span>{document.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg h-12 w-12 rounded-full p-0">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  )
}
