import { useEffect, useState } from 'react'

interface MDEditorClientProps {
  value: string
  onChange: (value: string | undefined) => void
  height?: number
  preview?: 'edit' | 'live' | 'preview'
  hideToolbar?: boolean
  visibleDragbar?: boolean
  'data-color-mode'?: 'light' | 'dark'
}

export function MDEditorClient({
  value,
  onChange,
  height = 600,
  preview = 'edit',
  hideToolbar = false,
  visibleDragbar = false,
  'data-color-mode': colorMode = 'light',
}: MDEditorClientProps) {
  const [MDEditor, setMDEditor] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import MDEditor only on client side
    import('@uiw/react-md-editor')
      .then((module) => {
        setMDEditor(() => module.default)
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error('Failed to load MDEditor:', error)
      })
  }, [])

  if (!isLoaded || !MDEditor) {
    return (
      <div
        className="border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  return (
    <MDEditor
      value={value}
      onChange={onChange}
      height={height}
      preview={preview}
      hideToolbar={hideToolbar}
      visibleDragbar={visibleDragbar}
      data-color-mode={colorMode}
    />
  )
}
