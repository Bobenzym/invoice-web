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
    <div className="container py-12">
      <ErrorFallback
        title="포스트를 로드할 수 없습니다"
        message={error.message || '포스트를 불러오는 중에 오류가 발생했습니다.'}
        onRetry={reset}
        showRetry
      />
    </div>
  )
}
