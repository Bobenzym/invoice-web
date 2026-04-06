'use client'

import { ErrorFallback } from '@/components/shared/error-fallback'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container flex items-center justify-center py-24">
      <ErrorFallback
        title="애플리케이션 오류"
        message={error.message || '예상치 못한 오류가 발생했습니다.'}
        onRetry={reset}
        showRetry
      />
    </div>
  )
}
