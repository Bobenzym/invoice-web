'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const previousPage = currentPage - 1
  const nextPage = currentPage + 1

  const hasPrevious = previousPage >= 1
  const hasNext = nextPage <= totalPages

  return (
    <div className="flex items-center justify-center gap-4">
      {hasPrevious ? (
        <Link href={`${baseUrl}?page=${previousPage}`}>
          <Button variant="outline">이전</Button>
        </Link>
      ) : (
        <Button variant="outline" disabled>
          이전
        </Button>
      )}

      <div className="text-muted-foreground text-sm">
        <span className="font-semibold">{currentPage}</span> / {totalPages}
      </div>

      {hasNext ? (
        <Link href={`${baseUrl}?page=${nextPage}`}>
          <Button variant="outline">다음</Button>
        </Link>
      ) : (
        <Button variant="outline" disabled>
          다음
        </Button>
      )}
    </div>
  )
}
