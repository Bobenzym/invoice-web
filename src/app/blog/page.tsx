import { Suspense } from 'react'

import { BlogPostListSkeleton } from '@/components/shared/loading-skeleton'
import { BlogPostList } from '@/components/blog/blog-post-list'
import type { BlogPostSummary } from '@/lib/types/blog-post'
import type { ApiPaginatedResponse } from '@/lib/types/api'

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

async function BlogListContent({ page }: { page: number }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts?page=${page}&limit=10`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    throw new Error('포스트를 불러올 수 없습니다.')
  }

  const data: ApiPaginatedResponse<BlogPostSummary> = await res.json()

  if (!data.success || !data.data) {
    throw new Error('포스트 데이터 형식이 유효하지 않습니다.')
  }

  const posts: BlogPostSummary[] = data.data.map(post => ({
    ...post,
    publishedAt: new Date(post.publishedAt),
  }))

  return (
    <BlogPostList
      posts={posts}
      currentPage={data.pagination.currentPage}
      totalPages={data.pagination.totalPages}
    />
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  return (
    <div className="container space-y-12 py-12">
      {/* 제목 */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">블로그</h1>
        <p className="text-muted-foreground">
          개발, 기술, 일상에 관한 이야기를 나누고 있습니다.
        </p>
      </div>

      {/* 포스트 목록 */}
      <Suspense fallback={<BlogPostListSkeleton />}>
        <BlogListContent page={page} />
      </Suspense>
    </div>
  )
}
