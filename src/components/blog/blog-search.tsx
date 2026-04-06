'use client'

import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BlogPostCard } from './blog-post-card'
import type { BlogPostSummary } from '@/lib/types/blog-post'
import type { ApiPaginatedResponse } from '@/lib/types/api'

export function BlogSearch() {
  const [keyword, setKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<BlogPostSummary[]>([])
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      const trimmedKeyword = keyword.trim()
      if (!trimmedKeyword || trimmedKeyword.length < 2) {
        setError('2글자 이상의 검색어를 입력해주세요.')
        setResults([])
        return
      }

      setIsSearching(true)
      setError('')
      setHasSearched(true)

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedKeyword)}&page=1&limit=20`
        )

        if (!res.ok) {
          const errorData = await res.json()
          setError(errorData.error || '검색 중에 오류가 발생했습니다.')
          setResults([])
          return
        }

        const data: ApiPaginatedResponse<BlogPostSummary> = await res.json()

        if (!data.success || !data.data) {
          setError('검색 결과를 불러올 수 없습니다.')
          setResults([])
          return
        }

        const posts: BlogPostSummary[] = data.data.map(post => ({
          ...post,
          publishedAt: new Date(post.publishedAt),
        }))

        setResults(posts)
        if (posts.length === 0) {
          setError(`"${trimmedKeyword}"에 대한 검색 결과가 없습니다.`)
        }
      } catch (err) {
        console.error('Search error:', err)
        setError('검색 중에 오류가 발생했습니다.')
        setResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [keyword]
  )

  return (
    <div className="space-y-6">
      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="검색어를 입력하세요..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            disabled={isSearching}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? '검색 중...' : '검색'}
          </Button>
        </div>
      </form>

      {/* 에러 메시지 */}
      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
          {error}
        </div>
      )}

      {/* 검색 결과 */}
      {hasSearched && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {results.length}개의 검색 결과
          </p>
          <div className="grid gap-6">
            {results.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* 검색 안 함 상태 */}
      {!hasSearched && (
        <div className="border-muted-foreground/25 rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">
            검색어를 입력하고 검색 버튼을 클릭하세요.
          </p>
        </div>
      )}
    </div>
  )
}
