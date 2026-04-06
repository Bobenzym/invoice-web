import Image from 'next/image'

import { CategoryBadge } from '@/components/shared/category-badge'
import { ReadingTime } from '@/components/shared/reading-time'
import { TagBadge } from '@/components/shared/tag-badge'
import type { BlogPost } from '@/lib/types/blog-post'
import { formatDate } from '@/lib/utils'

interface BlogPostHeaderProps {
  post: BlogPost
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="space-y-6">
      {/* 커버 이미지 */}
      {post.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 제목 */}
      <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

      {/* 메타 정보 */}
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
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
    </header>
  )
}
