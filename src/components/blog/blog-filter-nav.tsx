import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BlogFilterNavProps {
  categories: string[]
  tags: string[]
  currentCategory?: string
  currentTag?: string
}

export function BlogFilterNav({
  categories,
  tags,
  currentCategory,
  currentTag,
}: BlogFilterNavProps) {
  return (
    <div className="border-border bg-card space-y-6 rounded-lg border p-6">
      {/* 카테고리 필터 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!currentCategory ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/blog">모두</Link>
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={currentCategory === category ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <Link href={`/blog/category/${category}`}>{category}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* 태그 필터 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">태그</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge
              key={tag}
              variant={currentTag === tag ? 'default' : 'secondary'}
              asChild
            >
              <Link href={`/blog/tag/${tag}`}>{tag}</Link>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
