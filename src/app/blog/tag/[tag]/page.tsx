import { Suspense } from 'react'

import { BlogPostListSkeleton } from '@/components/shared/loading-skeleton'
import { BlogPostList } from '@/components/blog/blog-post-list'
import { listPostsByTag, toBlogPostSummary } from '@/lib/notion/database'
import type { BlogPostSummary } from '@/lib/types/blog-post'

interface TagPageProps {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}

async function TagListContent({ tag, page }: { tag: string; page: number }) {
  const allPosts = await listPostsByTag(tag)

  if (allPosts.length === 0) {
    return (
      <div className="border-muted-foreground/25 rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">
          &quot;{tag}&quot; 태그의 포스트가 없습니다.
        </p>
      </div>
    )
  }

  const limit = 10
  const total = allPosts.length
  const totalPages = Math.ceil(total / limit)

  if (page > totalPages) {
    return (
      <div className="border-muted-foreground/25 rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">페이지를 초과했습니다.</p>
      </div>
    )
  }

  const startIndex = (page - 1) * limit
  const paginatedPosts = allPosts.slice(startIndex, startIndex + limit)

  const posts: BlogPostSummary[] = paginatedPosts.map(post => ({
    ...toBlogPostSummary(post),
    publishedAt: new Date(post.publishedAt),
  }))

  return (
    <BlogPostList posts={posts} currentPage={page} totalPages={totalPages} />
  )
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params
  const queryParams = await searchParams
  const page = Math.max(1, parseInt(queryParams.page ?? '1', 10))
  const decodedTag = decodeURIComponent(tag)

  return (
    <div className="container space-y-12 py-12">
      {/* 제목 */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          태그: {decodedTag}
        </h1>
        <p className="text-muted-foreground">
          &quot;{decodedTag}&quot; 태그로 분류된 포스트입니다.
        </p>
      </div>

      {/* 포스트 목록 */}
      <Suspense fallback={<BlogPostListSkeleton />}>
        <TagListContent tag={decodedTag} page={page} />
      </Suspense>
    </div>
  )
}
