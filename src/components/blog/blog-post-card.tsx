import Image from 'next/image'
import Link from 'next/link'

import { CategoryBadge } from '@/components/shared/category-badge'
import { ReadingTime } from '@/components/shared/reading-time'
import { TagBadge } from '@/components/shared/tag-badge'
import type { BlogPostSummary } from '@/lib/types/blog-post'
import { formatDate } from '@/lib/utils'

interface BlogPostCardProps {
  post: BlogPostSummary
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group border-border bg-card hover:border-primary rounded-lg border p-6 transition-all hover:shadow-lg">
      <div className="space-y-4">
        {/* 커버 이미지 */}
        {post.coverImage && (
          <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          </div>
        )}

        {/* 제목 */}
        <Link href={`/blog/${post.slug}`} className="group/link block">
          <h2 className="group-hover/link:text-primary mb-2 text-xl font-bold tracking-tight transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* 요약 */}
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {post.excerpt}
        </p>

        {/* 메타 정보 */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <span>•</span>
          <ReadingTime minutes={post.readingTime} />
          <span>•</span>
          <span>{post.author}</span>
        </div>

        {/* 태그 및 카테고리 */}
        <div className="flex flex-wrap gap-2">
          {post.category && (
            <CategoryBadge
              category={post.category}
              href={`/blog/category/${post.category}`}
            />
          )}
          {post.tags.map(tag => (
            <TagBadge key={tag} tag={tag} href={`/blog/tag/${tag}`} />
          ))}
        </div>
      </div>
    </article>
  )
}
