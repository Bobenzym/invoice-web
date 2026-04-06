import { NotionBlockRenderer } from '@/components/notion/notion-block-renderer'
import type { BlogPost } from '@/lib/types/blog-post'

interface BlogPostContentProps {
  post: BlogPost
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <NotionBlockRenderer blocks={post.content} />
    </article>
  )
}
