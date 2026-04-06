import { Pagination } from '@/components/shared/pagination'
import { BlogPostCard } from './blog-post-card'
import type { BlogPostSummary } from '@/lib/types/blog-post'

interface BlogPostListProps {
  posts: BlogPostSummary[]
  currentPage: number
  totalPages: number
}

export function BlogPostList({
  posts,
  currentPage,
  totalPages,
}: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="border-muted-foreground/25 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
        <p className="text-muted-foreground">포스트가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 포스트 목록 */}
      <div className="grid gap-6">
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/blog"
        />
      )}
    </div>
  )
}
