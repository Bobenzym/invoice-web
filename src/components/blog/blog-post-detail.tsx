import { BlogPostContent } from './blog-post-content'
import { BlogPostFooter } from './blog-post-footer'
import { BlogPostHeader } from './blog-post-header'
import { BlogPostToc } from './blog-post-toc'
import type { BlogPost } from '@/lib/types/blog-post'

interface BlogPostDetailProps {
  post: BlogPost
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const contentHtml = JSON.stringify(post.content)

  return (
    <div className="space-y-12">
      {/* 헤더 */}
      <BlogPostHeader post={post} />

      {/* 본문 + 목차 */}
      <div className="grid gap-8 lg:grid-cols-[1fr_250px]">
        <BlogPostContent post={post} />
        <BlogPostToc content={contentHtml} />
      </div>

      {/* 푸터 */}
      <BlogPostFooter slug={post.slug} />
    </div>
  )
}
