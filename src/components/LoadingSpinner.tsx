import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function LoadingSpinner() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getLoadingMessage = () => {
    if (elapsed < 3) return "Initializing connection..."
    if (elapsed < 6) return "Fetching trivia questions..."
    if (elapsed < 10) return "Processing data..."
    return "Almost ready..."
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Loading Trivia Visualizer
              </h3>
              <p className="text-sm text-muted-foreground animate-pulse">
                {getLoadingMessage()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ErrorMessage({ error }: { error: string }) {
  const isRateLimit = error.toLowerCase().includes('rate') || error.toLowerCase().includes('retry')
  
  return (
    <Card>
      <CardContent className="p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-destructive text-center">
            <h3 className="font-semibold mb-2">
              {isRateLimit ? 'Rate Limited' : 'Error loading data'}
            </h3>
            <p className="text-sm">{error}</p>
            {isRateLimit ? (
              <p className="text-xs text-muted-foreground mt-2">
                The Open Trivia Database limits requests to 1 per 5 seconds. Please wait a moment before retrying.
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
