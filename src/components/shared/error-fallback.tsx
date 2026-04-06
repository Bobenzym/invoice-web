'use client'

import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorFallback({
  title = '오류가 발생했습니다',
  message = '요청을 처리하는 중에 문제가 발생했습니다.',
  onRetry,
  showRetry = true,
}: ErrorFallbackProps) {
  return (
    <div className="border-destructive/50 bg-destructive/10 flex flex-col items-center justify-center gap-4 rounded-lg border p-8">
      <AlertCircle className="text-destructive h-12 w-12" />
      <div className="text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {showRetry && onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          다시 시도
        </Button>
      )}
    </div>
  )
}
