import { Suspense } from 'react'

import { BlogPostListSkeleton } from '@/components/shared/loading-skeleton'
import { BlogPostList } from '@/components/blog/blog-post-list'
import { listPostsByCategory, toBlogPostSummary } from '@/lib/notion/database'
import type { BlogPostSummary } from '@/lib/types/blog-post'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

async function CategoryListContent({
  category,
  page,
}: {
  category: string
  page: number
}) {
  const allPosts = await listPostsByCategory(category)

  if (allPosts.length === 0) {
    return (
      <div className="border-muted-foreground/25 rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">
          &quot;{category}&quot; 카테고리의 포스트가 없습니다.
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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params
  const queryParams = await searchParams
  const page = Math.max(1, parseInt(queryParams.page ?? '1', 10))
  const decodedCategory = decodeURIComponent(category)

  return (
    <div className="container space-y-12 py-12">
      {/* 제목 */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          카테고리: {decodedCategory}
        </h1>
        <p className="text-muted-foreground">
          &quot;{decodedCategory}&quot; 카테고리의 포스트입니다.
        </p>
      </div>

      {/* 포스트 목록 */}
      <Suspense fallback={<BlogPostListSkeleton />}>
        <CategoryListContent category={decodedCategory} page={page} />
      </Suspense>
    </div>
  )
}
